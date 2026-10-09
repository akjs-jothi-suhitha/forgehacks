import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Brain, Share2, PlayCircle, CheckCircle2,
  XCircle, Lightbulb, Compass, Zap, RefreshCw
} from 'lucide-react';
import { createSession } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    try {
      const res = await createSession({
        topic: 'Machine Learning',
        level: 'Intermediate',
        goal: 'Understand fundamentals, generalization & avoid overfitting'
      });
      navigate(`/session/${res.session_id}`);
    } catch (e) {
      navigate('/learn');
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
          Stop memorizing. <br className="hidden sm:inline" />
          <span className="gradient-text">Start understanding.</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300 font-normal leading-relaxed mb-10">
          ConceptForge AI evaluates <strong className="text-white font-semibold">how you think</strong>, not merely whether you selected the correct answer. Map concept relationships, test reasoning in real-world scenarios, and receive adaptive follow-ups.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/learn"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer glow-pill"
          >
            <Sparkles className="w-5 h-5" />
            Start Learning
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>

          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-card text-white font-semibold text-base hover:bg-slate-800/80 transition-all cursor-pointer border border-slate-700"
          >
            <PlayCircle className="w-5 h-5 text-cyan-400" />
            Explore Interactive Session
          </button>
        </div>

        {/* Learning Cycle Pipeline Ribbon */}
        <div className="max-w-4xl mx-auto glass-panel p-6 rounded-2xl border border-indigo-500/20 shadow-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
            The ConceptForge AI Learning Loop
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { title: '1. Understand', icon: Brain, color: 'text-indigo-400' },
              { title: '2. Connect', icon: Share2, color: 'text-cyan-400' },
              { title: '3. Apply', icon: PlayCircle, color: 'text-amber-400' },
              { title: '4. Explain', icon: Lightbulb, color: 'text-violet-400' },
              { title: '5. Improve', icon: RefreshCw, color: 'text-emerald-400' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <Icon className={`w-6 h-6 mx-auto mb-1.5 ${step.color}`} />
                  <div className="text-xs font-bold text-gray-200">{step.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison Section */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Why We Built ConceptForge AI</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Traditional platforms test rote memorization. Generic AI chatbots simply output direct answers. We evaluate reasoning to foster long-term conceptual mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Traditional / Generic AI */}
            <div className="glass-panel p-8 rounded-2xl border border-rose-500/20 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Generic AI Chatbots & Traditional Quizzes</h3>
                  <p className="text-xs text-rose-300 font-mono">Memorize → Answer → Forget</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Evaluates answer correctness without probing *why* the student chose it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Provides immediate full answers, encouraging passive copying rather than critical thinking.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Fails to detect partial understandings or hidden conceptual misconceptions.</span>
                </li>
              </ul>
            </div>

            {/* ConceptForge AI */}
            <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 relative shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">ConceptForge AI Platform</h3>
                  <p className="text-xs text-emerald-300 font-mono">Understand → Connect → Apply → Explain → Adapt</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Evaluates student <strong>reasoning depth</strong>, conceptual connections, and missing prerequisites.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Generates interactive visual concept graphs showing how ideas interrelate.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dynamically adapts follow-up challenges based on detected misconceptions.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">Core Hackathon Differentiators</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Subject-agnostic AI architecture engineered specifically for deep conceptual learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Interactive Concept Maps</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Visualize prerequisite trees, core mechanisms, contrast concepts, and cross-domain connections dynamically generated by AI.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Reasoning Evaluator</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Analyzes student free-form explanations, scoring 5 dimensions: Knowledge, Connections, Reasoning, Application, and Explanation Quality.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Adaptive Learning Loop</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              If a misconception is detected, the engine dynamically recalibrates, offering micro-lessons, contrast comparisons, and targeted re-challenges.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to test your conceptual understanding?</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto">
            Choose any topic—from Machine Learning to Quantum Mechanics or Photosynthesis—and experience adaptive learning in action.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/learn"
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
