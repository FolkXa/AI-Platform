# Ollama AI Service Integration

This service now includes an alternative AI service implementation using Ollama, allowing you to run AI models locally without external API dependencies.

## Features

- **Local AI Processing**: Run AI models locally using Ollama
- **No External API Dependencies**: Works offline without internet connection
- **Multiple Model Support**: Use any model available in Ollama
- **Same Chat Functionality**: Identical chat features as OpenRouter implementation
- **Fallback Support**: Graceful handling when Ollama is unavailable

## Prerequisites

### 1. Install Ollama

Visit [ollama.ai](https://ollama.ai) and install Ollama for your platform.

### 2. Pull a Model

After installation, pull a model (e.g., llama3.1:8b):

```bash
ollama pull llama3.1:8b
```

### 3. Start Ollama Service

Start the Ollama service:

```bash
ollama serve
```

## Configuration

Set the following environment variables:

```bash
# Ollama configuration
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="llama3.1:8b"

# Optional: You can also set these in a .env file
echo "OLLAMA_URL=http://localhost:11434" >> .env
echo "OLLAMA_MODEL=llama3.1:8b" >> .env
```

## API Endpoints

The Ollama chat endpoints are similar to the OpenRouter endpoints but with different prefixes:

### 1. Create Ollama Chat Session
**POST** `/api/v1/ollama-chat/create-session`

Create a new chat session for a CSV file using Ollama AI.

**Request:** Upload CSV file
**Response:**
```json
{
  "session_id": "uuid-string",
  "file_name": "data.csv",
  "created_at": "2024-01-01T00:00:00",
  "last_updated": "2024-01-01T00:00:00"
}
```

### 2. Send Ollama Chat Message
**POST** `/api/v1/ollama-chat/send-message`

Send a message to the chat and get an Ollama AI response about your CSV data.

**Request:** Form data with:
- `session_id`: Chat session ID
- `message`: Your question about the data
- `file`: The CSV file

**Response:**
```json
{
  "session_id": "uuid-string",
  "user_message": "What is the average salary?",
  "ai_response": "Based on the data, the average salary is $65,000...",
  "ai_provider": "ollama",
  "timestamp": "2024-01-01T00:00:00"
}
```

### 3. Send Ollama Streaming Chat Message
**POST** `/api/v1/ollama-chat/send-streaming-message`

Send a message to the chat and get a streaming Ollama AI response about your CSV data.

**Request:** Form data with:
- `session_id`: Chat session ID
- `message`: Your question about the data
- `file`: The CSV file

**Response:** Server-Sent Events (SSE) stream
```
data: The average age in this dataset is 29.5 years old.

data: This value can be found in the 'Age' column of the CSV file...

data: [DONE]
```

### 4. Get Ollama Session Messages
**GET** `/api/v1/ollama-chat/session/{session_id}/messages`

Get all messages in an Ollama chat session.

### 5. Get Ollama Session Details
**GET** `/api/v1/ollama-chat/session/{session_id}`

Get details about an Ollama chat session.

## Example Usage

### 1. Create Ollama Chat Session
```bash
curl -X POST "http://localhost:8000/api/v1/ollama-chat/create-session" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@data.csv"
```

### 2. Send a Message to Ollama
```bash
curl -X POST "http://localhost:8000/api/v1/ollama-chat/send-message" \
  -H "Content-Type: multipart/form-data" \
  -F "session_id=your-session-id" \
  -F "message=What is the average age in the dataset?" \
  -F "file=@data.csv"
```

### 3. Send a Streaming Message to Ollama
```bash
curl -X POST "http://localhost:8000/api/v1/ollama-chat/send-streaming-message" \
  -H "Content-Type: multipart/form-data" \
  -F "session_id=your-session-id" \
  -F "message=What is the average age in the dataset?" \
  -F "file=@data.csv"
```

### 4. Get Ollama Chat History
```bash
curl -X GET "http://localhost:8000/api/v1/ollama-chat/session/your-session-id/messages"
```

## Available Models

You can use any model available in Ollama. Some popular options:

- `llama3.1:8b` - Meta's Llama 2 model
- `llama3.1:8b:13b` - Larger Llama 2 model
- `codellama` - Code-focused model
- `mistral` - Mistral AI model
- `neural-chat` - Intel's neural chat model

To see all available models:
```bash
ollama list
```

To pull a new model:
```bash
ollama pull model-name
```

## Architecture

### Components

1. **OllamaClient** (`src/clients/ollama_client.py`)
   - Handles HTTP communication with Ollama API
   - Converts OpenAI format messages to Ollama format
   - Manages connection and error handling

2. **OllamaAIServiceImpl** (`src/infrastructure/services/ollama_ai_service_impl.py`)
   - Implements the AIServiceInterface for Ollama
   - Provides data analysis and insights generation
   - Includes fallback mechanisms

3. **Ollama Chat Routes** (`src/presentation/api/v1/ollama_chat_routes.py`)
   - API endpoints for Ollama-based chat functionality
   - Separate from OpenRouter endpoints for clarity

### Message Format Conversion

The Ollama client converts OpenAI format messages to Ollama's expected format:

```python
# OpenAI format
[
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Hello"}
]

# Ollama format
"<|system|>
You are a helpful assistant
<|end|>
<|user|>
Hello
<|end|>
<|assistant|>"
```

## Testing

### 1. Test Ollama Connection
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags
```

### 2. Run Ollama Chat Test
```bash
# Set environment variables
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="llama3.1:8b"

# Run the test
python test_ollama_chat.py
```

### 3. Test Server Integration
```bash
# Start the server
uvicorn main:app --reload

# Check available routes
curl http://localhost:8000/docs
```

## Performance Considerations

### Model Selection
- Smaller models (7B parameters) are faster but may be less accurate
- Larger models (13B+ parameters) are more accurate but slower
- Consider your use case and hardware capabilities

### Hardware Requirements
- **CPU**: Works on any CPU, but slower
- **GPU**: Significantly faster with CUDA support
- **RAM**: Models require 4-16GB RAM depending on size

### Optimization Tips
1. Use smaller models for faster responses
2. Adjust `max_tokens` parameter to control response length
3. Consider model quantization for reduced memory usage

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: Ollama connection error: Connection refused
   ```
   **Solution**: Make sure Ollama is running (`ollama serve`)

2. **Model Not Found**
   ```
   Error: Ollama API error: 404 - model not found
   ```
   **Solution**: Pull the model first (`ollama pull model-name`)

3. **Out of Memory**
   ```
   Error: Ollama API error: 500 - internal server error
   ```
   **Solution**: Use a smaller model or increase system RAM

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export OLLAMA_DEBUG=1
```

## Comparison: OpenRouter vs Ollama

| Feature | OpenRouter | Ollama |
|---------|------------|--------|
| **Setup** | API key required | Local installation |
| **Cost** | Pay per request | Free |
| **Privacy** | Data sent to external service | Completely local |
| **Speed** | Fast (cloud) | Depends on hardware |
| **Models** | Many available | Limited to local models |
| **Internet** | Required | Not required |
| **Hardware** | No requirements | GPU recommended |

## Migration Guide

To switch from OpenRouter to Ollama:

1. **Install Ollama** and pull a model
2. **Update environment variables**:
   ```bash
   # Remove OpenRouter
   unset OPENROUTER_API_KEY
   
   # Add Ollama
   export OLLAMA_URL="http://localhost:11434"
   export OLLAMA_MODEL="llama3.1:8b"
   ```
3. **Update API calls** to use `/ollama-chat/` endpoints
4. **Test functionality** with the provided test script

Both services can coexist, allowing you to choose the best option for your use case. 