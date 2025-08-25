#!/usr/bin/env python3
"""
Example usage of AI provider parameter in different scenarios
"""
import asyncio
import io
import pandas as pd
from src.infrastructure.dependencies import get_ai_service, get_file_service, get_chat_service
from src.enums.ai_provider import AIProvider
from src.application.use_cases.file_upload_use_case import FileUploadUseCase
from src.application.use_cases.chat_use_case import ChatUseCase

def create_sample_csv():
    """Create a sample CSV for testing"""
    data = {
        'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
        'age': [25, 30, 35, 28],
        'salary': [50000, 60000, 70000, 55000],
        'department': ['Engineering', 'Marketing', 'Engineering', 'HR']
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_bytes = csv_buffer.getvalue().encode('utf-8')
    
    return csv_bytes

async def example_1_basic_ai_service_usage():
    """Example 1: Basic AI service usage with different providers"""
    print("=== Example 1: Basic AI Service Usage ===")
    
    # Get AI services for different providers
    ollama_service = get_ai_service(AIProvider.OLLAMA)
    openrouter_service = get_ai_service(AIProvider.OPENROUTER)
    
    print(f"Ollama service: {type(ollama_service).__name__}")
    print(f"OpenRouter service: {type(openrouter_service).__name__}")
    
    # Test API request with Ollama
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Say hello in one word."}
    ]
    
    try:
        response = ollama_service.make_api_request(messages, max_tokens=10)
        print(f"Ollama response: {response}")
    except Exception as e:
        print(f"Ollama error: {e}")

async def example_2_file_processing_with_different_providers():
    """Example 2: File processing with different AI providers"""
    print("\n=== Example 2: File Processing with Different Providers ===")
    
    # Create sample CSV
    csv_bytes = create_sample_csv()
    file_obj = io.BytesIO(csv_bytes)
    
    # Process with Ollama
    print("Processing file with Ollama AI...")
    file_service_ollama = get_file_service(AIProvider.OLLAMA)
    use_case_ollama = FileUploadUseCase(file_service_ollama, get_ai_service(AIProvider.OLLAMA))
    
    try:
        analysis_ollama = await use_case_ollama.execute(file_obj, "sample_data.csv")
        print(f"Ollama insights: {len(analysis_ollama.insights)} insights generated")
        print(f"Ollama questions: {len(analysis_ollama.sample_questions)} questions generated")
    except Exception as e:
        print(f"Ollama processing error: {e}")
    
    # Process with OpenRouter
    print("\nProcessing file with OpenRouter AI...")
    file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
    use_case_openrouter = FileUploadUseCase(file_service_openrouter, get_ai_service(AIProvider.OPENROUTER))
    
    # Reset file pointer
    file_obj.seek(0)
    
    try:
        analysis_openrouter = await use_case_openrouter.execute(file_obj, "sample_data.csv")
        print(f"OpenRouter insights: {len(analysis_openrouter.insights)} insights generated")
        print(f"OpenRouter questions: {len(analysis_openrouter.sample_questions)} questions generated")
    except Exception as e:
        print(f"OpenRouter processing error: {e}")

async def example_3_chat_with_different_providers():
    """Example 3: Chat functionality with different AI providers"""
    print("\n=== Example 3: Chat with Different Providers ===")
    
    # Create sample CSV
    csv_bytes = create_sample_csv()
    
    # Chat with Ollama
    print("Chatting with Ollama AI...")
    chat_service_ollama = get_chat_service(AIProvider.OLLAMA)
    file_service_ollama = get_file_service(AIProvider.OLLAMA)
    chat_use_case_ollama = ChatUseCase(chat_service_ollama, file_service_ollama)
    
    try:
        # Create session
        session_ollama = await chat_use_case_ollama.create_session("sample_data.csv")
        print(f"Ollama session created: {session_ollama.session_id}")
        
        # Send message
        response_ollama = await chat_use_case_ollama.send_message(
            session_ollama.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "sample_data.csv"
        )
        print(f"Ollama response: {response_ollama[:100]}...")
        
    except Exception as e:
        print(f"Ollama chat error: {e}")
    
    # Chat with OpenRouter
    print("\nChatting with OpenRouter AI...")
    chat_service_openrouter = get_chat_service(AIProvider.OPENROUTER)
    file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
    chat_use_case_openrouter = ChatUseCase(chat_service_openrouter, file_service_openrouter)
    
    try:
        # Create session
        session_openrouter = await chat_use_case_openrouter.create_session("sample_data.csv")
        print(f"OpenRouter session created: {session_openrouter.session_id}")
        
        # Send message
        response_openrouter = await chat_use_case_openrouter.send_message(
            session_openrouter.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "sample_data.csv"
        )
        print(f"OpenRouter response: {response_openrouter[:100]}...")
        
    except Exception as e:
        print(f"OpenRouter chat error: {e}")

async def example_4_dynamic_provider_selection():
    """Example 4: Dynamic provider selection based on conditions"""
    print("\n=== Example 4: Dynamic Provider Selection ===")
    
    def get_ai_provider_for_request(user_preference: str, has_openrouter_key: bool = True):
        """Dynamically select AI provider based on conditions"""
        if user_preference.lower() == "local" or not has_openrouter_key:
            return AIProvider.OLLAMA
        elif user_preference.lower() == "cloud":
            return AIProvider.OPENROUTER
        else:
            return AIProvider.OLLAMA  # Default fallback
    
    # Simulate different scenarios
    scenarios = [
        ("local", True, "User prefers local processing"),
        ("cloud", True, "User prefers cloud processing"),
        ("local", False, "No OpenRouter key available"),
        ("unknown", True, "Unknown preference")
    ]
    
    for preference, has_key, description in scenarios:
        print(f"\nScenario: {description}")
        provider = get_ai_provider_for_request(preference, has_key)
        print(f"Selected provider: {provider.value}")
        
        # Get service with selected provider
        service = get_ai_service(provider)
        print(f"Service type: {type(service).__name__}")

async def main():
    """Run all examples"""
    print("🚀 AI Provider Parameter Usage Examples")
    print("=" * 50)
    
    await example_1_basic_ai_service_usage()
    await example_2_file_processing_with_different_providers()
    await example_3_chat_with_different_providers()
    await example_4_dynamic_provider_selection()
    
    print("\n✅ All examples completed!")

if __name__ == "__main__":
    asyncio.run(main()) 