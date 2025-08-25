"""
Unit tests for use cases
"""
import pytest
import io
from unittest.mock import Mock, AsyncMock
from src.application.use_cases.file_upload_use_case import FileUploadUseCase
from src.application.use_cases.chat_use_case import ChatUseCase
from src.entities.file_analysis import FileAnalysis
from src.entities.chat_message import ChatSession
from tests.fixtures.sample_data import create_sample_csv_data, get_sample_dataframe

@pytest.mark.unit
class TestFileUploadUseCase:
    """Unit tests for FileUploadUseCase"""
    
    @pytest.fixture
    def mock_file_service(self):
        """Create a mock file service"""
        mock_service = Mock()
        mock_service.process_file = AsyncMock()
        return mock_service
    
    @pytest.fixture
    def mock_ai_service(self):
        """Create a mock AI service"""
        mock_service = Mock()
        return mock_service
    
    @pytest.fixture
    def use_case(self, mock_file_service, mock_ai_service):
        """Create FileUploadUseCase instance with mock services"""
        return FileUploadUseCase(mock_file_service, mock_ai_service)
    
    @pytest.mark.asyncio
    async def test_execute_success(self, use_case, mock_file_service):
        """Test successful file upload execution"""
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Mock the expected response
        expected_analysis = FileAnalysis(
            file_name="test.csv",
            rows=5,
            columns=4,
            headers=["name", "age", "salary", "department"],
            sample_data=[["Alice", "25", "50000", "Engineering"]],
            insights=["Insight 1"],
            sample_questions=["Question 1"],
            file_size=143
        )
        mock_file_service.process_file.return_value = expected_analysis
        
        # Execute the use case
        result = await use_case.execute(file_obj, "test.csv")
        
        # Verify the result
        assert isinstance(result, FileAnalysis)
        assert result.file_name == "test.csv"
        assert result.rows == 5
        assert result.columns == 4
        
        # Verify the service was called
        mock_file_service.process_file.assert_called_once_with(file_obj, "test.csv")
    
    @pytest.mark.asyncio
    async def test_execute_file_service_error(self, use_case, mock_file_service):
        """Test handling file service errors"""
        # Make file service raise an exception
        mock_file_service.process_file.side_effect = Exception("File processing error")
        
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case - should raise an exception
        with pytest.raises(Exception, match="Failed to process file: File processing error"):
            await use_case.execute(file_obj, "test.csv")

