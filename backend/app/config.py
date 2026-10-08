import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ConceptForge AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./conceptforge.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-2.5-flash")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "False").lower() == "true"

    @property
    def active_api_key(self) -> str:
        return self.GEMINI_API_KEY or self.AI_API_KEY

    @property
    def has_ai_credentials(self) -> bool:
        return bool(self.active_api_key and len(self.active_api_key.strip()) > 5)

settings = Settings()
