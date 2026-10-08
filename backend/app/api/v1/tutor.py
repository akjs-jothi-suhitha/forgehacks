from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.session import LearningSession, Challenge
from app.schemas.session import HintRequest, HintResponse, TutorMessageRequest, TutorMessageResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/hint", response_model=HintResponse)
def get_challenge_hint(req: HintRequest, db: Session = Depends(get_db)):
    challenge = db.query(Challenge).filter(Challenge.id == req.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    hints = challenge.hints or []
    idx = max(0, min(req.hint_level - 1, len(hints) - 1)) if hints else 0

    default_hints = [
        f"Think about the primary objective of {challenge.concept_name}.",
        f"Consider what happens when constraints or noise are introduced.",
        f"Connect the underlying theoretical rule to practical execution."
    ]

    selected_hint = hints[idx] if idx < len(hints) else default_hints[idx % 3]

    notes = [
        "Conceptual Clue (Hint Level 1)",
        "Direct Guidance (Hint Level 2)",
        "Strong Solution Pointer (Hint Level 3)"
    ]

    return HintResponse(
        hint_level=req.hint_level,
        hint=selected_hint,
        context_note=notes[min(req.hint_level - 1, 2)]
    )

@router.post("/chat", response_model=TutorMessageResponse)
def tutor_chat(req: TutorMessageRequest, db: Session = Depends(get_db)):
    session = db.query(LearningSession).filter(LearningSession.id == req.session_id).first()
    topic = session.topic if session else "Academic Concept"

    context = f"Stage: {session.current_stage if session else 'understand'}, Concept: {req.current_concept or topic}"
    
    data = ai_service.get_tutor_response(topic, context, req.message)
    return TutorMessageResponse(
        response=data.get("response", "That is an interesting observation! How does it relate to the core mechanism?"),
        follow_up_question=data.get("follow_up_question"),
        suggested_actions=data.get("suggested_actions", [])
    )
