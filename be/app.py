import asyncio
import time
import uuid
from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import APIRouter
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.websockets import WebSocket, WebSocketDisconnect

from src.config.app_config import get_settings
from src.controllers import user_controller, bot_controller, guest_controller
from src.controllers.auth_controller import auth_router
from src.controllers.bot_controller import bot_router
from src.controllers.knowledge_controller import knowledge_router
from src.controllers.query_controller import query_router
from src.db_vector.chat_model import generate_stream
from src.dtos.schema_in.query import GeneratePayload
from src.models.all_models import Bot, Query, Knowledge, Chat, File, Question, Answer
from src.models.all_models import User
from src.utils.minio_util import create_bucket_if_not_exist
from src.utils.redis_util import set_user_history_chat

settings = get_settings()

# Global flag to track initialization status
_db_initialized = False
_initialization_lock = asyncio.Lock()


async def initialize_database():
    """Initialize the database connection and models"""
    global _db_initialized

    async with _initialization_lock:
        if _db_initialized:
            return

        try:
            mongo_string = settings.MONGO_CONNECTION_STRING
            db_client = AsyncIOMotorClient(mongo_string)
            database = db_client[settings.MONGO_DB_NAME]
            await init_beanie(
                database=database,
                document_models=[Knowledge, Bot, Query, User, Chat, File, Question, Answer]
            )
            create_bucket_if_not_exist()
            _db_initialized = True
            print("Database initialized successfully")
        except Exception as e:
            print(f"Database initialization failed: {e}")
            raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    await initialize_database()
    yield
    # Shutdown (if needed)
    pass


app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

Instrumentator().instrument(app).expose(app)
import json


@app.websocket("/ws/chats/{chat_id}/generate_stream")
async def websocket_generate_stream2(chat_id: uuid.UUID, websocket: WebSocket):
    await websocket.accept()

    # Wait for database initialization if not ready
    if not _db_initialized:
        try:
            await initialize_database()
        except Exception as e:
            await websocket.send_json({
                "message": f"Database initialization failed: {str(e)}",
                "finish_reason": "error",
                "full_text": str(e)
            })
            await websocket.close()
            return

    while True:
        try:
            data = await websocket.receive_text()
            print(f"Received data: {data}")
            payload1 = json.loads(data)
            query_id = payload1['query_id']

            # Find the query with proper error handling
            try:
                query = await Query.find_one(Query.query_id == uuid.UUID(query_id))
                if not query:
                    await websocket.send_json({
                        "message": "Query not found",
                        "finish_reason": "error",
                        "full_text": "Query not found"
                    })
                    continue
            except Exception as db_error:
                await websocket.send_json({
                    "message": f"Database error: {str(db_error)}",
                    "finish_reason": "error",
                    "full_text": str(db_error)
                })
                continue

            user_id = payload1['user_id']
            payload = GeneratePayload(
                user_id=user_id,
                query_id=query_id,
                query=payload1['query'],
                context=payload1['context'],
                conversation=payload1['conversation']
            )

            full_text = ""
            async for chunk in generate_stream(payload.query, payload.context, payload.conversation):
                print(chunk)
                if chunk.choices[0].finish_reason == "stop":
                    await websocket.send_json({
                        "message": "Stream completed successfully",
                        "finish_reason": "stop",
                        "full_text": full_text
                    })
                    answer = Answer(
                        content=full_text,
                        prompt_token=chunk.x_groq.usage.prompt_tokens,
                        completion_token=chunk.x_groq.usage.completion_tokens,
                        total_time=chunk.x_groq.usage.total_time,
                        role="assistant"
                    )
                    insert_ = await answer.insert()
                    query.answer = insert_
                    await query.save()
                    set_user_history_chat(str(user_id), str(chat_id), full_text, "assistant", query_id)
                else:
                    full_text += chunk.choices[0].delta.content
                    await websocket.send_json({
                        "message": chunk.choices[0].delta.content,
                        "finish_reason": None,
                        "full_text": full_text
                    })
        except WebSocketDisconnect:
            print("WebSocket disconnected")
            break
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            await websocket.send_json({
                "message": str(e),
                "finish_reason": "error",
                "full_text": str(e)
            })
            break

    print("WebSocket connection closed")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.get("/health", status_code=200)(lambda: {"status": "ok"})

api_router = APIRouter()
api_router.include_router(auth_router, prefix='/auth', tags=["auth"])
api_router.include_router(user_controller.user_router, prefix='/users', tags=["users"])
api_router.include_router(bot_controller.chat_bot_router, prefix='/chats-bot', tags=["chats bots"])
api_router.include_router(bot_controller.knowledge_bot_router, prefix='/knowledges-bot',
                          tags=["knowledges bots"])
api_router.include_router(query_router, prefix='/queries', tags=["chat queries"])
api_router.include_router(bot_router, prefix='/bots', tags=["users bots"])
api_router.include_router(knowledge_router, prefix='/knowledges', tags=["knowledges"])
app.include_router(guest_controller.guest_router, prefix='/guest', tags=["guest"])
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": (
                f"Failed method {request.method} at URL {request.url}."
                f" Exception message is {exc!r}."
            )
        },
    )


async def log_request_middleware(request: Request, call_next):
    request_start_time = time.monotonic()
    response = await call_next(request)
    request_duration = time.monotonic() - request_start_time
    log_data = {
        "method": request.method,
        "path": request.url.path,
        "duration": request_duration
    }
    print(log_data)
    return response


app.middleware("http")(log_request_middleware)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="localhost", port=settings.BACKEND_PORT, reload=True)
