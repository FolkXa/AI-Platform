"""
Unit tests for file service implementation
"""
import pytest
import io
import pandas as pd
from unittest.mock import Mock, AsyncMock
from src.infrastructure.services.file_service_impl import FileServiceImpl
from src.entities.file_analysis import FileAnalysis
from tests.fixtures.sample_data import (
    create_sample_csv_data,
    create_sample_excel_data,
    create_csv_with_missing_data,
    create_csv_with_special_characters
)

@pytest.mark.unit
class TestFileServiceImpl:
    """Unit tests for FileServiceImpl"""
    
    @pytest.fixture
    def mock_ai_service(self):
        """Create a mock AI service"""
        mock_service = Mock()
        mock_service.generate_insights = AsyncMock(return_value=["Insight 1", "Insight 2"])
        mock_service.generate_sample_questions = AsyncMock(return_value=["Question 1", "Question 2"])
        return mock_service
    
    @pytest.fixture
    def file_service(self, mock_ai_service):
        """Create FileServiceImpl instance with mock AI service"""
        return FileServiceImpl(mock_ai_service)
    
    @pytest.mark.asyncio
    async def test_process_csv_file(self, file_service):
        """Test processing a CSV file"""
        csv_bytes, expected_size = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        analysis = await file_service.process_file(file_obj, "test.csv")
        
        assert isinstance(analysis, FileAnalysis)
        assert analysis.file_name == "test.csv"
        assert analysis.rows == 5
        assert analysis.columns == 4
        assert analysis.headers == ["name", "age", "salary", "department"]
        assert analysis.file_size == expected_size
        assert len(analysis.sample_data) == 3  # First 3 rows
        assert len(analysis.insights) == 2
        assert len(analysis.sample_questions) == 2
    
    @pytest.mark.asyncio
    async def test_process_excel_file(self, file_service):
        """Test processing an Excel file"""
        excel_bytes, expected_size = create_sample_excel_data()
        file_obj = io.BytesIO(excel_bytes)
        
        analysis = await file_service.process_file(file_obj, "test.xlsx")
        
        assert isinstance(analysis, FileAnalysis)
        assert analysis.file_name == "test.xlsx"
        assert analysis.rows == 4
        assert analysis.columns == 4
        assert analysis.headers == ["product", "price", "category", "stock"]
        assert analysis.file_size == expected_size
    
    def test_read_csv_success(self, file_service):
        """Test successful CSV reading"""
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        df = file_service.read_csv(file_obj)
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == 5
        assert list(df.columns) == ["name", "age", "salary", "department"]
    
    def test_read_csv_with_missing_data(self, file_service):
        """Test reading CSV with missing data"""
        csv_bytes, _ = create_csv_with_missing_data()
        file_obj = io.BytesIO(csv_bytes)
        
        df = file_service.read_csv(file_obj)
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == 5
        assert df.isnull().sum().sum() > 0  # Should have missing values
    
    def test_read_csv_with_special_characters(self, file_service):
        """Test reading CSV with special characters"""
        csv_bytes, _ = create_csv_with_special_characters()
        file_obj = io.BytesIO(csv_bytes)
        
        df = file_service.read_csv(file_obj)
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == 5
        assert "José" in df["name"].values
        assert "François" in df["name"].values
    
    def test_read_excel_success(self, file_service):
        """Test successful Excel reading"""
        excel_bytes, _ = create_sample_excel_data()
        file_obj = io.BytesIO(excel_bytes)
        
        df = file_service.read_excel(file_obj)
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == 4
        assert list(df.columns) == ["product", "price", "category", "stock"]
    
    def test_invalid_csv_format(self, file_service):
        """Test handling invalid CSV format"""
        # Create invalid CSV content that can't be parsed
        invalid_csv = b"invalid,csv,format\nno,proper,structure"
        file_obj = io.BytesIO(invalid_csv)
        
        # This should still work as it's valid CSV format
        df = file_service.read_csv(file_obj)
        assert isinstance(df, pd.DataFrame)
        assert len(df) > 0
    
    def test_file_size_calculation(self, file_service):
        """Test file size calculation"""
        csv_bytes, expected_size = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Test that file size is calculated correctly
        file_obj.seek(0, io.SEEK_END)
        actual_size = file_obj.tell()
        file_obj.seek(0)
        
        assert actual_size == expected_size
    
    @pytest.mark.asyncio
    async def test_ai_service_integration(self, file_service, mock_ai_service):
        """Test integration with AI service"""
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        analysis = await file_service.process_file(file_obj, "test.csv")
        
        # Verify AI service was called
        mock_ai_service.generate_insights.assert_called_once()
        mock_ai_service.generate_sample_questions.assert_called_once()
        
        # Verify insights and questions were returned
        assert analysis.insights == ["Insight 1", "Insight 2"]
        assert analysis.sample_questions == ["Question 1", "Question 2"]
    
    @pytest.mark.asyncio
    async def test_ai_service_error_handling(self, file_service, mock_ai_service):
        """Test handling AI service errors"""
        # Make AI service raise an exception
        mock_ai_service.generate_insights.side_effect = Exception("AI service error")
        
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        analysis = await file_service.process_file(file_obj, "test.csv")
        
        # Should still return analysis with empty insights
        assert analysis.insights == []
        assert len(analysis.sample_questions) == 2  # Should still work
    
    def test_sample_data_extraction(self, file_service):
        """Test sample data extraction (first 3 rows)"""
        csv_bytes, _ = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        df = file_service.read_csv(file_obj)
        sample_data = []
        for _, row in df.head(3).iterrows():
            sample_data.append([str(value) for value in row.values])
        
        assert len(sample_data) == 3
        assert len(sample_data[0]) == 4  # 4 columns
        assert sample_data[0][0] == "Alice"  # First row, first column 