from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.session import (
    LearningSession, Concept, ConceptRelationship, Challenge, StudentResponse, ReasoningAnalysis, KnowledgeGap
)
from app.schemas.session import (
    CreateSessionRequest, SubmitResponseRequest, ReasoningAnalysisSchema, SessionSummarySchema, ChallengeSchema
)
from app.services.learning_engine import LearningEngine
from app.services.ai_service import ai_service
from app.services.demo_service import DemoService

router = APIRouter()

@router.post("/session")
def create_session(req: CreateSessionRequest, db: Session = Depends(get_db)):
    try:
        session = LearningEngine.create_session(db, req)
        return {"session_id": session.id, "status": "created", "is_demo": session.is_demo}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create learning session: {str(e)}")

@router.get("/session/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(LearningSession).filter(LearningSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    concepts = db.query(Concept).filter(Concept.session_id == session_id).all()
    relationships = db.query(ConceptRelationship).filter(ConceptRelationship.session_id == session_id).all()
    challenges = db.query(Challenge).filter(Challenge.session_id == session_id).all()
    gaps = db.query(KnowledgeGap).filter(KnowledgeGap.session_id == session_id).all()

    # Get recent reasoning analysis if any
    recent_responses = db.query(StudentResponse).filter(StudentResponse.session_id == session_id).order_by(StudentResponse.created_at.desc()).all()
    recent_analysis = None
    if recent_responses:
        latest_resp = recent_responses[0]
        if latest_resp.analysis:
            recent_analysis = {
                "understanding_level": latest_resp.analysis.understanding_level,
                "score": latest_resp.analysis.score,
                "profile": {
                    "knowledge": latest_resp.analysis.score_knowledge,
                    "connections": latest_resp.analysis.score_connections,
                    "reasoning": latest_resp.analysis.score_reasoning,
                    "application": latest_resp.analysis.score_application,
                    "explanation": latest_resp.analysis.score_explanation
                },
                "concepts_understood": latest_resp.analysis.concepts_understood,
                "missing_concepts": latest_resp.analysis.missing_concepts,
                "misconceptions": latest_resp.analysis.misconceptions,
                "reasoning_quality": latest_resp.analysis.reasoning_quality,
                "feedback": latest_resp.analysis.feedback,
                "next_learning_action": latest_resp.analysis.next_learning_action
            }

    return {
        "id": session.id,
        "topic": session.topic,
        "level": session.level,
        "goal": session.goal,
        "status": session.status,
        "is_demo": session.is_demo,
        "current_stage": session.current_stage,
        "core_concept_summary": session.core_concept_summary,
        "concepts": [
            {
                "id": c.id,
                "name": c.name,
                "category": c.category,
                "summary": c.summary,
                "depth_intuition": c.depth_intuition,
                "depth_mechanism": c.depth_mechanism,
                "depth_technical": c.depth_technical,
                "depth_example": c.depth_example,
                "why_it_matters": c.why_it_matters,
                "real_world_app": c.real_world_app,
                "cross_domain_app": c.cross_domain_app,
                "contrast_concept": c.contrast_concept
            } for c in concepts
        ],
        "relationships": [
            {
                "source_concept": r.source_concept,
                "target_concept": r.target_concept,
                "relation_type": r.relation_type,
                "explanation": r.explanation
            } for r in relationships
        ],
        "challenges": [
            {
                "id": ch.id,
                "concept_name": ch.concept_name,
                "scenario": ch.scenario,
                "task": ch.task,
                "challenge_type": ch.challenge_type,
                "difficulty": ch.difficulty,
                "context": ch.context,
                "hints": ch.hints or []
            } for ch in challenges
        ],
        "knowledge_gaps": [
            {
                "id": g.id,
                "concept_name": g.concept_name,
                "understanding_score": g.understanding_score,
                "status": g.status,
                "remediation_notes": g.remediation_notes
            } for g in gaps
        ],
        "recent_analysis": recent_analysis
    }

@router.post("/session/{session_id}/challenge")
def generate_challenge_endpoint(session_id: str, concept_name: str = None, db: Session = Depends(get_db)):
    session = db.query(LearningSession).filter(LearningSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    target_concept = concept_name or session.topic
    challenge_schema, _ = ai_service.generate_challenge(session.topic, target_concept, session.level)

    ch_db = Challenge(
        session_id=session.id,
        concept_name=challenge_schema.concept_name,
        scenario=challenge_schema.scenario,
        task=challenge_schema.task,
        challenge_type=challenge_schema.challenge_type,
        difficulty=challenge_schema.difficulty,
        context=challenge_schema.context,
        hints=challenge_schema.hints
    )
    db.add(ch_db)
    db.commit()
    db.refresh(ch_db)

    return {
        "id": ch_db.id,
        "concept_name": ch_db.concept_name,
        "scenario": ch_db.scenario,
        "task": ch_db.task,
        "challenge_type": ch_db.challenge_type,
        "difficulty": ch_db.difficulty,
        "context": ch_db.context,
        "hints": ch_db.hints
    }

@router.post("/session/{session_id}/response")
def submit_student_response(session_id: str, req: SubmitResponseRequest, db: Session = Depends(get_db)):
    try:
        analysis_db = LearningEngine.process_response(db, session_id, req)
        return {
            "analysis_id": analysis_db.id,
            "understanding_level": analysis_db.understanding_level,
            "score": analysis_db.score,
            "profile": {
                "overall_score": analysis_db.score,
                "knowledge": analysis_db.score_knowledge,
                "connections": analysis_db.score_connections,
                "reasoning": analysis_db.score_reasoning,
                "application": analysis_db.score_application,
                "explanation": analysis_db.score_explanation
            },
            "concepts_understood": analysis_db.concepts_understood,
            "missing_concepts": analysis_db.missing_concepts,
            "misconceptions": analysis_db.misconceptions,
            "reasoning_quality": analysis_db.reasoning_quality,
            "feedback": analysis_db.feedback,
            "next_learning_action": analysis_db.next_learning_action
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to analyze reasoning: {str(e)}")

@router.get("/session/{session_id}/summary")
def get_session_summary(session_id: str, db: Session = Depends(get_db)):
    session = db.query(LearningSession).filter(LearningSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    concepts = db.query(Concept).filter(Concept.session_id == session_id).all()
    relationships = db.query(ConceptRelationship).filter(ConceptRelationship.session_id == session_id).all()
    challenges = db.query(Challenge).filter(Challenge.session_id == session_id).all()
    gaps = db.query(KnowledgeGap).filter(KnowledgeGap.session_id == session_id).all()
    responses = db.query(StudentResponse).filter(StudentResponse.session_id == session_id).all()

    avg_score = 75.0
    if responses:
        scores = [r.analysis.score for r in responses if r.analysis]
        if scores:
            avg_score = sum(scores) / len(scores)

    mastered = [c.name for c in concepts if c.category in ["main", "prerequisite"]]

    rec_next = f"You have demonstrated strong understanding of {session.topic}. Next, try applying cross-domain scenarios!"
    if gaps:
        rec_next = f"Review detected knowledge gap: {gaps[0].concept_name}. Launch an adaptive remediation exercise."

    return {
        "session_id": session.id,
        "topic": session.topic,
        "level": session.level,
        "overall_understanding": round(avg_score, 1),
        "mastered_concepts": mastered,
        "discovered_connections": len(relationships),
        "applied_challenges_count": len(responses),
        "knowledge_gaps": [
            {
                "id": g.id,
                "concept_name": g.concept_name,
                "understanding_score": g.understanding_score,
                "status": g.status,
                "remediation_notes": g.remediation_notes
            } for g in gaps
        ],
        "recommended_next_step": rec_next
    }
