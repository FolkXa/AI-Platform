"""
Test fixtures with sample data for testing
"""
import io
import pandas as pd
from typing import Tuple

def create_sample_csv_data() -> Tuple[bytes, int]:
    """Create sample CSV data for testing"""
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

def create_sample_excel_data() -> Tuple[bytes, int]:
    """Create sample Excel data for testing"""
    data = {
        'product': ['Laptop', 'Phone', 'Tablet', 'Monitor'],
        'price': [1200, 800, 500, 300],
        'category': ['Electronics', 'Electronics', 'Electronics', 'Electronics'],
        'stock': [50, 100, 75, 25]
    }
    df = pd.DataFrame(data)
    
    # Convert to Excel bytes
    excel_buffer = io.BytesIO()
    df.to_excel(excel_buffer, index=False)
    excel_bytes = excel_buffer.getvalue()
    
    return excel_bytes, len(excel_bytes)

def create_large_csv_data(rows: int = 100) -> Tuple[bytes, int]:
    """Create large CSV data for testing"""
    import random
    
    data = {
        'id': list(range(1, rows + 1)),
        'name': [f'User{i}' for i in range(1, rows + 1)],
        'age': [random.randint(18, 65) for _ in range(rows)],
        'salary': [random.randint(30000, 100000) for _ in range(rows)],
        'department': [random.choice(['Engineering', 'Marketing', 'HR', 'Sales', 'Finance']) for _ in range(rows)]
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    csv_bytes = csv_content.encode('utf-8')
    
    return csv_bytes, len(csv_bytes)

def create_csv_with_missing_data() -> Tuple[bytes, int]:
    """Create CSV data with missing values for testing"""
    data = {
        'name': ['Alice', 'Bob', None, 'Diana', 'Eve'],
        'age': [25, None, 35, 28, 32],
        'salary': [50000, 60000, 70000, None, 65000],
        'department': ['Engineering', 'Marketing', None, 'HR', 'Sales']
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    csv_bytes = csv_content.encode('utf-8')
    
    return csv_bytes, len(csv_bytes)

def create_csv_with_special_characters() -> Tuple[bytes, int]:
    """Create CSV data with special characters for testing encoding"""
    data = {
        'name': ['José', 'François', 'Müller', '李小明', 'Иван'],
        'age': [25, 30, 35, 28, 32],
        'salary': [50000, 60000, 70000, 55000, 65000],
        'department': ['Ingénierie', 'Marketing', 'Ingénierie', 'HR', 'Sales']
    }
    df = pd.DataFrame(data)
    
    # Convert to CSV bytes
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    csv_bytes = csv_content.encode('utf-8')
    
    return csv_bytes, len(csv_bytes)

def get_sample_messages() -> list:
    """Get sample chat messages for testing"""
    return [
        {"role": "system", "content": "You are a helpful data analyst assistant."},
        {"role": "user", "content": "What is the average age in this dataset?"},
        {"role": "assistant", "content": "The average age is 30 years."},
        {"role": "user", "content": "What is the highest salary?"},
        {"role": "assistant", "content": "The highest salary is $70,000."}
    ]

def get_sample_dataframe() -> pd.DataFrame:
    """Get a sample DataFrame for testing"""
    data = {
        'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        'age': [25, 30, 35, 28, 32],
        'salary': [50000, 60000, 70000, 55000, 65000],
        'department': ['Engineering', 'Marketing', 'Engineering', 'HR', 'Sales']
    }
    return pd.DataFrame(data) 