from pydantic import BaseModel
from datetime import datetime


class DatasetInfo(BaseModel):
    filename: str
    rows: int
    columns: int


class AuditBase(BaseModel):
    filename: str
    total_rows: int
    total_columns: int
    missing_percentage: float
    duplicate_percentage: float
    quality_score: float
    report_path: str


class AuditCreate(AuditBase):
    pass


class AuditResponse(AuditBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True