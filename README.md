# ConceptForge AI

> **Learn the concept. Connect the ideas. Apply the knowledge.**

[![Hackathon Track](https://img.shields.io/badge/Hackathon--Track-AI%20%2B%20Education-indigo)](https://github.com/)
[![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20TypeScript%20%7C%20Gemini-violet)](https://github.com/)
[![Demo Mode](https://img.shields.io/badge/Demo--Mode-100%25%20Fail--Safe-emerald)](https://github.com/)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/akjs-jothi-suhitha/forgehacks)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?template=https://github.com/akjs-jothi-suhitha/forgehacks)

ConceptForge AI is an adaptive learning platform designed for hackathons that evaluates **how students think**, not merely whether they selected the correct answer.

---

## 🎯 Problem Statement

Traditional educational tools and generic AI chatbots test answer reproducibility:
```text
Memorize → Answer → Forget
```

Students frequently memorize formulas and multiple-choice options without understanding *why* a mechanism works, *how* concepts interrelate, or *when* to apply them in real-world engineering scenarios.

---

## 💡 The Solution

ConceptForge AI replaces rote testing with an adaptive learning loop:

```text
Understand → Connect → Apply → Explain → Analyze → Adapt → Master
```

1. **Map Concept Relationships**: Generates interactive visual graph maps highlighting prerequisites, core mechanisms, contrast concepts, and cross-domain connections.
2. **Evaluate Reasoning**: Analyzes free-form explanations to evaluate 5 cognitive dimensions (Knowledge, Connections, Reasoning, Application, Explanation Quality).
3. **Detect Misconceptions**: Identifies conceptual flaws and missing prerequisites.
4. **Adapt Learning**: Escalates challenge difficulty when mastered, or provides targeted micro-lessons and contrast comparisons when misconceptions occur.

---

## 🚀 Key Features

- **Interactive Concept Maps**: Built with React Flow (`@xyflow/react`), rendering clickable nodes for prerequisites, core concepts, related topics, and applications.
- **5-Axis Cognitive Profile**: Evaluates reasoning depth, knowledge, connections, application, and explanation quality via radar charts.
- **Socratic AI Tutor**: Context-aware assistant that guides student reasoning with graduated hints (Hint 1: clue, Hint 2: guidance, Hint 3: solution pointer).
- **Subject-Agnostic Engine**: Works with Machine Learning, Photosynthesis, Physics, SQL Joins, Network Protocols, Economics, and custom topics.
- **Fail-Safe Demo Mode**: Built-in `DemoProvider` ensures 100% presentation availability even without an API key.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy, SQLite, `google-genai` SDK, Pytest
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Flow (`@xyflow/react`), Recharts, Canvas Confetti

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # On Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
python -m pytest tests/   # Run verification suite
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run build             # Build production bundle
npm run dev               # Start dev server at http://localhost:5173
```

---

## 🌐 1-Click Cloud Deployment

Deploy the entire fullstack application (FastAPI + React SPA) with a single click:

### Option 1: Render (Recommended — Free)
Click below to deploy directly using our pre-configured [render.yaml](render.yaml) blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/akjs-jothi-suhitha/forgehacks)

1. Click the button or go to [render.com/deploy?repo=https://github.com/akjs-jothi-suhitha/forgehacks](https://render.com/deploy?repo=https://github.com/akjs-jothi-suhitha/forgehacks).
2. Connect your GitHub account.
3. (Optional) Provide your `GEMINI_API_KEY` or leave empty to use built-in Demo Mode.
4. Render builds the Docker container and gives you a live permanent link: `https://<your-service>.onrender.com`.

### Option 2: Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?template=https://github.com/akjs-jothi-suhitha/forgehacks)

1. Open [railway.app/new](https://railway.app/new) and select **Deploy from GitHub repo**.
2. Select `akjs-jothi-suhitha/forgehacks`.
3. Railway automatically detects the [Dockerfile](Dockerfile) and assigns a public HTTPS domain.

### Option 3: Docker (Run Anywhere)
```bash
docker build -t conceptforge-ai .
docker run -p 8000:8000 conceptforge-ai
```
Visit `http://localhost:8000` to access the fullstack app.

---

## 🧪 Testing

Run backend pytest suite:
```bash
cd backend
.\venv\Scripts\python -m pytest tests/
```

All 4 test cases verify API health, learning plan generation, reasoning analysis, and progress tracking.

---

## 🏆 Hackathon Track

**AI + Education** — Addressing the official challenge prompt: *"Build an AI-powered solution that helps learners move beyond memorization to understand concepts, make connections, and apply what they learn."*
