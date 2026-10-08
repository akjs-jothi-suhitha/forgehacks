import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSession, submitStudentResponse, fetchHint, type SessionData, type ReasoningAnalysisResult
} from '../services/api';
import { StageTracker } from '../components/StageTracker';
import { ConceptGraph } from '../components/ConceptGraph';
import { UnderstandingProfileChart } from '../components/UnderstandingProfileChart';
import { TutorDrawer } from '../components/TutorDrawer';
import {
  Sparkles, Brain, Share2, PlayCircle, CheckCircle2, AlertTriangle, Lightbulb,
  ArrowRight, Send, Layers, Globe, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LearningSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'understand' | 'connect' | 'apply'>('map');
  const [userResponse, setUserResponse] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReasoningAnalysisResult | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(1);

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
    } catch (e) {
      console.error('Error fetching session:', e);
    } finally {
      setLoading(false);
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
      
      // Trigger confetti if high score achieved
      if (result.score >= 85) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }

      // Reload session stage status
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Session Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {session.level} Level
            </span>
            {session.is_demo && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Mode Fallback
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{session.topic}</h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">{session.core_concept_summary}</p>
        </div>

        <button
          onClick={() => navigate(`/summary/${session.id}`)}
          className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-400" /> View Session Summary
        </button>
      </div>

      {/* 5-Stage Progression Tracker */}
      <StageTracker currentStage={session.current_stage} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'map', label: 'Concept Graph', icon: Share2 },
          { id: 'understand', label: 'Understand Mode', icon: Brain },
          { id: 'connect', label: 'Connections & Contrast', icon: Layers },
          { id: 'apply', label: 'Application Lab & Reasoning', icon: PlayCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-gray-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CONCEPT GRAPH */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <ConceptGraph concepts={session.concepts} relationships={session.relationships} topic={session.topic} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-indigo-400 mb-1">Clickable Nodes</div>
              <div className="text-xs text-gray-300 leading-relaxed">
                Click any node in the graph above to inspect progressive explanations, real-world examples, and cross-domain connections.
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 mb-1">Prerequisite Tree</div>
              <div className="text-xs text-gray-300 leading-relaxed">
                Green nodes indicate foundational prerequisites that should be understood before tackling advanced scenarios.
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-amber-400 mb-1">Applications</div>
              <div className="text-xs text-gray-300 leading-relaxed">
                Orange nodes link theoretical models directly to industry applications in engineering, biology, and finance.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNDERSTAND MODE */}
      {activeTab === 'understand' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" /> Explain Like I'm Learning — Progressive Deep Dive
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Concepts broken down into 4 progressive layers: Intuition, Mechanism, Technical depth, and Practical example.
            </p>

            <div className="space-y-6">
              {session.concepts.map((concept) => (
                <div key={concept.id || concept.name} className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base text-white">{concept.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {concept.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 mb-4">{concept.summary}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {concept.depth_intuition && (
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <div className="font-semibold text-emerald-400 mb-1">1. Intuition</div>
                        <div className="text-gray-300">{concept.depth_intuition}</div>
                      </div>
                    )}
                    {concept.depth_mechanism && (
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <div className="font-semibold text-cyan-400 mb-1">2. Mechanism</div>
                        <div className="text-gray-300">{concept.depth_mechanism}</div>
                      </div>
                    )}
                    {concept.depth_technical && (
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono">
                        <div className="font-semibold text-violet-400 mb-1">3. Technical Explanation</div>
                        <div className="text-gray-300">{concept.depth_technical}</div>
                      </div>
                    )}
                    {concept.depth_example && (
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <div className="font-semibold text-amber-400 mb-1">4. Practical Example</div>
                        <div className="text-gray-300">{concept.depth_example}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONNECT & CONTRAST */}
      {activeTab === 'connect' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" /> How Does This Connect?
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Discover inter-concept relationships, prerequisites, common contrast confusions, and cross-domain applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {session.concepts.map((concept) => (
                <div key={concept.name} className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> {concept.name}
                  </h3>

                  {concept.contrast_concept && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                      <span className="font-bold text-rose-400">Commonly Confused With: </span>
                      <span className="text-gray-200">{concept.contrast_concept}</span>
                    </div>
                  )}

                  {concept.cross_domain_app && (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs">
                      <span className="font-bold text-cyan-400 flex items-center gap-1 mb-0.5">
                        <Globe className="w-3.5 h-3.5" /> Cross-Domain Connection:
                      </span>
                      <span className="text-gray-200">{concept.cross_domain_app}</span>
                    </div>
                  )}

                  {concept.real_world_app && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                      <span className="font-bold text-amber-400 mb-0.5 block">Real-World Application:</span>
                      <span className="text-gray-200">{concept.real_world_app}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPLICATION LAB & REASONING ANALYZER */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Challenge & Response Box (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            
            {currentChallenge ? (
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
                
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Application Challenge — {currentChallenge.difficulty}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Target: {currentChallenge.concept_name}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{currentChallenge.scenario}</h2>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-indigo-200 mb-6 leading-relaxed font-mono">
                  <strong>Task: </strong>{currentChallenge.task}
                </div>

                {/* Graduated Hint Button */}
                <div className="mb-6 flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-gray-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Need a clue? Request a graduated hint:
                  </div>
                  <button
                    onClick={handleGetHint}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/30 transition-colors cursor-pointer"
                  >
                    Get Hint ({hintLevel}/3)
                  </button>
                </div>

                {hintMessage && (
                  <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-in fade-in">
                    {hintMessage}
                  </div>
                )}

                {/* Student Response Form */}
                <form onSubmit={handleResponseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Explain Your Reasoning & Proposed Solution:
                    </label>
                    <textarea
                      rows={5}
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Explain what is happening conceptually, why performance dropped, and what engineering steps you would take..."
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                      <span>Be specific about mechanisms and underlying rules.</span>
                      <span>{userResponse.length} characters</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!userResponse.trim() || evaluating}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {evaluating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Analyzing Conceptual Reasoning...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Explanation for AI Evaluation
                      </>
                    )}
                  </button>
                </form>

              </div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl text-center text-gray-400">
                No active challenge found.
              </div>
            )}

          </div>

          {/* Reasoning Evaluation Output (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            
            {analysisResult ? (
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header Score Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Understanding Level
                    </span>
                    <div className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs ${
                        analysisResult.understanding_level === 'complete' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        analysisResult.understanding_level === 'partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {analysisResult.understanding_level}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Reasoning Score
                    </span>
                    <div className="text-3xl font-extrabold gradient-text">
                      {Math.round(analysisResult.score)}%
                    </div>
                  </div>
                </div>

                {/* 5-Dimensional Radar Chart */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                    5-Axis Conceptual Profile
                  </h4>
                  <UnderstandingProfileChart profile={analysisResult.profile} />
                </div>

                {/* Concepts Understood */}
                {analysisResult.concepts_understood.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> What You Understood:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {analysisResult.concepts_understood.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30">
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
                      <AlertTriangle className="w-4 h-4" /> What Is Missing / Needs Attention:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {analysisResult.missing_concepts.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 bg-amber-950/30 p-2 rounded-lg border border-amber-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Constructive Feedback */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Learning Feedback:
                  </h4>
                  <p className="text-xs text-gray-200 leading-relaxed">{analysisResult.feedback}</p>
                </div>

                {/* Next Action CTA */}
                <button
                  onClick={() => setActiveTab('understand')}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Targeted Explanation <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-gray-400 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-sm">Reasoning Evaluator Ready</h3>
                <p className="text-xs text-gray-400">
                  Submit your response in the challenge form to get a multi-axis understanding analysis and constructive AI feedback.
                </p>
              </div>
            )}

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
