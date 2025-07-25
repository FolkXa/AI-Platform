from dataclasses import dataclass
from typing import List, Any, Optional
from datetime import datetime

@dataclass
class FileAnalysis:
    file_name: str
    rows: int
    columns: int
    headers: List[str]
    sample_data: List[List[str]]
    insights: List[str]
    sample_questions: List[str]
    upload_timestamp: Optional[datetime] = None
    file_size: Optional[int] = None
