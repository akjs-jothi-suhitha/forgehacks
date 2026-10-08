import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend folder is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app" in data

def test_create_learning_session():
    payload = {
        "topic": "Machine Learning",
        "level": "Intermediate",
        "goal": "Understand fundamentals and avoid overfitting"
    }
    response = client.post("/api/v1/learning/session", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["status"] == "created"

    # Fetch session details
    session_id = data["session_id"]
    get_res = client.get(f"/api/v1/learning/session/{session_id}")
    assert get_res.status_code == 200
    session_data = get_res.json()
    assert session_data["topic"] == "Machine Learning"
    assert len(session_data["concepts"]) > 0
    assert len(session_data["relationships"]) > 0

def test_student_response_reasoning_analysis():
    # First create session
    payload = {"topic": "Machine Learning", "level": "Intermediate", "goal": "Test evaluation"}
    res = client.post("/api/v1/learning/session", json=payload)
    session_id = res.json()["session_id"]

    # Get challenge ID
    session_res = client.get(f"/api/v1/learning/session/{session_id}").json()
    challenge_id = session_res["challenges"][0]["id"]

    # Submit response
    resp_payload = {
        "challenge_id": challenge_id,
        "user_input": "The model is overfitting because it memorized the training data details instead of learning general patterns. We should use regularization or dropout.",
        "response_time_seconds": 45
    }
    eval_res = client.post(f"/api/v1/learning/session/{session_id}/response", json=resp_payload)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert "understanding_level" in eval_data
    assert "score" in eval_data
    assert eval_data["score"] >= 70
    assert "profile" in eval_data

def test_progress_endpoint():
    res = client.get("/api/v1/progress")
    assert res.status_code == 200
    data = res.json()
    assert "overall_understanding" in data
    assert "profile_breakdown" in data
