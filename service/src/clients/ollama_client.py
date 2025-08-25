import ollama
from typing import List, Generator
from ollama import Client

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3.1:8b"):
        """
        Initialize Ollama Client using official ollama-python library
        
        Args:
            base_url: Ollama server URL (default: http://localhost:11434)
            model: Model to use (default: llama3.1:8b)
        """
        self.base_url = base_url
        self.model = model
        self.client = Client(host=base_url)

    def chat(self, messages: List[dict], max_tokens: int = 1000, temperature: float = 0.7, stream: bool = False):
        """
        Send chat completion request to Ollama
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            stream: Whether to stream the response
        
        Returns:
            Generated response content or generator for streaming
        """
        try:
            if stream:
                return self.client.chat(
                    model=self.model,
                    messages=messages,
                    options={
                        "num_predict": max_tokens,
                        "temperature": temperature
                    },
                    stream=True
                )
            else:
                response = self.client.chat(
                    model=self.model,
                    messages=messages,
                    options={
                        "num_predict": max_tokens,
                        "temperature": temperature
                    }
                )
                # Handle different response formats
                if hasattr(response, 'message') and hasattr(response.message, 'content'):
                    return response.message.content
                elif isinstance(response, dict) and 'message' in response:
                    return response['message'].get('content', str(response))
                else:
                    return str(response)
        except Exception as e:
            raise Exception(f"Ollama API error: {str(e)}")
    
    def close(self):
        """Close the client connection"""
        pass 