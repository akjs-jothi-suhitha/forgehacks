from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Concept Schemas ---

class ConceptSchema(BaseModel):
    name: str = Field(..., description="Name of the concept")
    category: str = Field("related", description="Category: main, prerequisite, related, or application")
    summary: str = Field(..., description="Short explanation of the concept")
    depth_intuition: Optional[str] = Field(None, description="Simple intuition level explanation")
    depth_mechanism: Optional[str] = Field(None, description="Core mechanism explanation")
    depth_technical: Optional[str] = Field(None, description="Technical depth explanation")
    depth_example: Optional[str] = Field(None, description="Concrete practical example")
    why_it_matters: Optional[str] = Field(None, description="Why this concept is fundamentally important")
    real_world_app: Optional[str] = Field(None, description="Real world application example")
    cross_domain_app: Optional[str] = Field(None, description="Cross-domain application in another field")
    contrast_concept: Optional[str] = Field(None, description="Commonly confused alternative concept")

class ConceptRelationshipSchema(BaseModel):
    source_concept: str
    target_concept: str
    relation_type: str = Field(..., description="PREREQUISITE, CAUSES, DEPENDS_ON, RELATED_TO, CONTRASTS_WITH, APPLIED_IN")
    explanation: Optional[str] = None

class LearningPlanSchema(BaseModel):
    topic: str
    level: str
    core_concept_summary: str
    concepts: List[ConceptSchema]
    prerequisites: List[str] = Field(default_factory=list)
    misconceptions: List[str] = Field(default_factory=list)
    real_world_applications: List[str] = Field(default_factory=list)
    relationships: List[ConceptRelationshipSchema] = Field(default_factory=list)

# --- Challenge Schemas ---

class ChallengeSchema(BaseModel):
    id: Optional[str] = None
    concept_name: str
    scenario: str
    task: str
    challenge_type: str = "scenario" # scenario, free_form, debug, comparison
    difficulty: str = "intermediate"
    context: Optional[str] = None
    hints: List[str] = Field(default_factory=list)

class SubmitResponseRequest(BaseModel):
    challenge_id: str
    user_input: str
    response_time_seconds: Optional[int] = 0

# --- Reasoning Analysis Schemas ---

class UnderstandingProfileSchema(BaseModel):
    overall_score: float = 70.0
    knowledge: float = 70.0
    connections: float = 70.0
    reasoning: float = 70.0
    application: float = 70.0
    explanation: float = 70.0

class ReasoningAnalysisSchema(BaseModel):
    understanding_level: str = Field(..., description="complete, partial, superficial, misconception, missing_prerequisite")
    score: float = Field(..., description="Overall score 0-100")
    profile: UnderstandingProfileSchema = Field(default_factory=UnderstandingProfileSchema)
    concepts_understood: List[str] = Field(default_factory=list)
    missing_concepts: List[str] = Field(default_factory=list)
    misconceptions: List[str] = Field(default_factory=list)
    reasoning_quality: str = Field("developing", description="exemplary, proficient, developing, initial")
    feedback: str = Field(..., description="Constructive, encouraging AI feedback")
    next_learning_action: str = Field("targeted_explanation", description="targeted_explanation, misconception_remedy, escalation, prerequisite_review")
    adaptive_challenge: Optional[ChallengeSchema] = None

# --- Session & Progress Schemas ---

class CreateSessionRequest(BaseModel):
    topic: str
    level: str = "Intermediate"
    goal: str = "Understand fundamentals and apply knowledge"

class SessionResponse(BaseModel):
    id: str
    topic: str
    level: str
    goal: str
    status: str
    is_demo: bool
    current_stage: str
    core_concept_summary: Optional[str]
    concepts: List[ConceptSchema]
    relationships: List[ConceptRelationshipSchema]
    created_at: datetime

    model_config = {"from_attributes": True}

class KnowledgeGapSchema(BaseModel):
    id: str
    concept_name: str
    understanding_score: float
    status: str
    remediation_notes: Optional[str]
    last_updated: datetime

class SessionSummarySchema(BaseModel):
    session_id: str
    topic: str
    level: str
    overall_understanding: float
    mastered_concepts: List[str]
    discovered_connections: int
    applied_challenges_count: int
    knowledge_gaps: List[KnowledgeGapSchema]
    recommended_next_step: str

class HintRequest(BaseModel):
    session_id: str
    challenge_id: str
    hint_level: int = 1 # 1, 2, or 3

class HintResponse(BaseModel):
    hint_level: int
    hint: str
    context_note: str

class TutorMessageRequest(BaseModel):
    session_id: str
    message: str
    current_concept: Optional[str] = None

class TutorMessageResponse(BaseModel):
    response: str
    follow_up_question: Optional[str] = None
    suggested_actions: List[str] = Field(default_factory=list)
