import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProgress } from '../services/api';
import { UnderstandingProfileChart } from '../components/UnderstandingProfileChart';
import { BarChart3, AlertTriangle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { createSession } from '../services/api';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const res = await fetchProgress();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchGap = async (conceptName: string) => {
    try {
      const res = await createSession({
        topic: conceptName,
        level: 'Intermediate',
        goal: `Targeted remediation for ${conceptName}`
      });
      navigate(`/session/${res.session_id}`);
    } catch (e) {
      navigate('/learn');
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
        <p className="text-xs text-gray-400">Loading progress telemetry...</p>
      </div>
    );
  }

  const profile = data.profile_breakdown;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" /> Learner Understanding Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time conceptual telemetry evaluating how you reason across subjects.
          </p>
        </div>

        <button
          onClick={() => navigate('/learn')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Start New Session
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
            Overall Understanding
          </div>
          <div className="text-4xl font-extrabold gradient-text">
            {data.overall_understanding}%
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            AI-calculated learning indicator
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
            Learning Sessions
          </div>
          <div className="text-4xl font-extrabold text-white">
            {data.total_sessions}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Topics explored & mapped
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
            Challenges Evaluated
          </div>
          <div className="text-4xl font-extrabold text-white">
            {data.challenges_solved || 1}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Free-form reasoning analyses
          </div>
        </div>

      </div>

      {/* 5-Axis Profile & Knowledge Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Chart (Left) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">5-Axis Understanding Profile</h3>
            <p className="text-xs text-gray-400 mb-4">Multi-dimensional breakdown of cognitive strengths.</p>
            <UnderstandingProfileChart profile={profile} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-800">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-gray-400 block text-[10px]">Concept Knowledge</span>
              <span className="font-bold text-indigo-300">{profile.concept_knowledge}%</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-gray-400 block text-[10px]">Connections</span>
              <span className="font-bold text-cyan-300">{profile.connections}%</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-gray-400 block text-[10px]">Reasoning</span>
              <span className="font-bold text-violet-300">{profile.reasoning}%</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-gray-400 block text-[10px]">Application</span>
              <span className="font-bold text-amber-300">{profile.application}%</span>
            </div>
          </div>
        </div>

        {/* Knowledge Gaps & Strong Concepts (Right) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Knowledge Gaps */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Active Knowledge Gaps (Needs Attention)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Concepts where misconceptions or missing prerequisites were detected during reasoning analysis.
            </p>

            <div className="space-y-3">
              {data.knowledge_gaps.map((gap: any) => (
                <div key={gap.id} className="bg-slate-900/80 p-4 rounded-xl border border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{gap.concept_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {Math.round(gap.understanding_score)}% Understanding
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{gap.remediation_notes}</p>
                  </div>

                  <button
                    onClick={() => handleLaunchGap(gap.concept_name)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-md"
                  >
                    Remediate Gap
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Concepts */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20">
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Strong Concepts (Mastered)
            </h3>
            <p className="text-xs text-gray-400 mb-4">Concepts with exemplary reasoning scores and high application precision.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.strong_concepts.map((item: any) => (
                <div key={item.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-900/30 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-200">{item.concept_name}</span>
                  <span className="text-xs font-bold text-emerald-400">{Math.round(item.understanding_score)}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Sessions */}
      {data.recent_sessions && data.recent_sessions.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Recent Learning Sessions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-slate-900 text-gray-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Topic</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.recent_sessions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-semibold text-white">{s.topic}</td>
                    <td className="p-3">{s.level}</td>
                    <td className="p-3 uppercase text-[10px] font-bold text-indigo-400">{s.current_stage}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/session/${s.id}`)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Open Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
