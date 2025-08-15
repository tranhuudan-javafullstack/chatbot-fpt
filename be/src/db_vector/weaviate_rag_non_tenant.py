import os
import warnings
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Callable

import weaviate
import weaviate.classes as wvc
from fastapi import HTTPException
from langchain.docstore.document import Document as LangchainDocument
from langchain_community.document_loaders import TextLoader
from langchain_pymupdf4llm import PyMuPDF4LLMLoader
from minio import Minio
from pydantic import AnyHttpUrl
from weaviate.classes.config import Configure
from weaviate.classes.config import Property, DataType
from weaviate.classes.query import Filter
from weaviate.classes.query import Sort
from weaviate.client import WeaviateClient
from weaviate.collections.classes.aggregate import GroupByAggregate
from weaviate.collections.collection import Collection
from weaviate.config import ConnectionConfig
from weaviate.config import Timeout, AdditionalConfig
from weaviate.util import generate_uuid5

from src.config.app_config import get_settings
from src.db_vector.utils import generate_embeddings, get_recursive_token_chunk, extract_keywords, extract_entities, \
    generate_title, generate_summary
from src.dtos.schema_out.knowledge import ChunkOut
from src.models.all_models import ChunkSchema
from src.utils.app_util import count_token, clean_input
from src.utils.minio_util import delete_from_minio, delete_folder_from_minio

warnings.filterwarnings("ignore")
warnings.filterwarnings("ignore", category=UserWarning, module="google.protobuf")
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=ResourceWarning)
CUSTOM_PROPERTIES = [
    "chunks_content", "url", "chunk_id",
    "knowledge_name", "file_name",
    "after_clean", "source",
    "page_label",
    "prev_uuid", "next_uuid", "created_at", "key_word", "updated_at", "version", "tags", "entity", "language",
    "chunks_vector", "title", "summary"
]

settings = get_settings()
import tempfile


def get_weaviate_client() -> WeaviateClient:
    return weaviate.connect_to_local(
        host=settings.WEAVIATE_HOST,
        port=8080,
        grpc_port=50051,
        headers={
            "X-OpenAI-Api-Key": settings.OPENAI_MODEL_EMBEDDING_KEY
        },
        additional_config=AdditionalConfig(
            timeout=Timeout(init=2, query=120, insert=300),
            connection=ConnectionConfig(
                session_pool_connections=30,  # Tăng số lượng kết nối mặc định
                session_pool_maxsize=150,  # Tăng số lượng kết nối tối đa
                session_pool_max_retries=5  # Tăng số lần thử lại
            )
        ),
        # from weaviate_test.src.models.all_models import Auth
        # auth_credentials=Auth.api_key("user-a-key")
    )


