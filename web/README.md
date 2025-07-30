# AI Platform - CSV Chat Functionality

This platform now includes advanced CSV chat functionality that allows users to have interactive conversations with AI about their uploaded data.

## Features

### CSV Chat with Session Management
- **Interactive Chat**: Ask questions about your CSV data and get AI-powered responses
- **Session Management**: Each CSV upload creates a persistent chat session
- **Context Awareness**: The AI remembers previous messages in the conversation
- **Data Analysis**: Get insights, calculations, and analysis through natural language
- **Markdown Support**: AI responses are beautifully formatted with tables, code blocks, lists, and more

### Supported File Types
- **CSV files**: Full chat functionality with session management
- **Excel files (XLS/XLSX)**: Data analysis and preview (chat functionality coming soon)

## How to Use

### 1. Upload CSV File
1. Navigate to the "Chat with My Data" page
2. Drag and drop or select a CSV file
3. The system will automatically:
   - Analyze the data structure
   - Create a chat session (for CSV files)
   - Display data preview and insights

### 2. Start Chatting
Once a CSV file is uploaded:
- Click on sample questions to get started
- Type your own questions in natural language
- Ask about trends, calculations, patterns, and insights

### 3. Example Questions You Can Ask
- **Statistical Analysis**: "What is the average salary?", "What's the distribution of ages?"
- **Data Quality**: "Are there any missing values?", "How many unique departments are there?"
- **Business Insights**: "Which department has the highest average salary?", "What trends do you see?"
- **Calculations**: "What's the total revenue?", "What percentage of employees are in IT?"
- **Patterns**: "Are there any outliers in the salary data?", "What's the correlation between age and salary?"
- **Formatted Output**: "Create a summary table of the data", "Show me the data structure and types"

## API Endpoints

The CSV chat functionality uses the following backend endpoints:

### 1. Upload File with Chat Session
```
POST /api/v1/analysis-upload-file
```
Upload a CSV file and automatically create a chat session.

### 2. Create Chat Session
```
POST /api/v1/chat/create-session
```
Create a new chat session for a CSV file.

### 3. Send Chat Message
```
POST /api/v1/chat/send-message
```
Send a message to the chat and get an AI response about your CSV data.

### 4. Get Session Messages
```
GET /api/v1/chat/session/{session_id}/messages
```
Get all messages in a chat session.

### 5. Get Session Details
```
GET /api/v1/chat/session/{session_id}
```
Get details about a chat session.

## Technical Implementation

### Frontend Changes
- Updated `app/chat-with-data/page.tsx` with custom chat state management
- Added session management and message handling
- Implemented real-time chat interface with loading states
- Added error handling and user feedback
- **Markdown Support**: Added `react-markdown` with syntax highlighting for code blocks
- **Component Architecture**: Split into reusable components (`FileUpload`, `DataPreview`, `ChatInterface`)
- **Custom Hook**: Created `useChat` hook for state management
- **Type Safety**: Centralized types in `types/chat.ts`

### API Integration
- Updated `lib/api.ts` with new CSV chat endpoints
- Added TypeScript interfaces for chat sessions and messages
- Implemented proper error handling and response parsing

### Backend Requirements
The implementation expects a backend service running on `http://localhost:8000` with the following capabilities:
- CSV file processing and analysis
- Chat session management
- AI-powered responses using OpenRouter API with Claude 3.5 Sonnet
- Message history storage

## Session Management

Each CSV upload creates a unique chat session that:
- Persists during the conversation
- Maintains context across multiple messages
- Stores conversation history
- Allows for follow-up questions and analysis

## Error Handling

The system includes comprehensive error handling:
- File upload failures
- Chat session creation errors
- Message sending failures
- Network connectivity issues
- Graceful fallbacks for unavailable services

## Markdown Features

The chat interface now supports rich markdown formatting:

- **Tables**: Data summaries and comparisons
- **Code Blocks**: Syntax-highlighted code examples with language detection
- **Lists**: Ordered and unordered lists for structured information
- **Blockquotes**: Highlighted important information
- **Links**: Clickable URLs that open in new tabs
- **Headers**: Hierarchical content organization
- **Bold/Italic**: Emphasis and styling
- **Inline Code**: Highlighted code snippets

## Future Enhancements

- Support for Excel files in chat functionality
- Export chat conversations
- Advanced data visualizations
- Multi-file chat sessions
- Collaborative chat features
- LaTeX math formula support
- Interactive charts and graphs

## Getting Started

1. Ensure your backend service is running on `http://localhost:8000`
2. Upload a CSV file through the web interface
3. Start asking questions about your data
4. Explore insights and patterns through natural language

The CSV chat functionality provides a powerful way to interact with your data using natural language, making data analysis accessible to users without technical expertise. 