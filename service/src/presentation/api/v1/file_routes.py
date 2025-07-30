from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request
from typing import Any, Dict
from ....application.use_cases.file_upload_use_case import FileUploadUseCase
from ....application.use_cases.chat_use_case import ChatUseCase
from ....infrastructure.dependencies import get_file_service, get_ai_service, get_chat_service
from ....infrastructure.config import get_settings

router = APIRouter()

def get_file_upload_use_case(
    file_service=Depends(get_file_service),
    ai_service=Depends(get_ai_service)
):
    return FileUploadUseCase(file_service, ai_service)

def get_chat_use_case(
    chat_service=Depends(get_chat_service),
    file_service=Depends(get_file_service)
):
    return ChatUseCase(chat_service, file_service)

@router.post("/analysis-upload-file", response_model=Dict[str, Any])
async def upload_file(
    file: UploadFile = File(...),
    use_case: FileUploadUseCase = Depends(get_file_upload_use_case),
    chat_use_case: ChatUseCase = Depends(get_chat_use_case),
    settings = Depends(get_settings)
):
    """Upload and analyze CSV or Excel files"""
    
    # Validate file extension
    if not any(file.filename.lower().endswith(ext) for ext in settings.allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(settings.allowed_extensions)}"
        )
    
    # Validate file size
    content = await file.read()
    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.max_file_size / (1024*1024)}MB"
        )
    
    try:
        # Create a file-like object from the content
        import io
        file_obj = io.BytesIO(content)
        
        # Process the file
        analysis = await use_case.execute(file_obj, file.filename)
        
        # Create chat session if it's a CSV file
        chat_session = None
        if file.filename.lower().endswith('.csv'):
            try:
                chat_session = await chat_use_case.create_session(file.filename)
            except Exception as e:
                print(f"Error creating chat session: {e}")
        
        # Return the response in the requested format
        response = {
            "fileName": analysis.file_name,
            "rows": analysis.rows,
            "columns": analysis.columns,
            "headers": analysis.headers,
            "sampleData": analysis.sample_data,
            "insights": analysis.insights,
            "sampleQuestions": analysis.sample_questions
        }
        
        # Add chat session info if available
        if chat_session:
            response["chatSession"] = {
                "sessionId": chat_session.session_id,
                "fileName": chat_session.file_name,
                "createdAt": chat_session.created_at.isoformat()
            }
        
        return response
        
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "file-upload"}