def create_for_user(document: str) -> Collection:
    common_properties = [
        Property(name="chunks_content", data_type=DataType.TEXT, index_searchable=True),
        Property(name="page_label", data_type=DataType.TEXT),
        Property(name="url", data_type=DataType.TEXT),
        Property(name="source", data_type=DataType.TEXT, index_filterable=True),
        Property(name="chunk_id", data_type=DataType.NUMBER),
        Property(name="after_clean", data_type=DataType.TEXT),
        Property(name="knowledge_name", data_type=DataType.TEXT, index_filterable=True),
        Property(name="file_name", data_type=DataType.TEXT, index_filterable=True),
        Property(name="prev_uuid", data_type=DataType.UUID_ARRAY),
        Property(name="next_uuid", data_type=DataType.UUID_ARRAY),
        Property(name="created_at", data_type=DataType.TEXT, index_filterable=True),
        Property(name="updated_at", data_type=DataType.TEXT, index_filterable=True),
        Property(name="version", data_type=DataType.NUMBER, index_filterable=True),
        Property(name="key_word", data_type=DataType.TEXT_ARRAY, index_filterable=True),
        Property(name="tags", data_type=DataType.TEXT_ARRAY, index_filterable=True),
        Property(name="entity", data_type=DataType.TEXT_ARRAY, index_filterable=True),
        Property(name="language", data_type=DataType.TEXT, index_filterable=True),
        Property(name="title", data_type=DataType.TEXT, index_searchable=False),
        Property(name="summary", data_type=DataType.TEXT, index_searchable=False),
    ]

    inverted_index_config = Configure.inverted_index(
        index_timestamps=True,
        index_null_state=True,
        index_property_length=True,
        bm25_k1=1.25,
        bm25_b=0.75,
    )

    vectorizer_config = Configure.Vectors.text2vec_openai(
        base_url=AnyHttpUrl(settings.OPENAI_MODEL_HOST),
        model=settings.OPENAI_MODEL_EMBEDDING_NAME,
        dimensions=1536,
        model_version=settings.OPENAI_MODEL_CHAT_VERSION,
        vectorize_collection_name=True,
        vector_index_config=Configure.VectorIndex.dynamic(
            distance_metric=weaviate.classes.config.VectorDistances.COSINE,
            threshold=25000,
            hnsw=Configure.VectorIndex.hnsw(
                ef_construction=128,
                cleanup_interval_seconds=300,
                ef=-1,
                max_connections=32,
                dynamic_ef_min=5,
                dynamic_ef_max=500,
                dynamic_ef_factor=8,
                vector_cache_max_objects=1000000,
                flat_search_cutoff=40000,
                quantizer=Configure.VectorIndex.Quantizer.bq(
                    rescore_limit=200,
                    cache=True,
                ),
            ),
            flat=Configure.VectorIndex.flat(
                quantizer=Configure.VectorIndex.Quantizer.bq(cache=True),
                vector_cache_max_objects=1000000,
            )
        )
    )
    with get_weaviate_client() as weaviate_client:
        return weaviate_client.collections.create(name=document,
                                                  properties=common_properties,
                                                  inverted_index_config=inverted_index_config,
                                                  vector_config=vectorizer_config)


def load_and_clean_file(file_type: str, file_path: str, url: str):
    """
    Load và clean file từ MinIO storage

    Args:
        file_type: Loại file (pdf, txt, docx)
        file_path: Đường dẫn file trong MinIO bucket
        url: URL của file

    Returns:
        Tuple[List[LangchainDocument], int]: (chunks đã được split, số trang gốc)
    """
    # Khởi tạo MinIO client
    minio_client = Minio(
        f"{settings.MINIO_HOST}:{settings.MINIO_PORT}",
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_ACCESS_KEY,
        secure=False,
        region=settings.REGION_NAME,
    )

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Download file từ MinIO
            local_file_path = os.path.join(temp_dir, os.path.basename(file_path))
            minio_client.fget_object(settings.BUCKET_NAME, file_path, local_file_path)
            print(local_file_path)

            # Load file sử dụng loader phù hợp
            if file_type == "txt":
                pages = TextLoader(local_file_path, encoding='UTF-8').load()
            if file_type == "pdf":
                pages = PyMuPDF4LLMLoader(local_file_path, mode="page", pages_delimiter="")

            page_len = len(pages)

            # Clean content cho từng page (không sử dụng đa luồng)
            cleaned_pages = []
            for index, page in enumerate(pages):
                content = page.page_content
                clean_text = clean_input(content)
                properties = {
                    'source': file_path,
                    'url': url,
                    'page_label': f"{index + 1}/{page_len}",
                    'leng_content': len(content),
                    'leng_clean': len(clean_text),
                    'clean_text': clean_text
                }
                cleaned_page = LangchainDocument(page_content=clean_text, metadata=properties)
                cleaned_pages.append(cleaned_page)

            # Split documents thành chunks
            chunks = get_recursive_token_chunk(chunk_size=512).split_documents(cleaned_pages)

            return chunks, page_len

        except Exception as e:
            print(f"An error occurred while loading the file: {str(e)}")
            return [], 0


