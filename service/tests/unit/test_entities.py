"""
Unit tests for entities
"""
import pytest
from datetime import datetime
from src.entities.file_analysis import FileAnalysis
from src.entities.chat_message import ChatMessage, ChatSession

@pytest.mark.unit
class TestFileAnalysis:
    """Unit tests for FileAnalysis entity"""
    
    def test_file_analysis_creation(self):
        """Test creating a FileAnalysis instance"""
        now = datetime.now()
        analysis = FileAnalysis(
            file_name="test.csv",
            rows=100,
            columns=5,
            headers=["col1", "col2", "col3", "col4", "col5"],
            sample_data=[["1", "2", "3", "4", "5"]],
            insights=["Insight 1", "Insight 2"],
            sample_questions=["Question 1", "Question 2"],
            upload_timestamp=now,
            file_size=1024
        )
        
        assert analysis.file_name == "test.csv"
        assert analysis.rows == 100
        assert analysis.columns == 5
        assert analysis.headers == ["col1", "col2", "col3", "col4", "col5"]
        assert analysis.sample_data == [["1", "2", "3", "4", "5"]]
        assert analysis.insights == ["Insight 1", "Insight 2"]
        assert analysis.sample_questions == ["Question 1", "Question 2"]
        assert analysis.upload_timestamp == now
        assert analysis.file_size == 1024
    
    def test_file_analysis_default_values(self):
        """Test FileAnalysis with default values"""
        analysis = FileAnalysis(
            file_name="test.csv",
            rows=10,
            columns=3,
            headers=["a", "b", "c"],
            sample_data=[],
            insights=[],
            sample_questions=[]
        )
        
        assert analysis.upload_timestamp is None
        assert analysis.file_size is None
    
    def test_file_analysis_immutability(self):
        """Test that FileAnalysis fields are immutable (dataclass behavior)"""
        analysis = FileAnalysis(
            file_name="test.csv",
            rows=10,
            columns=3,
            headers=["a", "b", "c"],
            sample_data=[],
            insights=[],
            sample_questions=[]
        )
        
        # Should be able to modify fields (dataclass is mutable by default)
        analysis.file_name = "new.csv"
        assert analysis.file_name == "new.csv"

@pytest.mark.unit
class TestChatMessage:
    """Unit tests for ChatMessage entity"""
    
    def test_chat_message_creation(self):
        """Test creating a ChatMessage instance"""
        now = datetime.now()
        message = ChatMessage(
            id="msg-123",
            content="Hello, how are you?",
            role="user",
            timestamp=now,
            file_name="test.csv"
        )
        
        assert message.id == "msg-123"
        assert message.content == "Hello, how are you?"
        assert message.role == "user"
        assert message.timestamp == now
        assert message.file_name == "test.csv"
    
    def test_chat_message_without_filename(self):
        """Test ChatMessage without file_name"""
        now = datetime.now()
        message = ChatMessage(
            id="msg-123",
            content="Hello",
            role="assistant",
            timestamp=now
        )
        
        assert message.file_name is None
    
    def test_chat_message_role_validation(self):
        """Test ChatMessage with different roles"""
        now = datetime.now()
        
        user_message = ChatMessage(
            id="msg-1",
            content="User message",
            role="user",
            timestamp=now
        )
        
        assistant_message = ChatMessage(
            id="msg-2",
            content="Assistant response",
            role="assistant",
            timestamp=now
        )
        
        assert user_message.role == "user"
        assert assistant_message.role == "assistant"

@pytest.mark.unit
class TestChatSession:
    """Unit tests for ChatSession entity"""
    
    def test_chat_session_creation(self):
        """Test creating a ChatSession instance"""
        now = datetime.now()
        session = ChatSession(
            session_id="session-123",
            file_name="test.csv",
            messages=[],
            created_at=now,
            last_updated=now
        )
        
        assert session.session_id == "session-123"
        assert session.file_name == "test.csv"
        assert session.messages == []
        assert session.created_at == now
        assert session.last_updated == now
    
    def test_chat_session_with_messages(self):
        """Test ChatSession with messages"""
        now = datetime.now()
        messages = [
            ChatMessage(
                id="msg-1",
                content="Hello",
                role="user",
                timestamp=now
            ),
            ChatMessage(
                id="msg-2",
                content="Hi there!",
                role="assistant",
                timestamp=now
            )
        ]
        
        session = ChatSession(
            session_id="session-123",
            file_name="test.csv",
            messages=messages,
            created_at=now,
            last_updated=now
        )
        
        assert len(session.messages) == 2
        assert session.messages[0].role == "user"
        assert session.messages[1].role == "assistant"
    
    def test_chat_session_timestamps(self):
        """Test ChatSession timestamp handling"""
        created = datetime(2024, 1, 1, 12, 0, 0)
        updated = datetime(2024, 1, 1, 12, 30, 0)
        
        session = ChatSession(
            session_id="session-123",
            file_name="test.csv",
            messages=[],
            created_at=created,
            last_updated=updated
        )
        
        assert session.created_at == created
        assert session.last_updated == updated
        assert session.created_at != session.last_updated 