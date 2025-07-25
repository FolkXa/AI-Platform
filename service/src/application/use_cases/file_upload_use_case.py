from typing import BinaryIO
from ...entities.file_analysis import FileAnalysis
from ...services.file_service import FileServiceInterface
from ...services.ai_service import AIServiceInterface

class FileUploadUseCase:
    def __init__(self, file_service: FileServiceInterface, ai_service: AIServiceInterface):
        self.file_service = file_service
        self.ai_service = ai_service
    
    async def execute(self, file: BinaryIO, filename: str) -> FileAnalysis:
        try:
            # Process the file
            analysis = await self.file_service.process_file(file, filename)
            return analysis
        except Exception as e:
            raise Exception(f"Failed to process file: {str(e)}")