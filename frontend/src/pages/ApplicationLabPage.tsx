import React from 'react';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/api';

export const ApplicationLabPage: React.FC = () => {
  const navigate = useNavigate();

  const scenarios = [
    {
      topic: 'Machine Learning',
      title: 'High Training vs Low Test Performance',
      difficulty: 'Intermediate',
      scenario: 'A company trained a neural network model achieving 98.5% training accuracy, but only 64.2% test accuracy on unseen customer data.',
      task: 'Explain what is happening conceptually and suggest two concrete engineering solutions to fix it.'
    },
    {
      topic: 'Photosynthesis',
      title: 'Green Light Plant Growth Stagnation',
      difficulty: 'Beginner',
      scenario: 'A commercial greenhouse uses green LED lights constantly while providing water and CO2. Sugar production completely halts.',
      task: 'Explain why green light halts sugar synthesis despite ample water and carbon dioxide.'
    },
    {
      topic: 'SQL Database',
      title: 'Cartesian Product Performance Collapse',
      difficulty: 'Intermediate',
      scenario: 'A database query joining Users (100k rows) and Orders (1M rows) takes 45 seconds to complete.',
      task: 'Analyze missing join predicates, join type selection, and index coverage.'
    }
  ];

  const handleLaunchScenario = async (topic: string) => {
    try {
      const res = await createSession({ topic, level: 'Intermediate', goal: 'Application Lab Scenario' });
      navigate(`/session/${res.session_id}`);
    } catch (e) {
      navigate('/learn');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-lg shadow-indigo-500/10">
          <PlayCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Application Lab</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          Move beyond multiple-choice questions. Test your conceptual reasoning in real-world scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.topic}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{item.scenario}</p>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-indigo-200 mb-6 font-mono">
                <strong>Task: </strong>{item.task}
              </div>
            </div>

            <button
              onClick={() => handleLaunchScenario(item.topic)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Solve Challenge in Lab <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
