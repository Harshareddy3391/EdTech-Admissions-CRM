"""
Database configuration and session management for EdTech CRM FastAPI Backend.
Supports both SQLite for quick local development and PostgreSQL for production.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./edtech_crm.db")

# SQLite requires check_same_thread=False for multithreaded FastAPI execution
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=os.getenv("FASTAPI_ENV") == "development"
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI dependency to yield database sessions per request with automatic closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
