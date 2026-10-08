import logging
from typing import Dict, Any, Optional
from app.config import settings
from app.services.llm_provider import LLMProvider
from app.services.demo_service import DemoService
from app.schemas.session import (
    LearningPlanSchema, ChallengeSchema, ReasoningAnalysisSchema
)

logger = logging.getLogger(__name__)

class AIService:
    """
    Unified AI Service orchestrator. Switches seamlessly between real LLM API
    and deterministic DemoProvider fallback.
    """

    def __init__(self):
        self.llm_provider = LLMProvider()

    def _should_use_llm(self) -> bool:
        return not settings.DEMO_MODE and self.llm_provider.is_available()

    def generate_learning_plan(self, topic: str, level: str) -> tuple[LearningPlanSchema, bool]:
        """
        Returns (LearningPlanSchema, is_demo_fallback_used)
        """
        if self._should_use_llm():
            try:
                plan = self.llm_provider.generate_learning_plan(topic, level)
                return plan, False
            except Exception as e:
                logger.warning(f"LLM call failed, dropping back to DemoProvider: {e}")

        # Fallback to DemoProvider
        plan = DemoService.get_learning_plan(topic, level)
        return plan, True

    def generate_challenge(self, topic: str, concept_name: str, level: str) -> tuple[ChallengeSchema, bool]:
        if self._should_use_llm():
            try:
                challenge = self.llm_provider.generate_challenge(topic, concept_name, level)
                return challenge, False
            except Exception as e:
                logger.warning(f"LLM challenge generation failed, using DemoProvider: {e}")

        challenge = DemoService.get_challenge(topic, concept_name)
        return challenge, True

    def evaluate_reasoning(self, topic: str, challenge_task: str, user_input: str) -> tuple[ReasoningAnalysisSchema, bool]:
        if self._should_use_llm():
            try:
                analysis = self.llm_provider.evaluate_reasoning(topic, challenge_task, user_input)
                return analysis, False
            except Exception as e:
                logger.warning(f"LLM reasoning evaluation failed, using DemoProvider: {e}")

        analysis = DemoService.evaluate_reasoning(topic, challenge_task, user_input)
        return analysis, True

    def get_tutor_response(self, topic: str, context: str, user_message: str) -> Dict[str, Any]:
        if self._should_use_llm():
            try:
                return self.llm_provider.get_tutor_response(topic, context, user_message)
            except Exception as e:
                logger.warning(f"LLM tutor failed, fallback used: {e}")

        return {
            "response": f"Let's explore your question about '{user_message}'. In {topic}, how does changing this input impact the overall system state?",
            "follow_up_question": "Can you explain the main mechanism in your own words?",
            "suggested_actions": ["Review concept intuition", "Try application challenge"]
        }

ai_service = AIService()
