from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings

# Tính toán env_path một lần
ENV_PATH = Path(__file__).parent.parent.parent / '.env'


class Settings(BaseSettings):
    # App configuration
    APP_NAME: str
    API_V1_STR: str

    # JWT configuration
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_MINUTES: int
    RESET_TOKEN_EXPIRE_MINUTES: int
    SESSION_RESET_TOKEN_EXPIRE_MINUTES: int
    SECRET_KEY: str

    # Redis configuration
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: Optional[str] = None
    REDIS_ADDR: Optional[str] = None
    REDIS_USER: Optional[str] = None

    # Email configuration
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_PORT: int
    MAIL_DEBUG: bool = False
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_FROM: str
    MAIL_FROM_NAME: str

    # Template configuration
    TEMPLATE_FOLDER: str

    # CORS configuration
    USE_CREDENTIALS: bool = True

    # Database configuration
    MONGO_CONNECTION_STRING: str
    MONGO_INITDB_ROOT_USERNAME: str
    MONGO_INITDB_ROOT_PASSWORD: str
    MONGO_DB_NAME: str

    # Server configuration
    BACKEND_PORT: int
    FRONTEND_PORT: int
    FRONTEND_HOST: str
    SERVER_IP: str

    # MinIO configuration
    MINIO_HOST: str
    MINIO_PORT: int
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_ACCESS_KEY: str
    BUCKET_NAME: str
    REGION_NAME: str
    MINIO_ALIAS: Optional[str] = None
    MINIO_HOST_URL: Optional[str] = None
    MINIO_SECRET_KEY: Optional[str] = None
    MINIO_BUCKET: Optional[str] = None
    MINIO_POLICY: Optional[str] = None

    # OpenAI configuration
    OPENAI_MODEL_EMBEDDING_NAME: str
    OPENAI_MODEL_HOST: str
    OPENAI_MODEL_EMBEDDING_KEY: str
    OPENAI_MODEL_CHAT_NAME: str
    OPENAI_MODEL_CHAT_KEY: str
    OPENAI_MODEL_CHAT_VERSION: str

    # Weaviate configuration
    WEAVIATE_HOST: Optional[str] = None

    # Ngrok configuration
    NGROK_API_KEY: Optional[str] = None

    # Grafana configuration
    GF_SECURITY_ADMIN_PASSWORD: Optional[str] = None
    GF_SECURITY_ADMIN_USER: Optional[str] = None

    # Computed fields
    @property
    def template_path(self) -> Path:
        """Get the full template folder path."""
        return Path(__file__).parent.parent / self.TEMPLATE_FOLDER

    @property
    def redis_url(self) -> str:
        """Get Redis connection URL."""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

    @property
    def minio_endpoint(self) -> str:
        """Get MinIO endpoint URL."""
        return f"http://{self.MINIO_HOST}:{self.MINIO_PORT}"

    @property
    def mongodb_url(self) -> str:
        """Get MongoDB connection URL (alternative to MONGO_CONNECTION_STRING)."""
        return f"mongodb://{self.MONGO_INITDB_ROOT_USERNAME}:{self.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/?authSource=admin"

    class Config:
        env_file = ENV_PATH
        env_file_encoding = 'utf-8'
        # Validation sẽ tự động convert string thành int/bool
        validate_assignment = True
        # Case sensitive để tránh nhầm lẫn
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.

    Returns:
        Settings: Singleton settings instance
    """
    return Settings()