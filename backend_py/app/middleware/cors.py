"""
CORS middleware configuration
"""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from config.settings import settings


def setup_cors(app: FastAPI):
    """
    Configure CORS middleware for the FastAPI application
    
    Args:
        app: FastAPI application instance
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
