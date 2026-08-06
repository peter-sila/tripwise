import unittest
from unittest.mock import patch

from app.services.ai_trip_service import AITripService


class AITripServiceTests(unittest.TestCase):
    @patch("app.services.ai_trip_service.requests.post")
    def test_call_groq_api_uses_groq_auth_headers(self, mock_post):
        mock_post.return_value.raise_for_status.return_value = None
        mock_post.return_value.json.return_value = {"choices": [{"message": {"content": "{}"}}]}

        AITripService._call_groq_api(
            messages=[{"role": "user", "content": "hello"}],
            model="llama-3.3-70b-versatile",
            api_key="test-key"
        )

        _, kwargs = mock_post.call_args
        self.assertEqual(kwargs["headers"]["Authorization"], "Bearer test-key")
        self.assertEqual(kwargs["json"]["model"], "llama-3.3-70b-versatile")


if __name__ == "__main__":
    unittest.main()
