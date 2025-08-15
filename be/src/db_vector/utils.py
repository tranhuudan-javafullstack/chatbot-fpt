import tiktoken
from langchain_openai import OpenAIEmbeddings, AzureChatOpenAI
from pydantic import SecretStr
from tenacity import retry, wait_exponential, stop_after_attempt

from src.config.app_config import get_settings

settings = get_settings()


@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def get_model_chat():
    return AzureChatOpenAI(
        model=settings.OPENAI_MODEL_CHAT_NAME,
        azure_deployment=settings.OPENAI_MODEL_CHAT_NAME,
        azure_endpoint=settings.OPENAI_MODEL_HOST,
        api_key=SecretStr(settings.OPENAI_MODEL_CHAT_KEY),
        temperature=0,
        api_version="2024-02-15-preview"
    )


@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def generate_embeddings(text: str):
    embedd = OpenAIEmbeddings(
        model=settings.OPENAI_MODEL_EMBEDDING_NAME,
        base_url=settings.OPENAI_MODEL_HOST,
        api_key=SecretStr(settings.OPENAI_MODEL_EMBEDDING_KEY)
    )
    return embedd.embed_query(text)


def count_tokens_by_encoding(text: str, encoding_name: str = "cl100k_base") -> int:
    if not text:
        return 0
    encoding = tiktoken.get_encoding(encoding_name)
    tokens = encoding.encode(text)
    return len(tokens)


def get_recursive_token_chunk(chunk_size=256):
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    MARKDOWN_SEPARATORS = [
        "\n#{1,6} ",
        "```\n",
        "\n\\*\\*\\*+\n",
        "\n---+\n",
        "\n___+\n",
        "\n\n",
        "\n",
        " ",
        "",
    ]
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        model_name="gpt-4",
        chunk_size=chunk_size,
        chunk_overlap=int(chunk_size / 10),
        add_start_index=True,
        strip_whitespace=True,
        separators=MARKDOWN_SEPARATORS,
    )
    return text_splitter


def extract_keywords(text: str, num_keywords: int = 10) -> str:
    """
    Extract keywords from the text using OpenAI's chat model.
    Returns a comma-separated string of keywords.
    """
    if not text:
        return ""

    prompt = (
        f"Trích xuất {num_keywords} từ khóa quan trọng nhất từ văn bản sau, "
        f"trả về chuỗi các từ khóa cách nhau bằng dấu phẩy:\n\n{text}"
    )

    response = get_model_chat().invoke(prompt)
    if not response or not hasattr(response, "content"):
        return ""

    # Chuẩn hóa chuỗi kết quả
    return ", ".join([kw.strip() for kw in response.content.strip().split(",") if kw.strip()])


def extract_entities(text: str) -> str:
    """
    Extract named entities from the text using OpenAI's chat model.
    Returns a comma-separated string of entities.
    """
    if not text:
        return ""

    prompt = (
        "Trích xuất tất cả các thực thể (tên người, tổ chức, địa điểm, ngày tháng, số liệu, sản phẩm, v.v.) "
        "từ văn bản sau và trả về chuỗi các thực thể cách nhau bằng dấu phẩy:\n\n"
        f"{text}"
    )

    response = get_model_chat().invoke(prompt)
    if not response or not hasattr(response, "content"):
        return ""

    return ", ".join([ent.strip() for ent in response.content.strip().split(",") if ent.strip()])


def generate_title(text: str) -> str:
    """
    Generate a concise, descriptive title for the given text.
    Returns a single string.
    """
    if not text:
        return ""

    prompt = (
        "Tạo một tiêu đề ngắn gọn, súc tích và mô tả nội dung chính của văn bản sau:\n\n"
        f"{text}"
    )

    response = get_model_chat().invoke(prompt)
    if not response or not hasattr(response, "content"):
        return ""

    return response.content.strip()


def generate_summary(text: str, max_sentences: int = 3) -> str:
    """
    Generate a concise summary for the given text.
    Returns a single string.
    """
    if not text:
        return ""

    prompt = (
        f"Tóm tắt nội dung văn bản sau thành khoảng {max_sentences} câu ngắn gọn, "
        "đầy đủ ý chính:\n\n"
        f"{text}"
    )

    response = get_model_chat().invoke(prompt)
    if not response or not hasattr(response, "content"):
        return ""

    return response.content.strip()
