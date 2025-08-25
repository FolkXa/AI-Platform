from abc import ABC, abstractmethod
from typing import List, Optional, Generator
import pandas as pd
from ..entities.chat_message import ChatMessage, ChatSession

class ChatServiceInterface(ABC):
    @abstractmethod
    async def create_chat_session(self, file_name: str) -> ChatSession:
        pass
    
    @abstractmethod
    async def get_chat_session(self, session_id: str) -> Optional[ChatSession]:
        pass
    
    @abstractmethod
    async def add_message(self, session_id: str, content: str, role: str) -> ChatMessage:
        pass
    
    @abstractmethod
    async def get_chat_response(self, session_id: str, user_message: str, df: pd.DataFrame) -> str:
        pass
    
    @abstractmethod
    async def get_streaming_chat_response(self, session_id: str, user_message: str, df: pd.DataFrame) -> Generator:
        pass
    
    @abstractmethod
    async def get_session_messages(self, session_id: str) -> List[ChatMessage]:
        pass 