"""
Response formatting utilities
"""
from typing import Any, Optional, Dict


def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> Dict:
    """
    Format success response
    
    Args:
        data: Response data
        message: Success message
        status_code: HTTP status code
    
    Returns:
        Formatted response dictionary
    """
    return {
        "success": True,
        "message": message,
        "data": data,
        "status_code": status_code
    }


def error_response(error: str, status_code: int = 400, details: Optional[Any] = None) -> Dict:
    """
    Format error response
    
    Args:
        error: Error message
        status_code: HTTP status code
        details: Optional additional error details
    
    Returns:
        Formatted error response dictionary
    """
    return {
        "success": False,
        "error": error,
        "details": details,
        "status_code": status_code
    }
