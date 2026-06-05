"""
AI Tips API

Provides simple AI-generated travel tips based on user trip plans or preferences.
This is a lightweight generator (no external AI provider) that creates helpful tips
from trip plan titles and items. It can be replaced with a real LLM integration later.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/travel-tips", response_model=dict)
async def generate_ai_tips(payload: Dict[str, Any], current_user: User = Depends(get_current_user)):
    """
    Generate AI travel tips for a user's plans or given preferences.

    Request body may include:
      - plans: list of plan objects with `title` and optional `items`
      - preferences: dict of user preferences

    Returns a list of tip objects: { id, title, content, category }
    """
    try:
        plans = payload.get('plans') or []
        preferences = payload.get('preferences') or {}

        tips = []
        # Simple deterministic generator: create 3 tips per plan
        for plan in plans:
            plan_id = plan.get('id') or 'unknown'
            title = plan.get('title') or 'Your Trip'
            items = plan.get('items') or []
            locations = [str(i.get('title') or i.get('description') or '') for i in items]
            context = ', '.join([l for l in locations if l]) or title

            tips.append({
                'id': f'api-ai-{plan_id}-1',
                'title': f'Book ahead for popular spots in {title}',
                'content': f'Many attractions in {context} sell out—book tickets early and consider early morning visits to avoid crowds.',
                'category': 'planning'
            })
            tips.append({
                'id': f'api-ai-{plan_id}-2',
                'title': f'Try local food in {title}',
                'content': f'Ask locals for the best street food and small family restaurants in {context}; avoid tourist traps for authentic flavors.',
                'category': 'food'
            })
            tips.append({
                'id': f'api-ai-{plan_id}-3',
                'title': f'Pack smart for {title}',
                'content': f'Check weather for {context} before you pack, bring comfortable walking shoes, a reusable water bottle, and a light rain jacket.',
                'category': 'packing'
            })

        # If no plans provided, return a small set of generic tips influenced by preferences
        if not tips:
            pref_summary = ', '.join([f"{k}:{v}" for k, v in preferences.items()])
            tips = [
                {
                    'id': 'api-ai-g-1',
                    'title': 'General planning tip',
                    'content': f'Create a loose daily plan and allow time for spontaneous discovery. Preferences: {pref_summary}',
                    'category': 'planning'
                },
                {
                    'id': 'api-ai-g-2',
                    'title': 'Money & safety',
                    'content': 'Carry a small amount of local cash and a card; register with your embassy if visiting unfamiliar countries.',
                    'category': 'safety'
                }
            ]

        return { 'success': True, 'data': tips }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
