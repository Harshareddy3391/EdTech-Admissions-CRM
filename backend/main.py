"""
EdTech CRM & Student Admissions Inquiry System - FastAPI Main Application.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import courses, counselors, inquiries, analytics

# Ensure all database tables are created on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EdTech CRM & Student Admissions Inquiry API",
    description="Production-grade asynchronous REST API for student lead capture, multi-stage counselor admissions pipeline, automated lead scoring, and enrollment conversion analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configuration
origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",")] if origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(courses.router)
app.include_router(counselors.router)
app.include_router(inquiries.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "EdTech CRM & Admissions API",
        "version": "1.0.0",
        "docs": "/docs",
        "schema_endpoint": "/schema.sql"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("FASTAPI_PORT", 8000))
    host = os.getenv("FASTAPI_HOST", "0.0.0.0")
    print(f"🚀 Starting EdTech CRM FastAPI Server on http://{host}:{port}")
    uvicorn.run("backend.main.py:app", host=host, port=port, reload=True)
