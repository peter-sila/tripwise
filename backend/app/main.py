"""
Main FastAPI application factory
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.api import api_router
from app.middleware.cors import setup_cors
from app.migrations import run_migrations
from config.settings import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Run any pending migrations
run_migrations()


def create_app() -> FastAPI:
    """
    Create and configure FastAPI application
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title="TripWise API",
        description="Travel planning API powered by Python and FastAPI",
        version="1.0.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json"
    )
    
    # Setup CORS middleware
    setup_cors(app)
    
    # Include API routers
    app.include_router(api_router)
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "environment": "development" if settings.debug else "production"
        }
    
    # Root endpoint
    @app.get("/")
    async def root():
        """Root endpoint with API information"""
        return {
            "message": "Welcome to TripWise API",
            "version": "1.0.0",
            "docs": "/api/docs",
            "openapi": "/api/openapi.json"
        }
    
    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        """Global exception handler"""
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "detail": str(exc) if settings.debug else None
            }
        )
    
    return app


# Create app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.server_host,
        port=settings.server_port,
        reload=settings.debug
    )
