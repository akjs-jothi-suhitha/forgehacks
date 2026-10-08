import React, { useState } from 'react';
import { Search, Compass, Share2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/api';

export const ConceptExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const exploreItems = [
    {
      topic: 'Machine Learning',
      category: 'Computer Science',
      summary: 'Algorithms that learn structural patterns from data and generalize to unseen test inputs.',
      conceptsCount: 6,
      connectionsCount: 5,
      prerequisites: ['Supervised Learning', 'Training/Test Split']
    },
    {
      topic: 'Photosynthesis',
      category: 'Biology / Chemistry',
      summary: 'Conversion of solar light photons into cellular energy (ATP/NADPH) to fix CO2 into glucose.',
      conceptsCount: 4,
      connectionsCount: 3,
      prerequisites: ['Light-Dependent Reactions']
    },
    {
      topic: 'Newton\'s Laws of Motion',
      category: 'Physics',
      summary: 'Fundamental physical laws governing forces, inertia, acceleration, and action-reaction pairs.',
      conceptsCount: 5,
      connectionsCount: 4,
      prerequisites: ['Vectors & Forces']
    },
    {
      topic: 'SQL Joins & Performance',
      category: 'Database Systems',
      summary: 'Combining data tables via relational keys, evaluating join cardinality and index scan costs.',
      conceptsCount: 5,
      connectionsCount: 4,
      prerequisites: ['Relational Schema']
    },
    {
      topic: 'TCP Congestion Control',
      category: 'Computer Networks',
      summary: 'Algorithms managing packet loss, window sizes, slow start, and congestion avoidance.',
      conceptsCount: 4,
      connectionsCount: 3,
      prerequisites: ['Packet Switching']
    },
    {
      topic: 'Supply and Demand Elasticity',
      category: 'Economics',
      summary: 'Market equilibrium dynamics measuring price sensitivity and market clearing prices.',
      conceptsCount: 4,
      connectionsCount: 3,
      prerequisites: ['Market Equilibrium']
    }
  ];

  const filtered = exploreItems.filter(item =>
    item.topic.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.summary.toLowerCase().includes(query.toLowerCase())
  );

  const handleLaunch = async (t: string) => {
    try {
      const res = await createSession({ topic: t, level: 'Intermediate', goal: 'Explore concepts' });
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
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Concept Explorer</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          Explore subject-agnostic concept relationship maps across STEM, business, and academic disciplines.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics (e.g., Machine Learning, SQL, Physics, Biology)..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-xl"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> {item.connectionsCount} links
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {item.topic}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {item.summary}
              </p>

              <div className="space-y-1 text-xs text-gray-400 mb-6">
                <div className="font-semibold text-gray-300">Prerequisites:</div>
                <div className="flex flex-wrap gap-1.5">
                  {item.prerequisites.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 border border-emerald-900/40 text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLaunch(item.topic)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700 hover:border-indigo-500"
            >
              Explore Concept Graph <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
