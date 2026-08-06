"""
AI Trip Generation Service
Uses Groq to generate customized trip plans based on user preferences
"""
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

import requests

from config.settings import settings

logger = logging.getLogger(__name__)


class AITripService:
    """Service for AI-powered trip planning"""
    
    @staticmethod
    def generate_trip_plan(user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a trip plan using Groq based on user preferences
        
        Args:
            user_preferences: Dictionary containing:
                - destination: Preferred destination
                - duration_days: Number of days for the trip
                - start_date: Trip start date (optional)
                - budget: Budget range (e.g., "budget", "moderate", "luxury")
                - travel_style: Travel style (e.g., "adventure", "relaxation", "cultural")
                - group_size: Number of travelers
                - interests: List of interests/activities
                - accommodation: Accommodation preference
        
        Returns:
            Dictionary containing:
                - title: Trip plan title
                - description: Trip plan description
                - start_date: Start date
                - end_date: End date
                - items: List of daily itinerary items with activities
        """
        
        if not settings.groq_api_key:
            logger.error("Groq API key not configured")
            raise ValueError("Groq API key is not configured. Please set GROQ_API_KEY in environment.")
        
        # Build the prompt for AI
        prompt = AITripService._build_prompt(user_preferences)
        
        try:
            response_data = AITripService._call_groq_api(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert travel planner. Generate detailed, realistic trip itineraries based on user preferences. Return ONLY valid JSON, no other text."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=settings.groq_model,
                api_key=settings.groq_api_key,
            )
            
            content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")
            if not isinstance(content, str) or not content.strip():
                raise ValueError("The AI service returned an empty response.")
            
            trip_data = json.loads(content)
            
            logger.info(f"Successfully generated trip plan for destination: {user_preferences.get('destination')}")
            return trip_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Groq response as JSON: {e}")
            raise ValueError("Failed to parse AI response. The response format was invalid.")
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise ValueError(f"Failed to generate trip plan: {str(e)}")

    @staticmethod
    def _call_groq_api(messages: List[Dict[str, str]], model: str, api_key: str) -> Dict[str, Any]:
        """Call the Groq chat completions API using the REST endpoint."""
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 2000,
                "response_format": {"type": "json_object"},
            },
            timeout=60,
        )
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def _build_prompt(preferences: Dict[str, Any]) -> str:
        """
        Build a detailed prompt for OpenAI based on user preferences
        
        Args:
            preferences: User preferences dictionary
        
        Returns:
            Formatted prompt string
        """
        
        destination = preferences.get('destination', 'a beautiful destination')
        duration = int(preferences.get('duration_days', 5))
        budget = preferences.get('budget', 'moderate')
        travel_style = preferences.get('travel_style', 'balanced')
        group_size = int(preferences.get('group_size', 2))
        interests = preferences.get('interests', ['sightseeing', 'local cuisine', 'cultural experiences'])
        accommodation = preferences.get('accommodation', 'hotel')
        start_date_str = preferences.get('start_date')
        
        # Calculate dates if provided
        if start_date_str:
            try:
                start_date = datetime.fromisoformat(start_date_str)
                end_date = start_date + timedelta(days=duration - 1)
            except:
                start_date = datetime.now() + timedelta(days=7)
                end_date = start_date + timedelta(days=duration - 1)
        else:
            start_date = datetime.now() + timedelta(days=7)
            end_date = start_date + timedelta(days=duration - 1)
        
        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")
        
        interests_str = ", ".join(interests) if isinstance(interests, list) else str(interests)
        
        prompt = f"""Create a detailed {duration}-day trip itinerary for {destination}.

User Preferences:
- Destination: {destination}
- Duration: {duration} days ({start_date_str} to {end_date_str})
- Budget Level: {budget}
- Travel Style: {travel_style}
- Group Size: {group_size} people
- Interests: {interests_str}
- Accommodation Type: {accommodation}

Generate a realistic, day-by-day itinerary in the following JSON format:
{{
  "title": "Trip title here",
  "description": "Brief overview of the trip",
  "start_date": "{start_date_str}",
  "end_date": "{end_date_str}",
  "items": [
    {{
      "title": "Activity name",
      "description": "Detailed description of the activity",
      "date": "{start_date_str}",
      "time": "09:00"
    }},
    {{
      "title": "Lunch at local restaurant",
      "description": "Enjoy authentic local cuisine",
      "date": "{start_date_str}",
      "time": "12:30"
    }},
    {{
      "title": "Evening activity",
      "description": "Wind down with a relaxing activity",
      "date": "{start_date_str}",
      "time": "18:00"
    }}
  ]
}}

Rules:
- Include 3-5 activities per day
- Mix major attractions with local experiences
- Include food recommendations
- Consider the budget level in suggestions
- Make times realistic and practical
- Use 24-hour time format like 09:00 or 18:30
- Include estimated duration hints in descriptions
- Vary activities (sightseeing, food, relaxation, shopping, etc.)
- Return ONLY the JSON object, nothing else"""
        
        return prompt
    
    @staticmethod
    def validate_preferences(preferences: Dict[str, Any]) -> tuple[bool, str]:
        """
        Validate user preferences
        
        Args:
            preferences: User preferences dictionary
        
        Returns:
            Tuple of (is_valid: bool, message: str)
        """
        
        if not preferences.get('destination'):
            return False, "Destination is required"
        
        if not preferences.get('duration_days'):
            return False, "Trip duration is required"
        
        try:
            duration = int(preferences.get('duration_days', 0))
            if duration < 1 or duration > 365:
                return False, "Trip duration must be between 1 and 365 days"
        except (ValueError, TypeError):
            return False, "Trip duration must be a valid number"
        
        if preferences.get('group_size'):
            try:
                group_size = int(preferences.get('group_size', 1))
                if group_size < 1 or group_size > 100:
                    return False, "Group size must be between 1 and 100"
            except (ValueError, TypeError):
                return False, "Group size must be a valid number"
        
        return True, "Preferences are valid"
