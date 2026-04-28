"""
Input validation and sanitization utilities
"""
import re
from typing import Optional


def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize string input
    
    Args:
        value: String to sanitize
        max_length: Optional maximum length
    
    Returns:
        Sanitized string
    """
    if not isinstance(value, str):
        return ""
    
    # Strip whitespace
    value = value.strip()
    
    # Limit length if specified
    if max_length and len(value) > max_length:
        value = value[:max_length]
    
    return value


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
    
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    
    Args:
        password: Password to validate
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letters"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letters"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain numbers"
    
    return True, ""
