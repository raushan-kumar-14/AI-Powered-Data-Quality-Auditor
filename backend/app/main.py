from fastapi import FastAPI

app = FastAPI(
    title="AI-Powered Data Quality Auditor",
    version="1.0.0"
)

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