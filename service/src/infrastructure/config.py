from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    environment: str = "development"
    openai_api_key: str = ""
    openrouter_api_key: str = ""
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: list = [".csv", ".xlsx", ".xls"]
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

print(get_settings().openrouter_api_key)