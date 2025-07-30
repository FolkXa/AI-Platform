import uuid
from typing import List, Optional, Dict
import pandas as pd
from datetime import datetime
from ...services.chat_service import ChatServiceInterface
from ...services.ai_service import AIServiceInterface
from ...entities.chat_message import ChatMessage, ChatSession

class ChatServiceImpl(ChatServiceInterface):
    def __init__(self, ai_service: AIServiceInterface):
        self.ai_service = ai_service
        # In-memory storage for chat sessions (in production, use a database)
        self.sessions: Dict[str, ChatSession] = {}
    
    async def create_chat_session(self, file_name: str) -> ChatSession:
        """Create a new chat session for a file"""
        session_id = str(uuid.uuid4())
        now = datetime.now()
        
        session = ChatSession(
            session_id=session_id,
            file_name=file_name,
            messages=[],
            created_at=now,
            last_updated=now
        )
        
        self.sessions[session_id] = session
        return session
    
    async def get_chat_session(self, session_id: str) -> Optional[ChatSession]:
        """Get a chat session by ID"""
        return self.sessions.get(session_id)
    
    async def add_message(self, session_id: str, content: str, role: str) -> ChatMessage:
        """Add a message to a chat session"""
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        message = ChatMessage(
            id=str(uuid.uuid4()),
            content=content,
            role=role,
            timestamp=datetime.now(),
            file_name=session.file_name
        )
        
        session.messages.append(message)
        session.last_updated = datetime.now()
        
        return message
    
    async def get_chat_response(self, session_id: str, user_message: str, df: pd.DataFrame) -> str:
        """Get AI response for a user message about the CSV data"""
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        # Get conversation history
        conversation_history = []
        for msg in session.messages[-10:]:  # Last 10 messages for context
            conversation_history.append(f"{msg.role}: {msg.content}")
        
        # Create context about the data
        data_summary = self._get_data_summary(df)
        
        # Build the prompt
        prompt = f"""
        You are a helpful data analyst assistant. You're helping analyze a CSV file called "{session.file_name}".
        
        Data Summary:
        {data_summary}
        
        Previous conversation context:
        {'\n'.join(conversation_history)}
        
        User's current question: {user_message}
        
        Please provide a helpful, accurate response about the data. If the user is asking for analysis, calculations, or insights, use the actual data from the CSV file. Be specific and mention actual numbers, column names, and patterns you find in the data.
        
        If the user asks for something that can't be answered with the available data, politely explain what information is missing.
        
        Keep your response concise but informative.
        """
        
        try:
            # Use the AI service to generate response
            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful data analyst assistant. Provide accurate, specific answers about CSV data using actual numbers and column names from the dataset."
                },
                {"role": "user", "content": prompt}
            ]
            
            response = self.ai_service.make_api_request(messages, max_tokens=800)
            return response.strip()
            
        except Exception as e:
            return f"I apologize, but I encountered an error while analyzing the data: {str(e)}. Please try rephrasing your question or ask about a different aspect of the data."
    
    async def get_session_messages(self, session_id: str) -> List[ChatMessage]:
        """Get all messages for a session"""
        session = self.sessions.get(session_id)
        if not session:
            return []
        return session.messages
    
    def _get_data_summary(self, df: pd.DataFrame) -> str:
        """Get a concise summary of the dataframe structure"""
        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": {}
        }
        
        for col in df.columns:
            col_info = {
                "type": str(df[col].dtype),
                "non_null_count": int(df[col].count()),
                "null_count": int(df[col].isnull().sum())
            }
            
            if df[col].dtype in ['int64', 'float64']:
                if not df[col].empty and df[col].notna().any():
                    col_info.update({
                        "min": float(df[col].min()),
                        "max": float(df[col].max()),
                        "mean": float(df[col].mean()),
                        "std": float(df[col].std()) if df[col].std() == df[col].std() else 0
                    })
            elif df[col].dtype == 'object':
                col_info.update({
                    "unique_count": int(df[col].nunique()),
                    "most_common": str(df[col].mode().iloc[0]) if not df[col].mode().empty else "N/A"
                })
            
            summary["columns"][col] = col_info
        
        return str(summary) 