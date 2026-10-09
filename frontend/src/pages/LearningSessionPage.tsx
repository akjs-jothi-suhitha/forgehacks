import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSession, submitStudentResponse, fetchHint, type SessionData, type ReasoningAnalysisResult
} from '../services/api';
import { StageTracker, type StageId } from '../components/StageTracker';
import { ConceptGraph } from '../components/ConceptGraph';
import { UnderstandingProfileChart } from '../components/UnderstandingProfileChart';
import { TutorDrawer } from '../components/TutorDrawer';
import {
  Sparkles, Brain, Share2, PlayCircle, CheckCircle2, AlertTriangle, Lightbulb,
  ArrowRight, ArrowLeft, Send, Globe, Award, BookOpen, MessageSquareQuote,
  TrendingUp, RefreshCw, Zap, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LearningSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<StageId>('understand');
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [userResponse, setUserResponse] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReasoningAnalysisResult | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      loadSessionData(id);
    }
  }, [id]);

  const loadSessionData = async (sessionId: string) => {
    try {
      setLoading(true);
      const data = await getSession(sessionId);
      setSession(data);
      if (data.recent_analysis) {
        setAnalysisResult(data.recent_analysis);
      }
      if (data.current_stage) {
        const stage = data.current_stage.toLowerCase() as StageId;
        const validStages: StageId[] = ['understand', 'connect', 'apply', 'explain', 'improve'];
        if (validStages.includes(stage)) {
          setActiveStage(stage);
        }
      }
    } catch (e) {
      console.error('Error fetching session:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStageSelect = (stage: StageId) => {
    setActiveStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStage = () => {
    const order: StageId[] = ['understand', 'connect', 'apply', 'explain', 'improve'];
    const idx = order.indexOf(activeStage);
    if (idx < order.length - 1) {
      const next = order[idx + 1];
      setCompletedStages(prev => Array.from(new Set([...prev, activeStage])));
      setActiveStage(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStage = () => {
    const order: StageId[] = ['understand', 'connect', 'apply', 'explain', 'improve'];
    const idx = order.indexOf(activeStage);
    if (idx > 0) {
      setActiveStage(order[idx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !userResponse.trim() || evaluating) return;

    const currentChallenge = session.challenges[0];
    if (!currentChallenge) return;

    setEvaluating(true);
    try {
      const result = await submitStudentResponse(session.id, {
        challenge_id: currentChallenge.id,
        user_input: userResponse.trim(),
        response_time_seconds: 30
      });
      setAnalysisResult(result);
      setCompletedStages(prev => Array.from(new Set([...prev, 'understand', 'connect', 'apply', 'explain'])));
      
      if (result.score >= 80) {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      }

      // Automatically jump to explain tab if not already on it
      setActiveStage('explain');
      loadSessionData(session.id);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleGetHint = async () => {
    if (!session || !session.challenges[0]) return;
    try {
      const res = await fetchHint(session.id, session.challenges[0].id, hintLevel);
      setHintMessage(`[Hint ${hintLevel}/3]: ${res.hint}`);
      setHintLevel(prev => (prev >= 3 ? 1 : prev + 1));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
          <Brain className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Building Concept Model...</h2>
        <p className="text-xs text-gray-400 max-w-sm">
          Extracting key concepts, mapping relationships, and constructing scenario challenges.
        </p>
      </div>
    );
  }

  const currentChallenge = session.challenges[0];
  const filteredConcepts = (session.concepts || []).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Session Title Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {session.level} Level
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{session.topic}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{session.core_concept_summary}</p>
        </div>

        <button
          onClick={() => navigate(`/summary/${session.id}`)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Award className="w-4 h-4 text-amber-400" /> View Session Summary
        </button>
      </div>

      {/* 5-Stage Progression Tracker with Direct Navigation */}
      <StageTracker
        currentStage={activeStage}
        onSelectStage={handleStageSelect}
        completedStages={completedStages}
      />

      {/* ========================================================================= */}
      {/* STAGE 1: UNDERSTAND (Intuition & Progressive Understanding) */}
      {/* ========================================================================= */}
      {activeStage === 'understand' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Stage 1: Progressive Concept Understanding
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Master the intuition, underlying mechanism, technical definitions, and concrete examples.
                </p>
              </div>

              <input
                type="text"
                placeholder="Filter concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-6">
              {filteredConcepts.map((concept) => (
                <div key={concept.id || concept.name} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                      {concept.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {concept.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {concept.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {concept.depth_intuition && (
                      <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/20">
                        <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" /> 1. Intuition & Metaphor
                        </div>
                        <div className="text-slate-300 leading-relaxed">{concept.depth_intuition}</div>
                      </div>
                    )}

                    {concept.depth_mechanism && (
                      <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/20">
                        <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> 2. Core Mechanism
                        </div>
                        <div className="text-slate-300 leading-relaxed">{concept.depth_mechanism}</div>
                      </div>
                    )}

                    {concept.depth_technical && (
                      <div className="bg-slate-950/90 p-4 rounded-xl border border-violet-500/20 font-mono">
                        <div className="font-bold text-violet-400 mb-1">3. Technical Explanation</div>
                        <div className="text-slate-300 leading-relaxed">{concept.depth_technical}</div>
                      </div>
                    )}

                    {concept.depth_example && (
                      <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/20">
                        <div className="font-bold text-amber-400 mb-1">4. Practical Example</div>
                        <div className="text-slate-300 leading-relaxed">{concept.depth_example}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Stage Navigation */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={nextStage}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                Continue to Stage 2: Connect Concepts <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: CONNECT (Graph, Prerequisites & Contrast Matrix) */}
      {/* ========================================================================= */}
      {activeStage === 'connect' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-cyan-400" /> Stage 2: Concept Map & Relationship Graph
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Interact with the knowledge tree. Click nodes to inspect details, pan, and explore connections.
                </p>
              </div>
            </div>

            {/* Interactive Concept Graph with Custom Dark Nodes */}
            <ConceptGraph concepts={session.concepts} relationships={session.relationships} topic={session.topic} />

            {/* Relationship & Contrast Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {session.concepts.map((concept) => (
                <div key={concept.name} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> {concept.name}
                  </h3>

                  {concept.contrast_concept && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
                      <span className="font-bold text-rose-400">Common Contrast Trap: </span>
                      <span className="text-slate-200">{concept.contrast_concept}</span>
                    </div>
                  )}

                  {concept.cross_domain_app && (
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                      <span className="font-bold text-cyan-400 flex items-center gap-1 mb-0.5">
                        <Globe className="w-3.5 h-3.5" /> Cross-Domain Link:
                      </span>
                      <span className="text-slate-200">{concept.cross_domain_app}</span>
                    </div>
                  )}

                  {concept.real_world_app && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                      <span className="font-bold text-amber-400 mb-0.5 block">Engineering Application:</span>
                      <span className="text-slate-200">{concept.real_world_app}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={prevStage}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous: Understand
              </button>

              <button
                onClick={nextStage}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                Continue to Stage 3: Apply Knowledge <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: APPLY (Real-World Scenarios & Challenges) */}
      {/* ========================================================================= */}
      {activeStage === 'apply' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-amber-400" /> Stage 3: Real-World Scenario Lab
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Apply your conceptual understanding to diagnose real problems and design engineering solutions.
              </p>
            </div>

            {currentChallenge ? (
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentChallenge.difficulty} Challenge
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Target Concept: <strong className="text-white">{currentChallenge.concept_name}</strong>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">{currentChallenge.scenario}</h3>
                  <div className="text-xs text-indigo-300 font-mono bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/40">
                    <strong>Specific Task: </strong>{currentChallenge.task}
                  </div>
                </div>

                {/* Graduated Hint System */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Need guidance? Request a graduated hint (Level 1: Clue → Level 2: Guide → Level 3: Pointer):</span>
                  </div>
                  <button
                    onClick={handleGetHint}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 transition-colors cursor-pointer shrink-0"
                  >
                    Request Hint ({hintLevel}/3)
                  </button>
                </div>

                {hintMessage && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in">
                    {hintMessage}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 flex items-center justify-between">
                  <span>Ready to write down your explanation and get evaluated?</span>
                  <button
                    onClick={() => handleStageSelect('explain')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Go to Stage 4: Explain Reasoning
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">No active challenge found.</div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={prevStage}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous: Connect
              </button>

              <button
                onClick={nextStage}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                Continue to Stage 4: Explain Reasoning <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: EXPLAIN (Reasoning Analysis & 5-Axis Profile) */}
      {/* ========================================================================= */}
      {activeStage === 'explain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left Column: Response Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-indigo-400" /> Stage 4: Conceptual Reasoning Analysis
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Explain your reasoning in your own words. The AI evaluates 5 cognitive dimensions rather than testing simple keywords.
                </p>
              </div>

              {currentChallenge && (
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="font-bold text-white mb-1">{currentChallenge.scenario}</div>
                  <div className="text-indigo-300 font-mono"><strong>Task:</strong> {currentChallenge.task}</div>
                </div>
              )}

              {/* Response Form */}
              <form onSubmit={handleResponseSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                    Your Conceptual Reasoning & Engineering Solution:
                  </label>
                  <textarea
                    rows={6}
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Explain the underlying principles: What is happening conceptually? Why is performance affected? What mechanisms explain this behavior, and what concrete steps solve it?"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>Describe mechanisms, contrast errors, and cause-and-effect relationships.</span>
                    <span>{userResponse.length} characters</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!userResponse.trim() || evaluating}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {evaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Evaluating Conceptual Reasoning Across 5 Dimensions...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Explanation for AI Evaluation
                    </>
                  )}
                </button>
              </form>

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={prevStage}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous: Apply
                </button>

                <button
                  onClick={nextStage}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  Stage 5: Improve <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: 5-Axis Profile Output */}
          <div className="lg:col-span-5 space-y-6">
            {analysisResult ? (
              <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Understanding Level
                    </span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                        analysisResult.understanding_level === 'complete' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        analysisResult.understanding_level === 'partial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {analysisResult.understanding_level}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Reasoning Score
                    </span>
                    <div className="text-3xl font-black gradient-text">
                      {Math.round(analysisResult.score)}%
                    </div>
                  </div>
                </div>

                {/* 5-Axis Radar Chart */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                    5-Axis Cognitive Radar Profile
                  </h4>
                  <UnderstandingProfileChart profile={analysisResult.profile} />
                </div>

                {/* Concepts Understood */}
                {analysisResult.concepts_understood.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Strong Concept Grasps:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.concepts_understood.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Concepts */}
                {analysisResult.missing_concepts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Missing / Misconceptions:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.missing_concepts.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Constructive AI Feedback */}
                <div className="bg-slate-900/95 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Socratic AI Feedback:
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysisResult.feedback}</p>
                </div>

                <button
                  onClick={() => handleStageSelect('improve')}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  Proceed to Stage 5: Improve & Master <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-white text-base">Reasoning Evaluator Ready</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Type your explanation in the challenge box on the left and submit it to see your 5-axis cognitive radar chart and AI feedback.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: IMPROVE (Adaptive Learning, Micro-lessons & Review) */}
      {/* ========================================================================= */}
      {activeStage === 'improve' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Stage 5: Adaptive Improvement & Mastery
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Targeted recommendations to close conceptual gaps, reinforce weak prerequisites, and master the domain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Targeted Micro-Review</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Re-examine contrast concepts and review how boundary conditions differ in complex scenarios.
                </p>
                <button
                  onClick={() => handleStageSelect('understand')}
                  className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  Review Core Concepts <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <RefreshCw className="w-6 h-6 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Re-Attempt Challenge</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apply the AI feedback and refine your explanation to improve your 5-axis reasoning score.
                </p>
                <button
                  onClick={() => handleStageSelect('explain')}
                  className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  Refine Explanation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Complete & View Report</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate the final mastery certificate and conceptual progress report for this topic.
                </p>
                <button
                  onClick={() => navigate(`/summary/${session.id}`)}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  Open Session Summary <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={prevStage}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous: Explain
              </button>

              <button
                onClick={() => navigate(`/summary/${session.id}`)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                Finish & View Session Summary <Award className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Socratic AI Tutor Drawer */}
      <TutorDrawer
        sessionId={session.id}
        challengeId={currentChallenge?.id}
        topic={session.topic}
        currentConcept={currentChallenge?.concept_name}
      />

    </div>
  );
};
