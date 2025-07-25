from functools import lru_cache
from .services.file_service_impl import FileServiceImpl
from .services.ai_service_impl import AIServiceImpl
from .config import get_settings

@lru_cache()
def get_file_service():
    ai_service = get_ai_service()
    return FileServiceImpl(ai_service)

@lru_cache()
def get_ai_service():
    settings = get_settings()
    return AIServiceImpl(settings.openai_api_key)