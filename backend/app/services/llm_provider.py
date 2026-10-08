import json
import logging
from typing import Dict, Any, Optional
from google import genai
from google.genai import types
from app.config import settings
from app.schemas.session import (
    LearningPlanSchema, ConceptSchema, ConceptRelationshipSchema,
    ChallengeSchema, ReasoningAnalysisSchema, UnderstandingProfileSchema
)

logger = logging.getLogger(__name__)

class LLMProvider:
    """
    AI Service provider interacting with Google Gemini API using structured JSON schema output.
    """

    def __init__(self):
        self.api_key = settings.active_api_key
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize GenAI client: {e}")

    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    def generate_learning_plan(self, topic: str, level: str) -> LearningPlanSchema:
        prompt = f"""
You are ConceptForge AI, an expert adaptive learning engine.
Generate a comprehensive, structured conceptual learning plan for the topic: "{topic}" at level "{level}".

Return ONLY a single valid JSON object adhering strictly to this structure:
{{
  "topic": "{topic}",
  "level": "{level}",
  "core_concept_summary": "1-2 sentence core definition and intuition",
  "concepts": [
    {{
      "name": "Concept Name",
      "category": "main OR prerequisite OR related OR application",
      "summary": "Clear concise explanation",
      "depth_intuition": "Simple intuition level",
      "depth_mechanism": "Core mechanism description",
      "depth_technical": "Technical depth and formula/rule",
      "depth_example": "Concrete practical example",
      "why_it_matters": "Why this is fundamentally important",
      "real_world_app": "Real world practical application",
      "cross_domain_app": "How it connects to another field (e.g. biology, economics, network design)",
      "contrast_concept": "Commonly confused alternative concept"
    }}
  ],
  "prerequisites": ["List of 2-3 prerequisite concept names"],
  "misconceptions": ["List of 2-3 common misconceptions or incorrect assumptions"],
  "real_world_applications": ["List of 3 real-world application domains"],
  "relationships": [
    {{
      "source_concept": "Concept A",
      "target_concept": "Concept B",
      "relation_type": "PREREQUISITE | CAUSES | DEPENDS_ON | RELATED_TO | CONTRASTS_WITH | APPLIED_IN",
      "explanation": "Why they relate"
    }}
  ]
}}
Ensure there are 4 to 6 high-quality concepts.
"""
        try:
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            data = json.loads(response.text)
            return LearningPlanSchema(**data)
        except Exception as e:
            logger.error(f"LLM generate_learning_plan failed: {e}")
            raise e

    def generate_challenge(self, topic: str, concept_name: str, level: str) -> ChallengeSchema:
        prompt = f"""
You are ConceptForge AI Challenge Generator.
Create a real-world, scenario-based application challenge for topic "{topic}", concept "{concept_name}", learner level "{level}".

Requirements:
- DO NOT generate a simple multiple-choice question.
- Create a realistic engineering/academic scenario with a dilemma or failure.
- Ask the student to explain WHAT is happening, WHY, and HOW to solve or optimize it.
- Provide 3 graduated hints (Hint 1: subtle clue, Hint 2: direct guidance, Hint 3: strong guidance).

Return ONLY valid JSON:
{{
  "id": "challenge-gen-1",
  "concept_name": "{concept_name}",
  "scenario": "Detailed scenario description...",
  "task": "Clear actionable prompt asking for reasoning and solution...",
  "challenge_type": "scenario",
  "difficulty": "{level.lower()}",
  "context": "Relevant context constraints...",
  "hints": [
    "Hint 1...",
    "Hint 2...",
    "Hint 3..."
  ]
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4
                )
            )
            data = json.loads(response.text)
            return ChallengeSchema(**data)
        except Exception as e:
            logger.error(f"LLM generate_challenge failed: {e}")
            raise e

    def evaluate_reasoning(self, topic: str, challenge_task: str, user_input: str) -> ReasoningAnalysisSchema:
        prompt = f"""
You are ConceptForge AI Reasoning Evaluator.
Topic: "{topic}"
Challenge Task: "{challenge_task}"
Student Explanation: "{user_input}"

Evaluate HOW the student thinks and reasons, not just whether they got a correct answer.

Classify understanding_level into ONE of:
- "complete": Deep mechanistic understanding with correct reasoning and application.
- "partial": Understands basic intuition or facts, but missing key concepts or solutions.
- "superficial": Rote memorization, buzzword dropping, or minimal depth.
- "misconception": Explicit false assumption or conceptual confusion.
- "missing_prerequisite": Struggling because prerequisite foundation is missing.

Calculate 5 profile scores (0 to 100):
- knowledge
- connections
- reasoning
- application
- explanation

Provide constructive, encouraging feedback explaining what they understood, what is missing, and any misconceptions.
Select next_learning_action from: ["escalation", "targeted_explanation", "misconception_remedy", "prerequisite_review"].

Return ONLY valid JSON:
{{
  "understanding_level": "complete | partial | superficial | misconception | missing_prerequisite",
  "score": 85.0,
  "profile": {{
    "overall_score": 85.0,
    "knowledge": 88.0,
    "connections": 80.0,
    "reasoning": 85.0,
    "application": 86.0,
    "explanation": 84.0
  }},
  "concepts_understood": ["List of concepts student showed understanding of"],
  "missing_concepts": ["List of important missing concepts"],
  "misconceptions": ["List of identified misconceptions"],
  "reasoning_quality": "exemplary | proficient | developing | initial",
  "feedback": "Encouraging constructive feedback...",
  "next_learning_action": "targeted_explanation",
  "adaptive_challenge": null
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            data = json.loads(response.text)
            return ReasoningAnalysisSchema(**data)
        except Exception as e:
            logger.error(f"LLM evaluate_reasoning failed: {e}")
            raise e

    def get_tutor_response(self, topic: str, context: str, user_message: str) -> Dict[str, Any]:
        prompt = f"""
You are the ConceptForge AI Socratic Learning Coach.
Current Topic: "{topic}"
Session Context: {context}
Learner Message: "{user_message}"

Guidelines:
- Guide the student to discover answers through reasoning.
- Do NOT directly hand out full solutions; ask guiding questions.
- Praise constructive thinking.
- Offer 2-3 short follow-up action options.

Return ONLY valid JSON:
{{
  "response": "Socratic response...",
  "follow_up_question": "Guiding question...",
  "suggested_actions": ["Explore connection", "Try micro challenge", "Review prerequisite"]
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.5
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"LLM tutor response failed: {e}")
            return {
                "response": f"Let's think about '{user_message}' in the context of {topic}. What fundamental principle connects them?",
                "follow_up_question": "What do you predict happens if we alter the main input parameters?",
                "suggested_actions": ["Analyze core mechanism", "View practical example"]
            }
