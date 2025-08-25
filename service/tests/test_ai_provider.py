#!/usr/bin/env python3
"""
Test script to demonstrate AI provider parameter usage
"""
import asyncio
from src.infrastructure.dependencies import get_ai_service, get_file_service, get_chat_service
from src.enums.ai_provider import AIProvider

async def test_ai_provider_parameter():
    print("Testing AI provider parameter functionality...")
    
    # Test getting different AI services
    print("\n1. Getting Ollama AI service (default):")
    ollama_service = get_ai_service()
    print(f"   Service type: {type(ollama_service).__name__}")
    
    print("\n2. Getting Ollama AI service explicitly:")
    ollama_service_explicit = get_ai_service(AIProvider.OLLAMA)
    print(f"   Service type: {type(ollama_service_explicit).__name__}")
    
    print("\n3. Getting OpenRouter AI service:")
    openrouter_service = get_ai_service(AIProvider.OPENROUTER)
    print(f"   Service type: {type(openrouter_service).__name__}")
    
    # Test getting services with AI provider parameter
    print("\n4. Getting file service with Ollama:")
    file_service_ollama = get_file_service(AIProvider.OLLAMA)
    print(f"   File service AI type: {type(file_service_ollama.ai_service).__name__}")
    
    print("\n5. Getting file service with OpenRouter:")
    file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
    print(f"   File service AI type: {type(file_service_openrouter.ai_service).__name__}")
    
    print("\n6. Getting chat service with Ollama:")
    chat_service_ollama = get_chat_service(AIProvider.OLLAMA)
    print(f"   Chat service AI type: {type(chat_service_ollama.ai_service).__name__}")
    
    print("\n7. Getting chat service with OpenRouter:")
    chat_service_openrouter = get_chat_service(AIProvider.OPENROUTER)
    print(f"   Chat service AI type: {type(chat_service_openrouter.ai_service).__name__}")
    
    print("\n✅ AI provider parameter functionality test completed successfully!")

if __name__ == "__main__":
    asyncio.run(test_ai_provider_parameter()) 