def batch_import_knowledge_in_user(document_name: str, knowledge_name: str, file_type: str, file_path: str,
                                   url: str):
    chunks, pages = load_and_clean_file(file_type, file_path, url)
    file_name = os.path.basename(file_path)
    file_type2 = file_name.split(".")[-1]

    with get_weaviate_client() as weaviate_client:
        collection = weaviate_client.collections.get(document_name)
        data_rows = [
            {
                "chunks_content": chunk.page_content,
                "chunks_vector": chunk.metadata.get("clean_text"),
                "source": chunk.metadata.get('source'),
                "url": chunk.metadata.get('url'),
                "chunk_id": index,
                "file_type": file_type2,
                "page_label": f"{chunk.metadata.get('page_label')}/ {pages}",
                "after_clean": f"{chunk.metadata.get('leng_clean')}/{chunk.metadata.get('leng_content')}",
                "knowledge_name": knowledge_name,
                "file_name": file_name,
                "created_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "key_word": extract_keywords(chunk.metadata.get("clean_text"), 10),
                "updated_at": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "version": 1,
                "tags": [],
                "entity": extract_entities(chunk.metadata.get("clean_text")),
                "language": "vi",
                "title": generate_title(chunk.metadata.get("clean_text")),
                "summary": generate_summary(chunk.metadata.get("clean_text")),
            } for index, chunk in enumerate(chunks)
        ]
        for data_row in data_rows:
            uuid_ = generate_uuid5(data_row)
            data_row["uuid"] = uuid_
        for i, data_row in enumerate(data_rows):
            # Lấy UUID của hàng trước
            prev_uuids = []
            if i > 0:
                prev_uuids.append(data_rows[i - 1]["uuid"])

            # Lấy UUID của hàng sau
            next_uuids = []
            if i < len(data_rows) - 1:
                next_uuids.append(data_rows[i + 1]["uuid"])

            # Thêm vào data_row
            data_row["prev_uuid"] = prev_uuids
            data_row["next_uuid"] = next_uuids

        def add_object_to_batch(batch_run: Callable, data_row: dict) -> None:
            batch_run.add_object(
                properties=data_row,
                uuid=data_row["uuid"],
                vector=generate_embeddings(data_row["chunks_vector"])
            )

        with collection.batch.dynamic() as batch_run:
            with ThreadPoolExecutor() as executor:
                list(executor.map(lambda row: add_object_to_batch(batch_run, row), data_rows))

    return len(chunks), pages


def search_in_knowledge_user(document_name: str, query: str, knowledge_name: List[str]) -> List[ChunkSchema]:
    if count_token(query) > 258:
        raise HTTPException(status_code=400, detail="Query too long")
    query_vector = generate_embeddings(query)
    with get_weaviate_client() as client:
        if not client.collections.exists(document_name):
            raise HTTPException(status_code=400, detail="Document not found")
        collection = client.collections.get(document_name)
        response = collection.query.hybrid(
            query=query,
            alpha=0.75,
            limit=5,
            offset=0,
            fusion_type=wvc.query.HybridFusion.RELATIVE_SCORE,
            return_metadata=wvc.query.MetadataQuery(
                certainty=True, creation_time=True, distance=True,
                score=True, is_consistent=True, explain_score=True
            ),
            target_vector=document_name,
            vector=wvc.query.HybridVector.near_vector(query_vector, certainty=0.5),
            return_properties=CUSTOM_PROPERTIES,
            query_properties=["chunks_content"],
            auto_limit=2,
            filters=Filter.by_property("source").contains_any(knowledge_name),
        )
        results = []
        for item in response.objects:
            results.append(ChunkSchema(
                **item.properties,
                score=item.metadata.score,
                explain_score=item.metadata.explain_score,
                chunk_uuid=item.uuid,
                rerank_score=item.metadata.rerank_score
            ))
            prev_uuid = item.properties.get("prev_uuid")
            next_uuid = item.properties.get("next_uuid")
            if prev_uuid:
                for prev in prev_uuid:
                    prev_obj = read_object_by_id(document_name, prev)
                    results.append(ChunkSchema(
                        **prev_obj.properties,
                        chunk_uuid=prev_obj.uuid,
                    ))
            if next_uuid:
                for next in next_uuid:
                    next_obj = read_object_by_id(document_name, next)
                    results.append(ChunkSchema(
                        **next_obj.properties,
                        chunk_uuid=next_obj.uuid,
                    ))
        seen = set()
        unique_chunks = []
        for chunk in results:
            identifier = (chunk.chunk_id, chunk.source)
            if identifier not in seen:
                seen.add(identifier)
                unique_chunks.append(chunk)
        return unique_chunks