@pytest.mark.unit
class TestChatUseCase:
    """Unit tests for ChatUseCase"""
    
    @pytest.fixture
    def mock_chat_service(self):
        """Create a mock chat service"""
        mock_service = Mock()
        mock_service.create_chat_session = AsyncMock()
        mock_service.add_message = AsyncMock()
        mock_service.get_chat_response = AsyncMock()
        mock_service.get_streaming_chat_response = Mock()
        mock_service.get_session_messages = AsyncMock()
        mock_service.get_chat_session = AsyncMock()
        return mock_service
    
    @pytest.fixture
    def mock_file_service(self):
        """Create a mock file service"""
        mock_service = Mock()
        mock_service.read_csv = Mock()
        return mock_service
    
    @pytest.fixture
    def use_case(self, mock_chat_service, mock_file_service):
        """Create ChatUseCase instance with mock services"""
        return ChatUseCase(mock_chat_service, mock_file_service)
    
    @pytest.mark.asyncio
    async def test_create_session(self, use_case, mock_chat_service):
        """Test creating a chat session"""
        # Mock the expected response
        expected_session = ChatSession(
            session_id="session-123",
            file_name="test.csv",
            messages=[],
            created_at=None,
            last_updated=None
        )
        mock_chat_service.create_chat_session.return_value = expected_session
        
        # Execute the use case
        result = await use_case.create_session("test.csv")
        
        # Verify the result
        assert isinstance(result, ChatSession)
        assert result.session_id == "session-123"
        assert result.file_name == "test.csv"
        
        # Verify the service was called
        mock_chat_service.create_chat_session.assert_called_once_with("test.csv")
    
    @pytest.mark.asyncio
    async def test_send_message_success(self, use_case, mock_chat_service, mock_file_service):
        """Test sending a message successfully"""
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        sample_df = get_sample_dataframe()
        
        # Mock service responses
        mock_file_service.read_csv.return_value = sample_df
        mock_chat_service.add_message.return_value = Mock()
        mock_chat_service.get_chat_response.return_value = "AI response"
        
        # Execute the use case
        result = await use_case.send_message("session-123", "What is the average age?", csv_bytes, "test.csv")
        
        # Verify the result
        assert result == "AI response"
        
        # Verify services were called
        assert mock_chat_service.add_message.call_count == 2  # User message + AI response
        mock_file_service.read_csv.assert_called_once()
        mock_chat_service.get_chat_response.assert_called_once_with("session-123", "What is the average age?", sample_df)
    
    @pytest.mark.asyncio
    async def test_send_message_non_csv_file(self, use_case, mock_chat_service, mock_file_service):
        """Test sending message with non-CSV file"""
        # Prepare test data
        file_bytes = b"some content"
        
        # Mock file service to raise error
        mock_file_service.read_csv.side_effect = ValueError("Only CSV files are supported for chat")
        
        # Execute the use case - should return error message
        result = await use_case.send_message("session-123", "Hello", file_bytes, "test.txt")
        
        # Should return error message
        assert "Error processing message" in result
        assert "Only CSV files are supported for chat" in result
    
    @pytest.mark.asyncio
    async def test_send_message_error_handling(self, use_case, mock_chat_service, mock_file_service):
        """Test handling errors in send_message"""
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Make file service raise an exception
        mock_file_service.read_csv.side_effect = Exception("File reading error")
        
        # Execute the use case
        result = await use_case.send_message("session-123", "Hello", csv_bytes, "test.csv")
        
        # Should return error message
        assert "Error processing message" in result
        assert "File reading error" in result
    
    @pytest.mark.asyncio
    async def test_send_streaming_message_success(self, use_case, mock_chat_service, mock_file_service):
        """Test sending a streaming message successfully"""
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        sample_df = get_sample_dataframe()
        
        # Mock service responses
        mock_file_service.read_csv.return_value = sample_df
        mock_chat_service.add_message.return_value = Mock()
        
        # Create async generator for streaming response
        async def mock_stream():
            yield "Chunk 1"
            yield "Chunk 2"
            yield "Chunk 3"
        
        mock_chat_service.get_streaming_chat_response.return_value = mock_stream()
        
        # Execute the use case
        result_stream = use_case.send_streaming_message("session-123", "What is the average age?", csv_bytes, "test.csv")
        
        # Collect the streaming response
        chunks = []
        async for chunk in result_stream:
            chunks.append(chunk)
        
        # Verify the result
        assert len(chunks) == 3
        assert chunks == ["Chunk 1", "Chunk 2", "Chunk 3"]
        
        # Verify services were called
        assert mock_chat_service.add_message.call_count == 2  # User message + AI response
        mock_file_service.read_csv.assert_called_once()
        mock_chat_service.get_streaming_chat_response.assert_called_once_with("session-123", "What is the average age?", sample_df)
    
    @pytest.mark.asyncio
    async def test_send_streaming_message_error_handling(self, use_case, mock_chat_service, mock_file_service):
        """Test handling errors in send_streaming_message"""
        # Prepare test data
        csv_bytes, _ = create_sample_csv_data()
        
        # Make file service raise an exception
        mock_file_service.read_csv.side_effect = Exception("File reading error")
        
        # Execute the use case
        result_stream = use_case.send_streaming_message("session-123", "Hello", csv_bytes, "test.csv")
        
        # Collect the streaming response
        chunks = []
        async for chunk in result_stream:
            chunks.append(chunk)
        
        # Should return error message
        assert len(chunks) == 1
        assert "Error processing message" in chunks[0]
        assert "File reading error" in chunks[0]
    
    @pytest.mark.asyncio
    async def test_get_session_messages(self, use_case, mock_chat_service):
        """Test getting session messages"""
        # Mock the expected response
        expected_messages = [Mock(), Mock(), Mock()]
        mock_chat_service.get_session_messages.return_value = expected_messages
        
        # Execute the use case
        result = await use_case.get_session_messages("session-123")
        
        # Verify the result
        assert result == expected_messages
        
        # Verify the service was called
        mock_chat_service.get_session_messages.assert_called_once_with("session-123")
    
    @pytest.mark.asyncio
    async def test_get_session(self, use_case, mock_chat_service):
        """Test getting a session"""
        # Mock the expected response
        expected_session = ChatSession(
            session_id="session-123",
            file_name="test.csv",
            messages=[],
            created_at=None,
            last_updated=None
        )
        mock_chat_service.get_chat_session.return_value = expected_session
        
        # Execute the use case
        result = await use_case.get_session("session-123")
        
        # Verify the result
        assert result == expected_session
        
        # Verify the service was called
        mock_chat_service.get_chat_session.assert_called_once_with("session-123") 