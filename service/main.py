from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.infrastructure.config import get_settings
from src.infrastructure.dependencies import get_file_service, get_ai_service
from src.presentation.api.v1.file_routes import router as file_router

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(file_router, prefix="/api/v1", tags=["files"])

@app.get("/")
async def root():
    return {"message": "File Analysis API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}