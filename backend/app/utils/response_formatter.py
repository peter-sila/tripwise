"""
Response formatting utilities
"""
from typing import Any, Optional, Dict
from sqlalchemy.inspection import inspect


def model_to_dict(instance: Any) -> Optional[Dict[str, Any]]:
    """
    Convert a SQLAlchemy model instance to a dictionary.
    """
    if instance is None:
        return None

    data = {}
    mapper = inspect(instance).mapper

    for attr in mapper.column_attrs:
        data[attr.key] = getattr(instance, attr.key)

    # Handle nested trip plan items as a special case
    if hasattr(instance, "items") and isinstance(instance.items, list):
        data["items"] = [model_to_dict(item) for item in instance.items]

    return data


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
