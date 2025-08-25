from functools import lru_cache

from ..enums.ai_provider import AIProvider
from .config import get_settings
from .services.chat_service_impl import ChatServiceImpl
from .services.file_service_impl import FileServiceImpl
from .services.ollama_ai_service_impl import OllamaAIServiceImpl
from .services.openrouter_ai_service_impl import OpenRouterAIServiceImpl


@lru_cache()
def get_ai_service(ai_provider: AIProvider = AIProvider.OLLAMA):
    settings = get_settings()
    
    if ai_provider == AIProvider.OPENROUTER:
        return OpenRouterAIServiceImpl(settings.openrouter_api_key)
    elif ai_provider == AIProvider.OLLAMA:
        return OllamaAIServiceImpl(settings.ollama_url, settings.ollama_model)
    raise ValueError(f"Unsupported AI provider: {AIProvider}. Supported providers: {AIProvider.OPENROUTER}, {AIProvider.OLLAMA}")

@lru_cache()
def get_file_service(ai_provider: AIProvider = AIProvider.OLLAMA):
    ai_service = get_ai_service(ai_provider)
    return FileServiceImpl(ai_service)

@lru_cache()
def get_chat_service(ai_provider: AIProvider = AIProvider.OLLAMA):
    ai_service = get_ai_service(ai_provider)
    return ChatServiceImpl(ai_service)

@lru_cache()
def get_ollama_ai_service():
    """Get Ollama AI service specifically"""
    return get_ai_service(AIProvider.OLLAMA)

@lru_cache()
def get_openrouter_ai_service():
    """Get OpenRouter AI service specifically"""
    return get_ai_service(AIProvider.OPENROUTER)

@lru_cache()
def get_ollama_chat_service():
    """Get chat service with Ollama AI"""
    ai_service = get_ollama_ai_service()
    return ChatServiceImpl(ai_service)

@lru_cache()
def get_openrouter_chat_service():
    """Get chat service with OpenRouter AI"""
    ai_service = get_openrouter_ai_service()
    return ChatServiceImpl(ai_service)