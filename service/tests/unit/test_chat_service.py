"""
Unit tests for chat service implementation
"""
import pytest
import pandas as pd
from unittest.mock import Mock, AsyncMock
from src.infrastructure.services.chat_service_impl import ChatServiceImpl
from src.entities.chat_message import ChatMessage, ChatSession
from tests.fixtures.sample_data import get_sample_dataframe

@pytest.mark.unit
class TestChatServiceImpl:
    """Unit tests for ChatServiceImpl"""
    
    @pytest.fixture
    def mock_ai_service(self):
        """Create a mock AI service"""
        mock_service = Mock()
        mock_service.make_api_request = Mock(return_value="This is a test response")
        mock_service.make_streaming_api_request = Mock(return_value=["Chunk 1", "Chunk 2", "Chunk 3"])
        return mock_service
    
    @pytest.fixture
    def chat_service(self, mock_ai_service):
        """Create ChatServiceImpl instance with mock AI service"""
        return ChatServiceImpl(mock_ai_service)
    
    @pytest.fixture
    def sample_df(self):
        """Create sample DataFrame for testing"""
        return get_sample_dataframe()
    
    @pytest.mark.asyncio
    async def test_create_chat_session(self, chat_service):
        """Test creating a new chat session"""
        session = await chat_service.create_chat_session("test.csv")
        
        assert isinstance(session, ChatSession)
        assert session.file_name == "test.csv"
        assert session.session_id is not None
        assert len(session.session_id) > 0
        assert session.messages == []
        assert session.created_at is not None
        assert session.last_updated is not None
    
    @pytest.mark.asyncio
    async def test_get_chat_session(self, chat_service):
        """Test getting a chat session by ID"""
        # Create a session first
        created_session = await chat_service.create_chat_session("test.csv")
        
        # Get the session
        retrieved_session = await chat_service.get_chat_session(created_session.session_id)
        
        assert retrieved_session is not None
        assert retrieved_session.session_id == created_session.session_id
        assert retrieved_session.file_name == created_session.file_name
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_session(self, chat_service):
        """Test getting a session that doesn't exist"""
        session = await chat_service.get_chat_session("nonexistent-id")
        assert session is None
    
    @pytest.mark.asyncio
    async def test_add_message(self, chat_service):
        """Test adding a message to a session"""
        # Create a session first
        session = await chat_service.create_chat_session("test.csv")
        
        # Add a message
        message = await chat_service.add_message(session.session_id, "Hello", "user")
        
        assert isinstance(message, ChatMessage)
        assert message.content == "Hello"
        assert message.role == "user"
        assert message.file_name == "test.csv"
        assert message.timestamp is not None
        
        # Check that the message was added to the session
        updated_session = await chat_service.get_chat_session(session.session_id)
        assert len(updated_session.messages) == 1
        assert updated_session.messages[0].content == "Hello"
    
    @pytest.mark.asyncio
    async def test_add_message_to_nonexistent_session(self, chat_service):
        """Test adding a message to a session that doesn't exist"""
        with pytest.raises(ValueError, match="Session nonexistent-id not found"):
            await chat_service.add_message("nonexistent-id", "Hello", "user")
    
    @pytest.mark.asyncio
    async def test_get_chat_response(self, chat_service, sample_df):
        """Test getting a chat response"""
        # Create a session and add a user message
        session = await chat_service.create_chat_session("test.csv")
        await chat_service.add_message(session.session_id, "What is the average age?", "user")
        
        # Get AI response
        response = await chat_service.get_chat_response(session.session_id, "What is the average age?", sample_df)
        
        assert response is not None
        assert len(response) > 0
        assert "This is a test response" in response
    
    @pytest.mark.asyncio
    async def test_get_chat_response_with_conversation_history(self, chat_service, sample_df):
        """Test getting a chat response with conversation history"""
        # Create a session and add multiple messages
        session = await chat_service.create_chat_session("test.csv")
        await chat_service.add_message(session.session_id, "Hello", "user")
        await chat_service.add_message(session.session_id, "Hi there!", "assistant")
        await chat_service.add_message(session.session_id, "What is the average age?", "user")
        
        # Get AI response
        response = await chat_service.get_chat_response(session.session_id, "What is the average age?", sample_df)
        
        assert response is not None
        assert len(response) > 0
    
    @pytest.mark.asyncio
    async def test_get_streaming_chat_response(self, chat_service, sample_df):
        """Test getting a streaming chat response"""
        # Create a session and add a user message
        session = await chat_service.create_chat_session("test.csv")
        await chat_service.add_message(session.session_id, "What is the average age?", "user")
        
        # Get streaming response
        response_stream = chat_service.get_streaming_chat_response(session.session_id, "What is the average age?", sample_df)
        
        chunks = []
        async for chunk in response_stream:
            chunks.append(chunk)
        
        assert len(chunks) > 0
        assert all(isinstance(chunk, str) for chunk in chunks)
    
    @pytest.mark.asyncio
    async def test_get_session_messages(self, chat_service):
        """Test getting all messages for a session"""
        # Create a session and add messages
        session = await chat_service.create_chat_session("test.csv")
        await chat_service.add_message(session.session_id, "Hello", "user")
        await chat_service.add_message(session.session_id, "Hi there!", "assistant")
        await chat_service.add_message(session.session_id, "How are you?", "user")
        
        # Get all messages
        messages = await chat_service.get_session_messages(session.session_id)
        
        assert len(messages) == 3
        assert messages[0].role == "user"
        assert messages[0].content == "Hello"
        assert messages[1].role == "assistant"
        assert messages[1].content == "Hi there!"
        assert messages[2].role == "user"
        assert messages[2].content == "How are you?"
    
    @pytest.mark.asyncio
    async def test_get_session_messages_empty(self, chat_service):
        """Test getting messages for a session with no messages"""
        session = await chat_service.create_chat_session("test.csv")
        messages = await chat_service.get_session_messages(session.session_id)
        
        assert messages == []
    
    @pytest.mark.asyncio
    async def test_get_session_messages_nonexistent(self, chat_service):
        """Test getting messages for a nonexistent session"""
        messages = await chat_service.get_session_messages("nonexistent-id")
        assert messages == []
    
    def test_get_data_summary(self, chat_service, sample_df):
        """Test data summary generation"""
        summary = chat_service._get_data_summary(sample_df)
        
        assert isinstance(summary, str)
        assert "total_rows" in summary
        assert "total_columns" in summary
        assert "columns" in summary
        assert "name" in summary
        assert "age" in summary
        assert "salary" in summary
        assert "department" in summary
    
    @pytest.mark.asyncio
    async def test_ai_service_error_handling(self, chat_service, sample_df):
        """Test handling AI service errors"""
        # Make AI service raise an exception
        chat_service.ai_service.make_api_request.side_effect = Exception("AI service error")
        
        # Create a session and add a user message
        session = await chat_service.create_chat_session("test.csv")
        await chat_service.add_message(session.session_id, "What is the average age?", "user")
        
        # Get AI response - should handle error gracefully
        response = await chat_service.get_chat_response(session.session_id, "What is the average age?", sample_df)
        
        assert "error" in response.lower()
        assert "apologize" in response.lower()
    
    @pytest.mark.asyncio
    async def test_conversation_history_limit(self, chat_service, sample_df):
        """Test that conversation history is limited to last 10 messages"""
        # Create a session and add many messages
        session = await chat_service.create_chat_session("test.csv")
        
        # Add 15 messages
        for i in range(15):
            await chat_service.add_message(session.session_id, f"Message {i}", "user")
        
        # Get AI response - should only use last 10 messages
        response = await chat_service.get_chat_response(session.session_id, "What is the average age?", sample_df)
        
        assert response is not None
        assert len(response) > 0
    
    @pytest.mark.asyncio
    async def test_message_id_generation(self, chat_service):
        """Test that message IDs are unique"""
        # Create a session
        session = await chat_service.create_chat_session("test.csv")
        
        # Add multiple messages
        message1 = await chat_service.add_message(session.session_id, "Message 1", "user")
        message2 = await chat_service.add_message(session.session_id, "Message 2", "user")
        
        assert message1.id != message2.id
        assert len(message1.id) > 0
        assert len(message2.id) > 0 