#!/usr/bin/env python3
"""
Test script for chat functionality
"""
import asyncio
import io
import pandas as pd
from src.infrastructure.services.ai_service_impl import AIServiceImpl
from src.infrastructure.services.chat_service_impl import ChatServiceImpl
from src.application.use_cases.chat_use_case import ChatUseCase
from src.infrastructure.services.file_service_impl import FileServiceImpl

async def test_chat_functionality():
    """Test the chat functionality with a sample CSV"""
    
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
    
    print("Testing chat functionality...")
    
    try:
        # Initialize services (you'll need to set OPENROUTER_API_KEY environment variable)
        import os
        api_key = os.getenv('OPENROUTER_API_KEY', 'your-api-key')
        
        ai_service = AIServiceImpl(api_key)
        chat_service = ChatServiceImpl(ai_service)
        file_service = FileServiceImpl(ai_service)
        chat_use_case = ChatUseCase(chat_service, file_service)
        
        # Create a chat session
        session = await chat_use_case.create_session("test_data.csv")
        print(f"Created chat session: {session.session_id}")
        
        # Send a test message
        response = await chat_use_case.send_message(
            session.session_id, 
            "What is the average age in this dataset?", 
            csv_bytes, 
            "test_data.csv"
        )
        print(f"AI Response: {response}")
        
        # Get session messages
        messages = await chat_use_case.get_session_messages(session.session_id)
        print(f"Total messages: {len(messages)}")
        
        print("Chat functionality test completed successfully!")
        
    except Exception as e:
        print(f"Error testing chat functionality: {e}")

if __name__ == "__main__":
    asyncio.run(test_chat_functionality()) 