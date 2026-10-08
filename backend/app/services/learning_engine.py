import logging
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.session import (
    LearningSession, Concept, ConceptRelationship, Challenge,
    StudentResponse, ReasoningAnalysis, KnowledgeGap
)
from app.schemas.session import (
    CreateSessionRequest, SessionResponse, ConceptSchema, ConceptRelationshipSchema,
    SubmitResponseRequest, ReasoningAnalysisSchema
)
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

class LearningEngine:
    @staticmethod
    def create_session(db: Session, req: CreateSessionRequest) -> LearningSession:
        # Generate learning plan using AI Service
        plan, is_demo = ai_service.generate_learning_plan(req.topic, req.level)

        # Create session DB object
        session = LearningSession(
            topic=plan.topic,
            level=plan.level,
            goal=req.goal,
            is_demo=is_demo,
            current_stage="understand",
            core_concept_summary=plan.core_concept_summary
        )
        db.add(session)
        db.flush()

        # Add concepts
        for c in plan.concepts:
            concept_db = Concept(
                session_id=session.id,
                name=c.name,
                category=c.category,
                summary=c.summary,
                depth_intuition=c.depth_intuition,
                depth_mechanism=c.depth_mechanism,
                depth_technical=c.depth_technical,
                depth_example=c.depth_example,
                why_it_matters=c.why_it_matters,
                real_world_app=c.real_world_app,
                cross_domain_app=c.cross_domain_app,
                contrast_concept=c.contrast_concept
            )
            db.add(concept_db)

        # Add relationships
        for r in plan.relationships:
            rel_db = ConceptRelationship(
                session_id=session.id,
                source_concept=r.source_concept,
                target_concept=r.target_concept,
                relation_type=r.relation_type,
                explanation=r.explanation
            )
            db.add(rel_db)

        # Initial Knowledge Gaps from misconceptions
        for m in plan.misconceptions:
            gap_db = KnowledgeGap(
                session_id=session.id,
                concept_name=m,
                understanding_score=48.0,
                status="needs_attention",
                remediation_notes=f"Detected potential misconception: {m}"
            )
            db.add(gap_db)

        # Initial Challenge for primary concept
        primary_concept = plan.concepts[0].name if plan.concepts else req.topic
        challenge_schema, _ = ai_service.generate_challenge(plan.topic, primary_concept, req.level)

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
        db.refresh(session)
        return session

    @staticmethod
    def process_response(db: Session, session_id: str, req: SubmitResponseRequest) -> ReasoningAnalysis:
        session = db.query(LearningSession).filter(LearningSession.id == session_id).first()
        if not session:
            raise ValueError("Session not found")

        challenge = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
        if not challenge:
            raise ValueError("Challenge not found")

        # Save student response
        resp_db = StudentResponse(
            session_id=session_id,
            challenge_id=req.challenge_id,
            user_input=req.user_input,
            response_time_seconds=req.response_time_seconds or 0
        )
        db.add(resp_db)
        db.flush()

        # Evaluate reasoning via AI
        analysis_schema, is_demo = ai_service.evaluate_reasoning(
            topic=session.topic,
            challenge_task=challenge.task,
            user_input=req.user_input
        )

        # Save ReasoningAnalysis
        prof = analysis_schema.profile
        analysis_db = ReasoningAnalysis(
            response_id=resp_db.id,
            understanding_level=analysis_schema.understanding_level,
            score=analysis_schema.score,
            score_knowledge=prof.knowledge,
            score_connections=prof.connections,
            score_reasoning=prof.reasoning,
            score_application=prof.application,
            score_explanation=prof.explanation,
            concepts_understood=analysis_schema.concepts_understood,
            missing_concepts=analysis_schema.missing_concepts,
            misconceptions=analysis_schema.misconceptions,
            reasoning_quality=analysis_schema.reasoning_quality,
            feedback=analysis_schema.feedback,
            next_learning_action=analysis_schema.next_learning_action
        )
        db.add(analysis_db)

        # Update stage & concept mastery
        if analysis_schema.score >= 80:
            session.current_stage = "improve"
        elif analysis_schema.score >= 60:
            session.current_stage = "apply"
        else:
            session.current_stage = "understand"

        # Update Knowledge gaps
        for m_concept in analysis_schema.missing_concepts:
            gap = db.query(KnowledgeGap).filter(
                KnowledgeGap.session_id == session_id,
                KnowledgeGap.concept_name == m_concept
            ).first()
            if not gap:
                gap = KnowledgeGap(
                    session_id=session_id,
                    concept_name=m_concept,
                    understanding_score=min(55.0, analysis_schema.score),
                    status="needs_attention",
                    remediation_notes=f"Missing in recent explanation: {analysis_schema.feedback}"
                )
                db.add(gap)
            else:
                gap.understanding_score = min(gap.understanding_score, analysis_schema.score)
                gap.last_updated = datetime.utcnow()

        db.commit()
        db.refresh(analysis_db)
        return analysis_db
