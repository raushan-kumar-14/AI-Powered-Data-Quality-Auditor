from fastapi import FastAPI

from app.database.database import Base
from app.database.database import engine
from app.models.audit import Audit
from app.api.upload import router as upload_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI-Powered Data Quality Auditor",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-powered-data-quality-auditor.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to AI-Powered Data Quality Auditor!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }