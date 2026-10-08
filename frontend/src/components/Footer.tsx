import React from 'react';
import { BrainCircuit, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 mt-20 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">ConceptForge AI</div>
            <div className="text-[11px] text-gray-400">Learn the concept. Connect the ideas. Apply the knowledge.</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-gray-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Hackathon Submission — Track: <strong className="text-white">AI + Education</strong></span>
        </div>

        <div className="text-center md:text-right text-[11px]">
          Crafted with care for conceptual learners worldwide.
        </div>

      </div>
    </footer>
  );
};