def get_all_chunk_in_file(doc_name, knowledge, source) -> list[ChunkOut]:
    rs2 = []
    with get_weaviate_client() as client:
        collection = client.collections.get(doc_name)
        for item in collection.iterator(
                include_vector=False,
                return_properties=CUSTOM_PROPERTIES,
                return_metadata=wvc.query.MetadataQuery(certainty=True, creation_time=True,
                                                        distance=True, score=True,
                                                        is_consistent=True, explain_score=True),
        ):
            if item.properties.get("source") == source and item.properties.get("knowledge_name") == knowledge:
                rs2.append(ChunkOut(**item.properties))
    rs2.sort(key=lambda chunk: chunk.chunk_id)
    return rs2


def delete_one_knowledge_user(document_name, key_name):
    with get_weaviate_client() as client:
        if not client.collections.exists(document_name):
            raise HTTPException(status_code=400, detail="Document not found")
        collection = client.collections.get(document_name)
        rsa = collection.data.delete_many(
            where=Filter.by_property("knowledge_name").equal(key_name),
            dry_run=True,
            verbose=True
        )
        delete_folder_from_minio(f"{document_name}/knowledge/{key_name}/")
        print(rsa)


def delete_one_file_knowledge(document_name, key_name, file):
    with get_weaviate_client() as client:
        if not client.collections.exists(document_name):
            raise HTTPException(status_code=400, detail="Document not found")
        collection = client.collections.get(document_name)
        rsa = collection.data.delete_many(
            where=Filter.by_property("knowledge_name").equal(key_name) & Filter.by_property("source").equal(file),
            dry_run=True,
            verbose=True
        )
        delete_from_minio(file)
        print(rsa)


def delete_many_knowledge_user(document_name, key_name, source):
    with get_weaviate_client() as client:
        if not client.collections.exists(document_name):
            raise HTTPException(status_code=400, detail="Document not found ")
        collection = client.collections.get(document_name)
        rsa = collection.data.delete_many(
            where=Filter.by_property("source").contains_all(source) & Filter.by_property("knowledge_name").equal(
                key_name),
            dry_run=True,
            verbose=True
        )
        for a in source:
            delete_from_minio(a)
        print(rsa)


def get_all_knowledge_in_user(doc_name):
    with get_weaviate_client() as client:
        collection = client.collections.get(doc_name)
        response = collection.query.fetch_objects(
            offset=0,
            return_properties=CUSTOM_PROPERTIES, include_vector=True,
            return_metadata=wvc.query.MetadataQuery(certainty=True, creation_time=True,
                                                    distance=True, score=True,
                                                    is_consistent=True, explain_score=True),
            sort=Sort.by_property(name="chunk_id", ascending=True).by_property(name="source",
                                                                               ascending=True).by_property(
                name="chunk_id",
                ascending=True).by_property(
                name="page_label",
                ascending=True),
        )
        for o in response.objects:
            print(o.properties)
        return response.objects


def aggregate_for_user(document_name):
    with get_weaviate_client() as client:
        collection = client.collections.get(document_name)
        response3 = collection.aggregate.over_all(
            group_by=GroupByAggregate(prop="source"),
            total_count=True,
            return_metrics=[
                wvc.query.Metrics("chunk_id").number(
                    count=True,
                    maximum=True,
                    mean=True,
                    median=True,
                    minimum=True,
                    mode=True,
                    sum_=True,
                ), wvc.query.Metrics("chunks_content").text(
                    top_occurrences_count=True,
                    top_occurrences_value=True,
                    min_occurrences=5
                )
            ]
        )
        return response3


def read_object_by_id(docname, id):
    with get_weaviate_client() as client:
        collection = client.collections.get(docname)
        if collection.data.exists(id):
            data_object = collection.query.fetch_object_by_id(
                id,
                # include_vector=True
            )
            # print(data_object)
            return data_object


if __name__ == '__main__':
    print(get_weaviate_client())
