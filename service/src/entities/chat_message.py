from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class ChatMessage:
    id: str
    content: str
    role: str  # 'user' or 'assistant'
    timestamp: datetime
    file_name: Optional[str] = None

@dataclass
class ChatSession:
    session_id: str
    file_name: str
    messages: List[ChatMessage]
    created_at: datetime
    last_updated: datetime 