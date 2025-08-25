# AI Provider Parameter Guide

## Overview

The `get_ai_service()` function now accepts an `AIProvider` parameter to dynamically select between different AI service implementations. This allows for flexible switching between Ollama (local) and OpenRouter (cloud) AI providers.

## AI Provider Enum

```python
from src.enums.ai_provider import AIProvider

class AIProvider(Enum):
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
```

## Updated Dependency Functions

### Core Functions

```python
from src.infrastructure.dependencies import get_ai_service, get_file_service, get_chat_service

# Get AI service with specific provider
ai_service = get_ai_service(AIProvider.OLLAMA)  # or AIProvider.OPENROUTER

# Get file service with specific AI provider
file_service = get_file_service(AIProvider.OLLAMA)

# Get chat service with specific AI provider
chat_service = get_chat_service(AIProvider.OLLAMA)
```

### Convenience Functions

```python
from src.infrastructure.dependencies import (
    get_ollama_ai_service,
    get_openrouter_ai_service,
    get_ollama_chat_service,
    get_openrouter_chat_service
)

# Direct access to specific providers
ollama_ai = get_ollama_ai_service()
openrouter_ai = get_openrouter_ai_service()
ollama_chat = get_ollama_chat_service()
openrouter_chat = get_openrouter_chat_service()
```

## Usage Examples

### 1. Basic AI Service Usage

```python
from src.infrastructure.dependencies import get_ai_service
from src.enums.ai_provider import AIProvider

# Get Ollama service (default)
ollama_service = get_ai_service()  # or get_ai_service(AIProvider.OLLAMA)

# Get OpenRouter service
openrouter_service = get_ai_service(AIProvider.OPENROUTER)

# Use the services
messages = [{"role": "user", "content": "Hello"}]
ollama_response = ollama_service.make_api_request(messages)
openrouter_response = openrouter_service.make_api_request(messages)
```

### 2. File Processing with Different Providers

```python
from src.infrastructure.dependencies import get_file_service
from src.application.use_cases.file_upload_use_case import FileUploadUseCase

# Process with Ollama
file_service_ollama = get_file_service(AIProvider.OLLAMA)
use_case_ollama = FileUploadUseCase(file_service_ollama, get_ai_service(AIProvider.OLLAMA))
analysis_ollama = await use_case_ollama.execute(file_obj, "data.csv")

# Process with OpenRouter
file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
use_case_openrouter = FileUploadUseCase(file_service_openrouter, get_ai_service(AIProvider.OPENROUTER))
analysis_openrouter = await use_case_openrouter.execute(file_obj, "data.csv")
```

### 3. Chat with Different Providers

```python
from src.infrastructure.dependencies import get_chat_service, get_file_service
from src.application.use_cases.chat_use_case import ChatUseCase

# Chat with Ollama
chat_service_ollama = get_chat_service(AIProvider.OLLAMA)
file_service_ollama = get_file_service(AIProvider.OLLAMA)
chat_use_case_ollama = ChatUseCase(chat_service_ollama, file_service_ollama)

session_ollama = await chat_use_case_ollama.create_session("data.csv")
response_ollama = await chat_use_case_ollama.send_message(
    session_ollama.session_id, "What is the average age?", csv_bytes, "data.csv"
)

# Chat with OpenRouter
chat_service_openrouter = get_chat_service(AIProvider.OPENROUTER)
file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
chat_use_case_openrouter = ChatUseCase(chat_service_openrouter, file_service_openrouter)

session_openrouter = await chat_use_case_openrouter.create_session("data.csv")
response_openrouter = await chat_use_case_openrouter.send_message(
    session_openrouter.session_id, "What is the average age?", csv_bytes, "data.csv"
)
```

### 4. Dynamic Provider Selection

```python
def get_ai_provider_for_request(user_preference: str, has_openrouter_key: bool = True):
    """Dynamically select AI provider based on conditions"""
    if user_preference.lower() == "local" or not has_openrouter_key:
        return AIProvider.OLLAMA
    elif user_preference.lower() == "cloud":
        return AIProvider.OPENROUTER
    else:
        return AIProvider.OLLAMA  # Default fallback

# Use dynamic selection
provider = get_ai_provider_for_request("local", has_openrouter_key=False)
service = get_ai_service(provider)
```

## API Routes Usage

### File Upload Routes

The file upload routes automatically use the default AI provider (Ollama):

```python
# In file_routes.py
def get_file_upload_use_case(
    file_service=Depends(get_file_service),  # Uses default AIProvider.OLLAMA
    ai_service=Depends(get_ai_service)       # Uses default AIProvider.OLLAMA
):
    return FileUploadUseCase(file_service, ai_service)
```

### Chat Routes

Different chat routes use specific providers:

```python
# OpenRouter chat routes
def get_chat_use_case(
    chat_service=Depends(get_chat_service),  # Uses default AIProvider.OLLAMA
    file_service=Depends(get_file_service)
):
    return ChatUseCase(chat_service, file_service)

# Ollama chat routes
def get_ollama_chat_use_case(
    chat_service=Depends(get_ollama_chat_service),  # Uses AIProvider.OLLAMA
    file_service=Depends(get_file_service)
):
    return ChatUseCase(chat_service, file_service)
```

## Configuration

The AI providers are configured via environment variables:

```bash
# Ollama configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# OpenRouter configuration
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Benefits

1. **Flexibility**: Easy switching between local (Ollama) and cloud (OpenRouter) AI providers
2. **Type Safety**: Using enums prevents invalid provider names
3. **Caching**: `@lru_cache()` decorator ensures efficient service instantiation
4. **Backward Compatibility**: Default behavior remains unchanged
5. **Extensibility**: Easy to add new AI providers in the future

## Testing

Run the test script to verify functionality:

```bash
venv/bin/python3 test_ai_provider.py
```

Run comprehensive examples:

```bash
venv/bin/python3 examples/ai_provider_usage.py
```

## Migration Guide

### From Old Implementation

**Before:**
```python
# Fixed to specific provider
ai_service = get_ai_service()  # Always returned Ollama
```

**After:**
```python
# Explicit provider selection
ai_service = get_ai_service(AIProvider.OLLAMA)  # Explicit Ollama
ai_service = get_ai_service(AIProvider.OPENROUTER)  # Explicit OpenRouter
ai_service = get_ai_service()  # Still defaults to Ollama
```

### Adding New Providers

To add a new AI provider:

1. Add to the enum:
```python
class AIProvider(Enum):
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
    NEW_PROVIDER = "new_provider"  # Add new provider
```

2. Update the `get_ai_service` function:
```python
def get_ai_service(ai_provider: AIProvider = AIProvider.OLLAMA):
    settings = get_settings()
    
    if ai_provider == AIProvider.OPENROUTER:
        return OpenRouterAIServiceImpl(settings.openrouter_api_key)
    elif ai_provider == AIProvider.OLLAMA:
        return OllamaAIServiceImpl(settings.ollama_url, settings.ollama_model)
    elif ai_provider == AIProvider.NEW_PROVIDER:  # Add new case
        return NewProviderAIServiceImpl(settings.new_provider_config)
    raise ValueError(f"Unsupported AI provider: {ai_provider}")
```

3. Add convenience functions:
```python
@lru_cache()
def get_new_provider_ai_service():
    return get_ai_service(AIProvider.NEW_PROVIDER)

@lru_cache()
def get_new_provider_chat_service():
    ai_service = get_new_provider_ai_service()
    return ChatServiceImpl(ai_service)
``` 