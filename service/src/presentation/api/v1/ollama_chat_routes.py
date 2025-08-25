from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import Any, Dict, List, Generator, Union
from pydantic import BaseModel
from ....application.use_cases.chat_use_case import ChatUseCase
from ....infrastructure.dependencies import get_ollama_chat_service, get_file_service
from ....entities.chat_message import ChatMessage, ChatSession

router = APIRouter()

class ChatMessageRequest(BaseModel):
    message: str
    session_id: str

class ChatMessageResponse(BaseModel):
    id: str
    content: str
    role: str
    timestamp: str
    file_name: str

class ChatSessionResponse(BaseModel):
    session_id: str
    file_name: str
    created_at: str
    last_updated: str

def get_ollama_chat_use_case(
    chat_service=Depends(get_ollama_chat_service),
    file_service=Depends(get_file_service)
):
    return ChatUseCase(chat_service, file_service)

@router.post("/ollama-chat/create-session", response_model=ChatSessionResponse)
async def create_ollama_chat_session(
    file: UploadFile = File(...),
    use_case: ChatUseCase = Depends(get_ollama_chat_use_case)
):
    """Create a new chat session for a CSV file using Ollama AI"""
    
    # Validate file extension
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported for chat functionality"
        )
    
    try:
        # Create chat session
        session = await use_case.create_session(file.filename)
        
        return ChatSessionResponse(
            session_id=session.session_id,
            file_name=session.file_name,
            created_at=session.created_at.isoformat(),
            last_updated=session.last_updated.isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ollama-chat/send-message", response_model=Dict[str, Any])
async def send_ollama_chat_message(
    session_id: str = Form(...),
    message: str = Form(...),
    file: UploadFile = File(...),
    use_case: ChatUseCase = Depends(get_ollama_chat_use_case)
):
    """Send a message to the chat and get Ollama AI response"""
    
    # Validate file extension
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported for chat functionality"
        )
    
    try:
        # Read file content
        content = await file.read()
        
        # Send message and get response
        response = await use_case.send_message(session_id, message, content, file.filename)
        
        return {
            "session_id": session_id,
            "user_message": message,
            "ai_response": response,
            "ai_provider": "ollama",
            "timestamp": "2024-01-01T00:00:00"  # You can get actual timestamp if needed
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ollama-chat/send-streaming-message")
async def send_ollama_streaming_chat_message(
    session_id: str = Form(...),
    message: str = Form(...),
    file: Union[UploadFile, None] = File(...),
    use_case: ChatUseCase = Depends(get_ollama_chat_use_case)
):
    """Send a message to the chat and get streaming Ollama AI response"""
    
    # Validate file extension
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported for chat functionality"
        )
    
    try:
        # Read file content
        content = await file.read()
        
        # Send message and get streaming response
        response_stream = use_case.send_streaming_message(session_id, message, content, file.filename)
        
        async def generate_stream():
            async for chunk in response_stream:
                if chunk:
                    yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ollama-chat/session/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_ollama_session_messages(
    session_id: str,
    use_case: ChatUseCase = Depends(get_ollama_chat_use_case)
):
    """Get all messages for an Ollama chat session"""
    
    try:
        messages = await use_case.get_session_messages(session_id)
        
        return [
            ChatMessageResponse(
                id=msg.id,
                content=msg.content,
                role=msg.role,
                timestamp=msg.timestamp.isoformat(),
                file_name=msg.file_name or ""
            )
            for msg in messages
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ollama-chat/session/{session_id}", response_model=ChatSessionResponse)
async def get_ollama_session(
    session_id: str,
    use_case: ChatUseCase = Depends(get_ollama_chat_use_case)
):
    """Get Ollama chat session details"""
    
    try:
        session = await use_case.get_session(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return ChatSessionResponse(
            session_id=session.session_id,
            file_name=session.file_name,
            created_at=session.created_at.isoformat(),
            last_updated=session.last_updated.isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 