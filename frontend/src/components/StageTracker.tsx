import React from 'react';
import { BookOpen, Share2, PlayCircle, MessageSquareQuote, TrendingUp, CheckCircle2 } from 'lucide-react';

interface StageTrackerProps {
  currentStage: string; // understand, connect, apply, explain, improve
  onSelectStage?: (stage: string) => void;
}

export const StageTracker: React.FC<StageTrackerProps> = ({ currentStage, onSelectStage }) => {
  const stages = [
    { id: 'understand', label: '1. Understand', icon: BookOpen, desc: 'Intuition & Rules' },
    { id: 'connect', label: '2. Connect', icon: Share2, desc: 'Prerequisites & Relations' },
    { id: 'apply', label: '3. Apply', icon: PlayCircle, desc: 'Real-world Scenarios' },
    { id: 'explain', label: '4. Explain', icon: MessageSquareQuote, desc: 'Reasoning Analysis' },
    { id: 'improve', label: '5. Improve', icon: TrendingUp, desc: 'Adaptive Learning' },
  ];

  const stageOrder = ['understand', 'connect', 'apply', 'explain', 'improve'];
  const currentIndex = stageOrder.indexOf(currentStage.toLowerCase());

  return (
    <div className="w-full glass-panel rounded-2xl p-4 mb-6 border border-indigo-500/20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === currentStage.toLowerCase();
          const isCompleted = idx < currentIndex;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : isCompleted
                    ? 'bg-slate-800/40 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900/30 text-gray-400 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`text-xs font-semibold tracking-wide ${isActive ? 'text-indigo-200' : isCompleted ? 'text-emerald-300' : 'text-gray-300'}`}>
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-gray-400 line-clamp-1">{stage.desc}</div>
                </div>
              </button>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block w-4 h-0.5 bg-gray-800 shrink-0">
                  <div
                    className={`h-full transition-all ${idx < currentIndex ? 'bg-emerald-500' : 'bg-transparent'}`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
