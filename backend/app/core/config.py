from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME = "AI Data Quality Auditor"

    DATABASE_URL = "sqlite:///./data_quality.db"

    REPORT_FOLDER = "generated_reports"

    UPLOAD_FOLDER = "uploads"

    class Config:
        env_file = ".env"


settings = Settings()