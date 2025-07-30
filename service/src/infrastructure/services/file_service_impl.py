import pandas as pd
import io
from typing import BinaryIO, List
from datetime import datetime
from ...services.file_service import FileServiceInterface
from ...services.ai_service import AIServiceInterface
from ...entities.file_analysis import FileAnalysis

class FileServiceImpl(FileServiceInterface):
    def __init__(self, ai_service: AIServiceInterface):
        self.ai_service = ai_service
    
    async def process_file(self, file: BinaryIO, filename: str) -> FileAnalysis:
        # Read the file based on extension
        if filename.lower().endswith('.csv'):
            df = self.read_csv(file)
        elif filename.lower().endswith(('.xlsx', '.xls')):
            df = self.read_excel(file)
        else:
            raise ValueError("Unsupported file format")
        
        # Get basic file info
        rows = len(df)
        columns = len(df.columns)
        headers = df.columns.tolist()
        
        # Get sample data (first 3 rows)
        sample_data = []
        for _, row in df.head(3).iterrows():
            sample_data.append([str(value) for value in row.values])
        
        # Generate AI insights and questions
        print(1)
        try:
            insights = await self.ai_service.generate_insights(df, filename)
        except Exception as e:
            print(f"Error generating AI insights: {e}")
            insights = []
        print(insights)
        print(2)
        sample_questions = await self.ai_service.generate_sample_questions(df, headers)
        print(3)
        return FileAnalysis(
            file_name=filename,
            rows=rows,
            columns=columns,
            headers=headers,
            sample_data=sample_data,
            insights=insights,
            sample_questions=sample_questions,
            upload_timestamp=datetime.now()
        )
    
    def read_csv(self, file: BinaryIO) -> pd.DataFrame:
        try:
            # Reset file pointer
            file.seek(0)
            content = file.read()
            
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            for encoding in encodings:
                try:
                    df = pd.read_csv(io.StringIO(content.decode(encoding)))
                    return df
                except UnicodeDecodeError:
                    continue
            
            raise ValueError("Unable to decode file with supported encodings")
        except Exception as e:
            raise ValueError(f"Error reading CSV file: {str(e)}")
    
    def read_excel(self, file: BinaryIO) -> pd.DataFrame:
        try:
            file.seek(0)
            df = pd.read_excel(file)
            return df
        except Exception as e:
            raise ValueError(f"Error reading Excel file: {str(e)}")
