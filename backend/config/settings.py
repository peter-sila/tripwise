"""
Configuration settings for TripWise Python Backend
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database Configuration
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "3306"))
    db_user: str = os.getenv("DB_USER", "")
    db_password: str = os.getenv("DB_PASSWORD", "")
    db_name: str = os.getenv("DB_NAME", "")
    
    # JWT Configuration
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # Server Configuration
    server_host: str = "0.0.0.0"
    server_port: int = 8000
    debug: bool = True
    
    # CORS Configuration
    frontend_url: str = "http://localhost:5173"
    
    # Groq Configuration for AI Trip Planning
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Legacy OpenAI Configuration (kept for compatibility)
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4-turbo-preview"
    
    # Google OAuth Configuration
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # Email Configuration
    smtp_server: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"

    @property
    def database_url(self) -> str:
        """Construct database URL for SQLAlchemy"""
        return f"mysql+mysqlconnector://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


# Create settings instance
settings = Settings()
