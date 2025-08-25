#!/usr/bin/env python3
"""
Test script to verify file size is properly returned
"""
import asyncio
import io
import pandas as pd
from src.infrastructure.dependencies import get_file_service
from src.enums.ai_provider import AIProvider

def create_sample_csv():
    """Create a sample CSV for testing"""
    data = {
        'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
        'age': [25, 30, 35, 28],
        'salary': [50000, 60000, 70000, 55000],
        'department': ['Engineering', 'Marketing', 'Engineering', 'HR']
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    csv_bytes = csv_content.encode('utf-8')
    
    return csv_bytes, len(csv_bytes)

async def test_file_size():
    print("Testing file size functionality...")
    
    # Create sample CSV
    csv_bytes, expected_size = create_sample_csv()
    file_obj = io.BytesIO(csv_bytes)
    
    print(f"Expected file size: {expected_size} bytes")
    
    # Test with Ollama
    print("\nTesting with Ollama AI service...")
    file_service_ollama = get_file_service(AIProvider.OLLAMA)
    
    try:
        analysis = await file_service_ollama.process_file(file_obj, "test_data.csv")
        print(f"✅ File size returned: {analysis.file_size} bytes")
        print(f"✅ File name: {analysis.file_name}")
        print(f"✅ Rows: {analysis.rows}")
        print(f"✅ Columns: {analysis.columns}")
        print(f"✅ Headers: {analysis.headers}")
        print(f"✅ Sample data rows: {len(analysis.sample_data)}")
        print(f"✅ Insights: {len(analysis.insights)}")
        print(f"✅ Sample questions: {len(analysis.sample_questions)}")
        
        # Verify file size is correct
        if analysis.file_size == expected_size:
            print("✅ File size matches expected value!")
        else:
            print(f"❌ File size mismatch! Expected: {expected_size}, Got: {analysis.file_size}")
            
    except Exception as e:
        print(f"❌ Error processing file: {e}")
    
    # Test with OpenRouter
    print("\nTesting with OpenRouter AI service...")
    file_service_openrouter = get_file_service(AIProvider.OPENROUTER)
    
    # Reset file pointer
    file_obj.seek(0)
    
    try:
        analysis = await file_service_openrouter.process_file(file_obj, "test_data.csv")
        print(f"✅ File size returned: {analysis.file_size} bytes")
        
        # Verify file size is correct
        if analysis.file_size == expected_size:
            print("✅ File size matches expected value!")
        else:
            print(f"❌ File size mismatch! Expected: {expected_size}, Got: {analysis.file_size}")
            
    except Exception as e:
        print(f"❌ Error processing file: {e}")
    
    print("\n✅ File size test completed!")

if __name__ == "__main__":
    asyncio.run(test_file_size()) 