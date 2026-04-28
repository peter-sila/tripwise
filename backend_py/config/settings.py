"""
Configuration settings for TripWise Python Backend
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database Configuration
    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str = "root"
    db_password: str = "wise"
    db_name: str = "tripwise_db"
    
    # JWT Configuration
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # Server Configuration
    server_host: str = "0.0.0.0"
    server_port: int = 8000
    debug: bool = True
    
    # CORS Configuration
    frontend_url: str = "http://localhost:5173"
    
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
