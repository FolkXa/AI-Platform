#!/usr/bin/env python3
"""
Test script to demonstrate the complete API response including file size
"""
import asyncio
import io
import pandas as pd
from src.application.use_cases.file_upload_use_case import FileUploadUseCase
from src.infrastructure.dependencies import get_file_service, get_ai_service
from src.enums.ai_provider import AIProvider

def create_sample_csv():
    """Create a sample CSV for testing"""
    data = {
        'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        'age': [25, 30, 35, 28, 32],
        'salary': [50000, 60000, 70000, 55000, 65000],
        'department': ['Engineering', 'Marketing', 'Engineering', 'HR', 'Sales']
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    csv_bytes = csv_content.encode('utf-8')
    
    return csv_bytes, len(csv_bytes)

async def test_api_response_format():
    print("Testing API response format with file size...")
    
    # Create sample CSV
    csv_bytes, expected_size = create_sample_csv()
    file_obj = io.BytesIO(csv_bytes)
    
    print(f"Expected file size: {expected_size} bytes")
    
    # Test with Ollama
    print("\n=== Testing with Ollama AI service ===")
    file_service_ollama = get_file_service(AIProvider.OLLAMA)
    ai_service_ollama = get_ai_service(AIProvider.OLLAMA)
    use_case_ollama = FileUploadUseCase(file_service_ollama, ai_service_ollama)
    
    try:
        analysis = await use_case_ollama.execute(file_obj, "test_data.csv")
        
        # Simulate API response format
        api_response = {
            "fileName": analysis.file_name,
            "fileSize": analysis.file_size,
            "rows": analysis.rows,
            "columns": analysis.columns,
            "headers": analysis.headers,
            "sampleData": analysis.sample_data,
            "insights": analysis.insights,
            "sampleQuestions": analysis.sample_questions
        }
        
        print("✅ API Response Format:")
        print(f"   fileName: {api_response['fileName']}")
        print(f"   fileSize: {api_response['fileSize']} bytes")
        print(f"   rows: {api_response['rows']}")
        print(f"   columns: {api_response['columns']}")
        print(f"   headers: {api_response['headers']}")
        print(f"   sampleData: {len(api_response['sampleData'])} rows")
        print(f"   insights: {len(api_response['insights'])} insights")
        print(f"   sampleQuestions: {len(api_response['sampleQuestions'])} questions")
        
        # Verify file size
        if api_response['fileSize'] == expected_size:
            print("✅ File size correctly included in API response!")
        else:
            print(f"❌ File size mismatch! Expected: {expected_size}, Got: {api_response['fileSize']}")
        
        # Show sample data
        print("\n📊 Sample Data:")
        for i, row in enumerate(api_response['sampleData']):
            print(f"   Row {i+1}: {row}")
        
        # Show insights
        print("\n💡 Insights:")
        for i, insight in enumerate(api_response['insights']):
            print(f"   {i+1}. {insight}")
        
        # Show sample questions
        print("\n❓ Sample Questions:")
        for i, question in enumerate(api_response['sampleQuestions']):
            print(f"   {i+1}. {question}")
            
    except Exception as e:
        print(f"❌ Error processing file: {e}")
    
    print("\n✅ API response format test completed!")

if __name__ == "__main__":
    asyncio.run(test_api_response_format()) 