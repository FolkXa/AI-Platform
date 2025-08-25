from typing import AsyncGenerator, List, Optional, Generator
import pandas as pd
from ...entities.chat_message import ChatMessage, ChatSession
from ...services.chat_service import ChatServiceInterface
from ...services.file_service import FileServiceInterface

class ChatUseCase:
    def __init__(self, chat_service: ChatServiceInterface, file_service: FileServiceInterface):
        self.chat_service = chat_service
        self.file_service = file_service
    
    async def create_session(self, file_name: str) -> ChatSession:
        """Create a new chat session for a file"""
        return await self.chat_service.create_chat_session(file_name)
    
    async def send_message(self, session_id: str, message: str, file_data: bytes, filename: str) -> str:
        """Send a message and get AI response"""
        try:
            # Add user message to session
            await self.chat_service.add_message(session_id, message, "user")
            
            # Read the file data
            import io
            file_obj = io.BytesIO(file_data)
            
            # Parse the CSV data
            if filename.lower().endswith('.csv'):
                df = self.file_service.read_csv(file_obj)
            else:
                raise ValueError("Only CSV files are supported for chat")
            
            # Get AI response
            response = await self.chat_service.get_chat_response(session_id, message, df)
            
            # Add AI response to session
            await self.chat_service.add_message(session_id, response, "assistant")
            
            return response
            
        except Exception as e:
            error_msg = f"Error processing message: {str(e)}"
            await self.chat_service.add_message(session_id, error_msg, "assistant")
            return error_msg
    
    async def send_streaming_message(self, session_id: str, message: str, file_data: bytes, filename: str) -> AsyncGenerator[str, None]:
        """Send a message and get streaming AI response"""
        try:
            # Add user message to session
            await self.chat_service.add_message(session_id, message, "user")
            
            # Read the file data
            import io
            file_obj = io.BytesIO(file_data)
            
            # Parse the CSV data
            if filename.lower().endswith('.csv'):
                df = self.file_service.read_csv(file_obj)
            else:
                raise ValueError("Only CSV files are supported for chat")
            
            # Get streaming AI response
            response_stream = self.chat_service.get_streaming_chat_response(session_id, message, df)
            
            # Collect the full response for storage
            full_response = ""
            async for chunk in response_stream:
                content = str(chunk)
                full_response += content
                yield content
            
            # Add AI response to session
            await self.chat_service.add_message(session_id, full_response, "assistant")
            
        except Exception as e:
            error_msg = f"Error processing message: {str(e)}"
            await self.chat_service.add_message(session_id, error_msg, "assistant")
            yield error_msg
    
    async def get_session_messages(self, session_id: str) -> List[ChatMessage]:
        """Get all messages for a session"""
        return await self.chat_service.get_session_messages(session_id)
    
    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a chat session"""
        return await self.chat_service.get_chat_session(session_id) 