import httpx
from typing import List

class OpenRouterClient:
    def __init__(self, api_key: str, base_url: str = "https://openrouter.ai/api/v1", model: str = "anthropic/claude-3.5-sonnet"):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-app.com",  # เปลี่ยนให้ตรงกับ domain ของคุณ
            "X-Title": "Data Analysis App"
        }

    def chat(self, messages: List[dict], max_tokens: int = 1000, temperature: float = 0.7):
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        response = httpx.post(
            f"{self.base_url}/chat/completions",
            json=payload,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    
    def close():
        return None