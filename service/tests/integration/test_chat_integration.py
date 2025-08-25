"""
Integration tests for chat functionality
"""
import pytest
from src.infrastructure.dependencies import get_chat_service, get_file_service
from src.enums.ai_provider import AIProvider
from src.application.use_cases.chat_use_case import ChatUseCase
from tests.fixtures.sample_data import create_sample_csv_data

@pytest.mark.integration
class TestChatIntegration:
    """Integration tests for chat functionality"""
    
    @pytest.mark.asyncio
    async def test_chat_session_creation_with_ollama(self):
        """Test chat session creation with Ollama"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Verify session
        assert session.file_name == "test.csv"
        assert session.session_id is not None
        assert len(session.session_id) > 0
        assert session.messages == []
        assert session.created_at is not None
        assert session.last_updated is not None
    
    @pytest.mark.asyncio
    async def test_chat_session_creation_with_openrouter(self):
        """Test chat session creation with OpenRouter"""
        # Get services
        chat_service = get_chat_service(AIProvider.OPENROUTER)
        file_service = get_file_service(AIProvider.OPENROUTER)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Verify session
        assert session.file_name == "test.csv"
        assert session.session_id is not None
        assert len(session.session_id) > 0
        assert session.messages == []
        assert session.created_at is not None
        assert session.last_updated is not None
    
    @pytest.mark.asyncio
    async def test_chat_message_sending_with_ollama(self):
        """Test sending chat messages with Ollama"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Send message
        response = await use_case.send_message(
            session.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "test.csv"
        )
        
        # Verify response
        assert response is not None
        assert len(response) > 0
        
        # Get session messages
        messages = await use_case.get_session_messages(session.session_id)
        
        # Should have 2 messages: user message and AI response
        assert len(messages) == 2
        assert messages[0].role == "user"
        assert messages[0].content == "What is the average age?"
        assert messages[1].role == "assistant"
        assert len(messages[1].content) > 0
    
    @pytest.mark.asyncio
    async def test_chat_message_sending_with_openrouter(self):
        """Test sending chat messages with OpenRouter"""
        # Get services
        chat_service = get_chat_service(AIProvider.OPENROUTER)
        file_service = get_file_service(AIProvider.OPENROUTER)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Send message
        response = await use_case.send_message(
            session.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "test.csv"
        )
        
        # Verify response
        assert response is not None
        assert len(response) > 0
        
        # Get session messages
        messages = await use_case.get_session_messages(session.session_id)
        
        # Should have 2 messages: user message and AI response
        assert len(messages) == 2
        assert messages[0].role == "user"
        assert messages[0].content == "What is the average age?"
        assert messages[1].role == "assistant"
        assert len(messages[1].content) > 0
    
    @pytest.mark.asyncio
    async def test_chat_conversation_history(self):
        """Test chat conversation history"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Send multiple messages
        questions = [
            "What is the average age?",
            "What is the highest salary?",
            "How many people work in Engineering?"
        ]
        
        for question in questions:
            response = await use_case.send_message(
                session.session_id, 
                question, 
                csv_bytes, 
                "test.csv"
            )
            assert response is not None
            assert len(response) > 0
        
        # Get session messages
        messages = await use_case.get_session_messages(session.session_id)
        
        # Should have 6 messages: 3 user questions + 3 AI responses
        assert len(messages) == 6
        
        # Verify conversation flow
        for i in range(0, len(messages), 2):
            assert messages[i].role == "user"
            assert messages[i].content == questions[i // 2]
            assert messages[i + 1].role == "assistant"
            assert len(messages[i + 1].content) > 0
    
    @pytest.mark.asyncio
    async def test_chat_streaming_with_ollama(self):
        """Test streaming chat responses with Ollama"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Send streaming message
        response_stream = use_case.send_streaming_message(
            session.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "test.csv"
        )
        
        # Collect streaming response
        chunks = []
        async for chunk in response_stream:
            chunks.append(chunk)
        
        # Verify streaming response
        assert len(chunks) > 0
        assert all(isinstance(chunk, str) for chunk in chunks)
        
        # Get session messages
        messages = await use_case.get_session_messages(session.session_id)
        
        # Should have 2 messages: user message and AI response
        assert len(messages) == 2
        assert messages[0].role == "user"
        assert messages[0].content == "What is the average age?"
        assert messages[1].role == "assistant"
        assert len(messages[1].content) > 0
    
    @pytest.mark.asyncio
    async def test_chat_session_retrieval(self):
        """Test retrieving chat sessions"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        created_session = await use_case.create_session("test.csv")
        
        # Retrieve session
        retrieved_session = await use_case.get_session(created_session.session_id)
        
        # Verify session retrieval
        assert retrieved_session is not None
        assert retrieved_session.session_id == created_session.session_id
        assert retrieved_session.file_name == created_session.file_name
        assert retrieved_session.created_at == created_session.created_at
    
    @pytest.mark.asyncio
    async def test_chat_session_nonexistent(self):
        """Test retrieving nonexistent chat session"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Try to retrieve nonexistent session
        session = await use_case.get_session("nonexistent-id")
        
        # Should return None
        assert session is None
    
    @pytest.mark.asyncio
    async def test_chat_with_different_file_types(self):
        """Test chat with different file types"""
        # Get services
        chat_service = get_chat_service(AIProvider.OLLAMA)
        file_service = get_file_service(AIProvider.OLLAMA)
        use_case = ChatUseCase(chat_service, file_service)
        
        # Create session
        session = await use_case.create_session("test.csv")
        
        # Try with non-CSV file
        non_csv_bytes = b"some content"
        
        with pytest.raises(ValueError, match="Only CSV files are supported for chat"):
            await use_case.send_message(
                session.session_id, 
                "Hello", 
                non_csv_bytes, 
                "test.txt"
            )
    
    @pytest.mark.asyncio
    async def test_chat_ai_provider_comparison(self):
        """Test chat functionality with different AI providers"""
        # Test with Ollama
        chat_service_ollama = get_chat_service(AIProvider.OLLAMA)
        file_service_ollama = get_file_service(AIProvider.OLLAMA)
        use_case_ollama = ChatUseCase(chat_service_ollama, file_service_ollama)
        
        # Test with OpenRouter
        chat_service_openrouter = get_chat_service(AIProvider.OPENROUTER)
        file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
        use_case_openrouter = ChatUseCase(chat_service_openrouter, file_service_openrouter)
        
        # Create sessions
        session_ollama = await use_case_ollama.create_session("test.csv")
        session_openrouter = await use_case_openrouter.create_session("test.csv")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Send messages
        response_ollama = await use_case_ollama.send_message(
            session_ollama.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "test.csv"
        )
        
        response_openrouter = await use_case_openrouter.send_message(
            session_openrouter.session_id, 
            "What is the average age?", 
            csv_bytes, 
            "test.csv"
        )
        
        # Both should return responses
        assert response_ollama is not None
        assert response_openrouter is not None
        assert len(response_ollama) > 0
        assert len(response_openrouter) > 0
        
        # Get messages from both sessions
        messages_ollama = await use_case_ollama.get_session_messages(session_ollama.session_id)
        messages_openrouter = await use_case_openrouter.get_session_messages(session_openrouter.session_id)
        
        # Both should have 2 messages
        assert len(messages_ollama) == 2
        assert len(messages_openrouter) == 2
        
        # Both should have user and assistant messages
        assert messages_ollama[0].role == "user"
        assert messages_ollama[1].role == "assistant"
        assert messages_openrouter[0].role == "user"
        assert messages_openrouter[1].role == "assistant" 