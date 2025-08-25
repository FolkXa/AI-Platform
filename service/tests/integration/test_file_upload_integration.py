"""
Integration tests for file upload functionality
"""
import pytest
import io
from src.infrastructure.dependencies import get_file_service, get_ai_service
from src.enums.ai_provider import AIProvider
from src.application.use_cases.file_upload_use_case import FileUploadUseCase
from tests.fixtures.sample_data import (
    create_sample_csv_data,
    create_sample_excel_data,
    create_csv_with_missing_data,
    create_csv_with_special_characters
)

@pytest.mark.integration
class TestFileUploadIntegration:
    """Integration tests for file upload functionality"""
    
    @pytest.mark.asyncio
    async def test_csv_upload_with_ollama(self):
        """Test CSV file upload with Ollama AI service"""
        # Get services
        file_service = get_file_service(AIProvider.OLLAMA)
        ai_service = get_ai_service(AIProvider.OLLAMA)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        csv_bytes, expected_size = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test.csv")
        
        # Verify the result
        assert analysis.file_name == "test.csv"
        assert analysis.rows == 5
        assert analysis.columns == 4
        assert analysis.headers == ["name", "age", "salary", "department"]
        assert analysis.file_size == expected_size
        assert len(analysis.sample_data) == 3  # First 3 rows
        assert len(analysis.insights) > 0
        assert len(analysis.sample_questions) > 0
    
    @pytest.mark.asyncio
    async def test_csv_upload_with_openrouter(self):
        """Test CSV file upload with OpenRouter AI service"""
        # Get services
        file_service = get_file_service(AIProvider.OPENROUTER)
        ai_service = get_ai_service(AIProvider.OPENROUTER)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        csv_bytes, expected_size = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test.csv")
        
        # Verify the result
        assert analysis.file_name == "test.csv"
        assert analysis.rows == 5
        assert analysis.columns == 4
        assert analysis.headers == ["name", "age", "salary", "department"]
        assert analysis.file_size == expected_size
        assert len(analysis.sample_data) == 3
        assert len(analysis.insights) > 0
        assert len(analysis.sample_questions) > 0
    
    @pytest.mark.asyncio
    async def test_excel_upload_with_ollama(self):
        """Test Excel file upload with Ollama AI service"""
        # Get services
        file_service = get_file_service(AIProvider.OLLAMA)
        ai_service = get_ai_service(AIProvider.OLLAMA)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        excel_bytes, expected_size = create_sample_excel_data()
        file_obj = io.BytesIO(excel_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test.xlsx")
        
        # Verify the result
        assert analysis.file_name == "test.xlsx"
        assert analysis.rows == 4
        assert analysis.columns == 4
        assert analysis.headers == ["product", "price", "category", "stock"]
        assert analysis.file_size == expected_size
        assert len(analysis.sample_data) == 3
        assert len(analysis.insights) > 0
        assert len(analysis.sample_questions) > 0
    
    @pytest.mark.asyncio
    async def test_csv_with_missing_data(self):
        """Test CSV with missing data handling"""
        # Get services
        file_service = get_file_service(AIProvider.OLLAMA)
        ai_service = get_ai_service(AIProvider.OLLAMA)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        csv_bytes, expected_size = create_csv_with_missing_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test_missing.csv")
        
        # Verify the result
        assert analysis.file_name == "test_missing.csv"
        assert analysis.rows == 5
        assert analysis.columns == 4
        assert analysis.file_size == expected_size
        assert len(analysis.insights) > 0
        assert len(analysis.sample_questions) > 0
    
    @pytest.mark.asyncio
    async def test_csv_with_special_characters(self):
        """Test CSV with special characters handling"""
        # Get services
        file_service = get_file_service(AIProvider.OLLAMA)
        ai_service = get_ai_service(AIProvider.OLLAMA)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        csv_bytes, expected_size = create_csv_with_special_characters()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test_special.csv")
        
        # Verify the result
        assert analysis.file_name == "test_special.csv"
        assert analysis.rows == 5
        assert analysis.columns == 4
        assert analysis.file_size == expected_size
        assert len(analysis.insights) > 0
        assert len(analysis.sample_questions) > 0
    
    @pytest.mark.asyncio
    async def test_file_size_accuracy(self):
        """Test that file size is accurately calculated"""
        # Get services
        file_service = get_file_service(AIProvider.OLLAMA)
        ai_service = get_ai_service(AIProvider.OLLAMA)
        use_case = FileUploadUseCase(file_service, ai_service)
        
        # Prepare test data
        csv_bytes, expected_size = create_sample_csv_data()
        file_obj = io.BytesIO(csv_bytes)
        
        # Execute the use case
        analysis = await use_case.execute(file_obj, "test.csv")
        
        # Verify file size accuracy
        assert analysis.file_size == expected_size
        assert analysis.file_size == len(csv_bytes)
    
    @pytest.mark.asyncio
    async def test_ai_provider_comparison(self):
        """Test that both AI providers work correctly"""
        # Test with Ollama
        file_service_ollama = get_file_service(AIProvider.OLLAMA)
        ai_service_ollama = get_ai_service(AIProvider.OLLAMA)
        use_case_ollama = FileUploadUseCase(file_service_ollama, ai_service_ollama)
        
        # Test with OpenRouter
        file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
        ai_service_openrouter = get_ai_service(AIProvider.OPENROUTER)
        use_case_openrouter = FileUploadUseCase(file_service_openrouter, ai_service_openrouter)
        
        # Prepare test data
        csv_bytes, expected_size = create_sample_csv_data()
        
        # Test Ollama
        file_obj_ollama = io.BytesIO(csv_bytes)
        analysis_ollama = await use_case_ollama.execute(file_obj_ollama, "test.csv")
        
        # Test OpenRouter
        file_obj_openrouter = io.BytesIO(csv_bytes)
        analysis_openrouter = await use_case_openrouter.execute(file_obj_openrouter, "test.csv")
        
        # Both should have the same basic structure
        assert analysis_ollama.file_name == analysis_openrouter.file_name
        assert analysis_ollama.rows == analysis_openrouter.rows
        assert analysis_ollama.columns == analysis_openrouter.columns
        assert analysis_ollama.headers == analysis_openrouter.headers
        assert analysis_ollama.file_size == analysis_openrouter.file_size
        assert analysis_ollama.file_size == expected_size
        
        # Both should have insights and questions (may differ due to different AI models)
        assert len(analysis_ollama.insights) > 0
        assert len(analysis_openrouter.insights) > 0
        assert len(analysis_ollama.sample_questions) > 0
        assert len(analysis_openrouter.sample_questions) > 0 