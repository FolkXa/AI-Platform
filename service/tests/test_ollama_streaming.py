#!/usr/bin/env python3
"""
Test script for Ollama streaming functionality
"""
import asyncio
import io
import pandas as pd
from src.infrastructure.services.ollama_ai_service_impl import OllamaAIServiceImpl
from src.infrastructure.services.chat_service_impl import ChatServiceImpl
from src.application.use_cases.chat_use_case import ChatUseCase
from src.infrastructure.services.file_service_impl import FileServiceImpl

async def test_ollama_streaming():
    """Test the Ollama streaming functionality"""
    
    # Create sample CSV data
    data = {
        'Name': ['John', 'Jane', 'Bob', 'Alice'],
        'Age': [25, 30, 35, 28],
        'Salary': [50000, 60000, 70000, 55000],
        'Department': ['IT', 'HR', 'IT', 'Finance']
    }
    df = pd.DataFrame(data)
    
    # Create CSV content
    csv_content = df.to_csv(index=False)
    csv_bytes = csv_content.encode('utf-8')
    
    print("Testing Ollama streaming functionality...")
    
    try:
        # Initialize services
        import os
        ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434')
        ollama_model = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
        
        print(f"Using Ollama URL: {ollama_url}")
        print(f"Using Ollama model: {ollama_model}")
        
        ai_service = OllamaAIServiceImpl(ollama_url, ollama_model)
        chat_service = ChatServiceImpl(ai_service)
        file_service = FileServiceImpl(ai_service)
        chat_use_case = ChatUseCase(chat_service, file_service)
        
        # Create a chat session
        session = await chat_use_case.create_session("test_data.csv")
        print(f"Created Ollama chat session: {session.session_id}")
        
        # Test streaming response
        print("Testing streaming response...")
        response_stream = chat_use_case.send_streaming_message(
            session.session_id, 
            "What is the average age in this dataset?", 
            csv_bytes, 
            "test_data.csv"
        )
        
        print("Streaming response chunks:")
        async for chunk in response_stream:
            print(f"Chunk: {chunk}")
        
        # Get session messages
        messages = await chat_use_case.get_session_messages(session.session_id)
        print(f"Total messages: {len(messages)}")
        
        print("Ollama streaming functionality test completed successfully!")
        
    except Exception as e:
        print(f"Error testing Ollama streaming functionality: {e}")
        print("Make sure Ollama is running and accessible at the configured URL")

if __name__ == "__main__":
    asyncio.run(test_ollama_streaming()) 