# CSV Chat Functionality

This service now includes chat functionality for CSV files, allowing users to have interactive conversations with AI about their uploaded data.

## Features

- **Interactive Chat**: Ask questions about your CSV data and get AI-powered responses
- **Session Management**: Each CSV upload creates a chat session that persists during the conversation
- **Context Awareness**: The AI remembers previous messages in the conversation
- **Data Analysis**: Get insights, calculations, and analysis of your CSV data through natural language

## API Endpoints

### 1. Upload File with Chat Session
**POST** `/api/v1/analysis-upload-file`

Upload a CSV file and automatically create a chat session. The response includes chat session information.

**Response includes:**
```json
{
  "fileName": "data.csv",
  "rows": 1000,
  "columns": 5,
  "headers": ["Name", "Age", "Salary", "Department", "Date"],
  "sampleData": [...],
  "insights": [...],
  "sampleQuestions": [...],
  "chatSession": {
    "sessionId": "uuid-string",
    "fileName": "data.csv",
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

### 2. Create Chat Session
**POST** `/api/v1/chat/create-session`

Create a new chat session for a CSV file.

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

### 3. Send Chat Message
**POST** `/api/v1/chat/send-message`

Send a message to the chat and get an AI response about your CSV data.

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
  "timestamp": "2024-01-01T00:00:00"
}
```

### 4. Get Session Messages
**GET** `/api/v1/chat/session/{session_id}/messages`

Get all messages in a chat session.

**Response:**
```json
[
  {
    "id": "message-uuid",
    "content": "What is the average salary?",
    "role": "user",
    "timestamp": "2024-01-01T00:00:00",
    "file_name": "data.csv"
  },
  {
    "id": "message-uuid-2",
    "content": "Based on the data, the average salary is $65,000...",
    "role": "assistant",
    "timestamp": "2024-01-01T00:00:01",
    "file_name": "data.csv"
  }
]
```

### 5. Get Session Details
**GET** `/api/v1/chat/session/{session_id}`

Get details about a chat session.

**Response:**
```json
{
  "session_id": "uuid-string",
  "file_name": "data.csv",
  "created_at": "2024-01-01T00:00:00",
  "last_updated": "2024-01-01T00:00:00"
}
```

## Example Usage

### 1. Upload CSV and Start Chat
```bash
curl -X POST "http://localhost:8000/api/v1/analysis-upload-file" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@data.csv"
```

### 2. Send a Message
```bash
curl -X POST "http://localhost:8000/api/v1/chat/send-message" \
  -H "Content-Type: multipart/form-data" \
  -F "session_id=your-session-id" \
  -F "message=What is the average age in the dataset?" \
  -F "file=@data.csv"
```

### 3. Get Chat History
```bash
curl -X GET "http://localhost:8000/api/v1/chat/session/your-session-id/messages"
```

## Supported Questions

You can ask various types of questions about your CSV data:

- **Statistical Analysis**: "What is the average salary?", "What's the distribution of ages?"
- **Data Quality**: "Are there any missing values?", "How many unique departments are there?"
- **Business Insights**: "Which department has the highest average salary?", "What trends do you see in the data?"
- **Calculations**: "What's the total salary budget?", "What percentage of employees are in IT?"
- **Patterns**: "Are there any outliers in the salary data?", "What's the correlation between age and salary?"

## Technical Details

- **Session Storage**: Chat sessions are stored in memory (for production, consider using a database)
- **File Processing**: Only CSV files are supported for chat functionality
- **AI Model**: Uses OpenRouter API with Claude 3.5 Sonnet by default
- **Context Window**: Maintains conversation history for context (last 10 messages)
- **Error Handling**: Graceful fallback if AI service is unavailable

## Configuration

Make sure to set the `OPENROUTER_API_KEY` environment variable:

```bash
export OPENROUTER_API_KEY="your-api-key-here"
```

## Testing

Run the test script to verify chat functionality:

```bash
python test_chat.py
```

Make sure to set the `OPENROUTER_API_KEY` environment variable before running the test. 