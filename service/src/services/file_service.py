from abc import ABC, abstractmethod
from typing import BinaryIO
import pandas as pd
from ..entities.file_analysis import FileAnalysis

class FileServiceInterface(ABC):
    @abstractmethod
    async def process_file(self, file: BinaryIO, filename: str) -> FileAnalysis:
        pass
    
    @abstractmethod
    def read_csv(self, file: BinaryIO) -> pd.DataFrame:
        pass
    
    @abstractmethod
    def read_excel(self, file: BinaryIO) -> pd.DataFrame:
        pass
