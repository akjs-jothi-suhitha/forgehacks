import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSessionSummary } from '../services/api';
import { Award, CheckCircle2, Share2, ArrowRight, Sparkles, RefreshCw, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SessionSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSummary(id);
    }
  }, [id]);

  const loadSummary = async (sessionId: string) => {
    try {
      setLoading(true);
      const res = await fetchSessionSummary(sessionId);
      setSummary(res);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
        <p className="text-xs text-gray-400">Compiling session summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-600 p-0.5 mx-auto mb-4 shadow-xl shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Award className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Session Complete</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{summary.topic} Summary</h1>
        <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto">
          Here is your conceptual progress and understanding report for this learning session.
        </p>
      </div>

      {/* Main Score Badge */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center shadow-2xl relative overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          Session Conceptual Understanding Score
        </div>
        <div className="text-5xl sm:text-6xl font-black gradient-text my-2">
          {summary.overall_understanding}%
        </div>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Calculated across concept knowledge, relationship connections, scenario application, and reasoning quality.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">{summary.mastered_concepts?.length || 0}</div>
          <div className="text-[11px] text-gray-400">Mastered Concepts</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
          <Share2 className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">{summary.discovered_connections}</div>
          <div className="text-[11px] text-gray-400">Discovered Connections</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
          <RefreshCw className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">{summary.applied_challenges_count}</div>
          <div className="text-[11px] text-gray-400">Applied Scenarios</div>
        </div>
      </div>

      {/* Recommended Next Step Card */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 to-violet-950/40">
        <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> AI Recommended Next Activity
        </h3>
        <p className="text-xs text-indigo-200 leading-relaxed font-medium">
          {summary.recommended_next_step}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate(`/session/${id}`)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          Return to Session
        </button>

        <button
          onClick={() => navigate('/progress')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4" /> Go to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
