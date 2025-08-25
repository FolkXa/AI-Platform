from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.infrastructure.config import get_settings
from src.presentation.api.v1.file_routes import router as file_router
from src.presentation.api.v1.openrouter_chat_routes import router as chat_router
from src.presentation.api.v1.ollama_chat_routes import router as ollama_chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    settings = get_settings()
    print(f"Starting FastAPI server with environment: {settings.environment}")
    yield
    # Shutdown
    print("Shutting down FastAPI server")

app = FastAPI(
    title="File Analysis API",
    description="Upload CSV/Excel files and get AI-powered insights",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(file_router, prefix="/api/v1", tags=["files"])
app.include_router(chat_router, prefix="/api/v1", tags=["chat"])
app.include_router(ollama_chat_router, prefix="/api/v1", tags=["ollama-chat"])

@app.get("/")
async def root():
    return {"message": "File Analysis API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}