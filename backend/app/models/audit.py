from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.database import Base


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    total_rows = Column(Integer)
    total_columns = Column(Integer)
    missing_percentage = Column(Float)
    duplicate_percentage = Column(Float)
    quality_score = Column(Float)
    report_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)