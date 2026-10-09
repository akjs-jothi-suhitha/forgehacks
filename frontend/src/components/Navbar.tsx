import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, BarChart3, Compass, PlayCircle } from 'lucide-react';
import { createSession } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
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
      console.error(e);
      // Fallback redirect if backend is starting
      navigate('/learn');
    }
  };

  const navLinks = [
    { name: 'Start Learning', path: '/learn', icon: BrainCircuit },
    { name: 'Concept Explorer', path: '/concepts', icon: Compass },
    { name: 'Application Lab', path: '/application', icon: PlayCircle },
    { name: 'Dashboard', path: '/progress', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                ConceptForge <span className="gradient-text text-lg">AI</span>
              </span>
              <p className="text-[10px] text-gray-400 -mt-1 font-mono tracking-widest">EVALUATE REASONING</p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick Start
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
