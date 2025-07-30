from abc import ABC, abstractmethod
from typing import List
import pandas as pd
from ..entities.file_analysis import FileAnalysis

class AIServiceInterface(ABC):
    @abstractmethod
    async def generate_insights(self, df: pd.DataFrame, file_name: str) -> List[str]:
        pass
    
    @abstractmethod
    async def generate_sample_questions(self, df: pd.DataFrame, headers: List[str]) -> List[str]:
        pass
    
    @abstractmethod
    def make_api_request(self, messages: List[dict], max_tokens: int = 1000) -> str:
        pass
