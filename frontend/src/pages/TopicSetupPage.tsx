import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, ArrowRight, BookOpen, Target, Layers, PlayCircle } from 'lucide-react';
import { createSession } from '../services/api';

export const TopicSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [goal, setGoal] = useState('Understand fundamentals & application');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetTopics = [
    { title: 'Machine Learning', category: 'Computer Science', level: 'Intermediate', goal: 'Avoid overfitting & master generalization' },
    { title: 'Photosynthesis', category: 'Biology / Chemistry', level: 'Beginner', goal: 'Understand light reactions & Calvin cycle' },
    { title: 'Newton\'s Laws of Motion', category: 'Physics', level: 'Beginner', goal: 'Apply force balance & inertia' },
    { title: 'SQL Joins & Performance', category: 'Database Systems', level: 'Intermediate', goal: 'Optimize INNER, LEFT, and Cartesian joins' },
    { title: 'TCP Congestion Control', category: 'Networking', level: 'Advanced', goal: 'Master Slow Start & Fast Retransmit' },
    { title: 'Supply and Demand Elasticity', category: 'Economics', level: 'Intermediate', goal: 'Analyze market equilibrium shifts' }
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to start learning');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await createSession({ topic: topic.trim(), level, goal });
      navigate(`/session/${res.session_id}`);
    } catch (err: any) {
      setError('Failed to initialize session. Please check your connection and retry.');
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof presetTopics[0]) => {
    setTopic(preset.title);
    setLevel(preset.level);
    setGoal(preset.goal);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-lg shadow-indigo-500/10">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Start a Learning Session</h1>
        <p className="text-gray-400 text-sm mt-2">
          Enter any academic subject or technical concept to build an interactive AI learning model.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 shadow-2xl mb-10">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => handleSubmit()}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[10px] hover:bg-rose-500 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Topic Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Topic or Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, Photosynthesis, SQL Joins, Probability..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Level Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" /> Current Knowledge Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="Beginner">Beginner (Intuition & Basics)</option>
                <option value="Intermediate">Intermediate (Core Mechanics & Application)</option>
                <option value="Advanced">Advanced (Technical Depth & Edge Cases)</option>
              </select>
            </div>

            {/* Goal Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" /> Primary Learning Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Understand fundamentals, prepare for exam, solve scenarios"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Building Concept Map & Challenges...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Build Concept Map & Start Learning
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>

        </form>

      </div>

      {/* Preset Topics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-amber-400" /> Popular Topic Presets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {presetTopics.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="glass-card p-4 rounded-xl text-left border border-slate-800 hover:border-indigo-500/40 transition-all group cursor-pointer"
            >
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1">
                {preset.category}
              </div>
              <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                {preset.title}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                {preset.goal}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
