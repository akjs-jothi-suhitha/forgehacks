const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface CreateSessionParams {
  topic: string;
  level: string;
  goal: string;
}

export interface SubmitResponseParams {
  challenge_id: string;
  user_input: string;
  response_time_seconds?: number;
}

export interface ConceptItem {
  id: string;
  name: string;
  category: string;
  summary: string;
  depth_intuition?: string;
  depth_mechanism?: string;
  depth_technical?: string;
  depth_example?: string;
  why_it_matters?: string;
  real_world_app?: string;
  cross_domain_app?: string;
  contrast_concept?: string;
}

export interface RelationshipItem {
  source_concept: string;
  target_concept: string;
  relation_type: string;
  explanation?: string;
}

export interface ChallengeItem {
  id: string;
  concept_name: string;
  scenario: string;
  task: string;
  challenge_type: string;
  difficulty: string;
  context?: string;
  hints?: string[];
}

export interface KnowledgeGapItem {
  id: string;
  concept_name: string;
  understanding_score: number;
  status: string;
  remediation_notes?: string;
}

export interface ReasoningProfile {
  overall_score: number;
  knowledge: number;
  connections: number;
  reasoning: number;
  application: number;
  explanation: number;
}

export interface ReasoningAnalysisResult {
  understanding_level: string;
  score: number;
  profile: ReasoningProfile;
  concepts_understood: string[];
  missing_concepts: string[];
  misconceptions: string[];
  reasoning_quality: string;
  feedback: string;
  next_learning_action: string;
}

export interface SessionData {
  id: string;
  topic: string;
  level: string;
  goal: string;
  status: string;
  is_demo: boolean;
  current_stage: string;
  core_concept_summary?: string;
  concepts: ConceptItem[];
  relationships: RelationshipItem[];
  challenges: ChallengeItem[];
  knowledge_gaps: KnowledgeGapItem[];
  recent_analysis?: ReasoningAnalysisResult;
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function createSession(params: CreateSessionParams): Promise<{ session_id: string; is_demo: boolean }> {
  const res = await fetch(`${API_BASE}/learning/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to create learning session');
  return res.json();
}

export async function getSession(sessionId: string): Promise<SessionData> {
  const res = await fetch(`${API_BASE}/learning/session/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function submitStudentResponse(
  sessionId: string,
  params: SubmitResponseParams
): Promise<ReasoningAnalysisResult> {
  const res = await fetch(`${API_BASE}/learning/session/${sessionId}/response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to submit response');
  return res.json();
}

export async function fetchSessionSummary(sessionId: string) {
  const res = await fetch(`${API_BASE}/learning/session/${sessionId}/summary`);
  if (!res.ok) throw new Error('Summary not found');
  return res.json();
}

export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}

export async function fetchHint(sessionId: string, challengeId: string, hintLevel: number) {
  const res = await fetch(`${API_BASE}/tutor/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, challenge_id: challengeId, hint_level: hintLevel }),
  });
  if (!res.ok) throw new Error('Failed to fetch hint');
  return res.json();
}

export async function sendTutorMessage(sessionId: string, message: string, currentConcept?: string) {
  const res = await fetch(`${API_BASE}/tutor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message, current_concept: currentConcept }),
  });
  if (!res.ok) throw new Error('Failed to send tutor message');
  return res.json();
}
