import React from 'react';
import { BookOpen, Share2, PlayCircle, MessageSquareQuote, TrendingUp, CheckCircle2 } from 'lucide-react';

export type StageId = 'understand' | 'connect' | 'apply' | 'explain' | 'improve';

interface StageTrackerProps {
  currentStage: string;
  onSelectStage?: (stage: StageId) => void;
  completedStages?: string[];
}

export const StageTracker: React.FC<StageTrackerProps> = ({
  currentStage,
  onSelectStage,
  completedStages = []
}) => {
  const stages: { id: StageId; label: string; icon: any; desc: string }[] = [
    { id: 'understand', label: '1. Understand', icon: BookOpen, desc: 'Intuition & Rules' },
    { id: 'connect', label: '2. Connect', icon: Share2, desc: 'Prerequisites & Relations' },
    { id: 'apply', label: '3. Apply', icon: PlayCircle, desc: 'Real-world Scenarios' },
    { id: 'explain', label: '4. Explain', icon: MessageSquareQuote, desc: 'Reasoning Analysis' },
    { id: 'improve', label: '5. Improve', icon: TrendingUp, desc: 'Adaptive Learning' },
  ];

  const stageOrder: StageId[] = ['understand', 'connect', 'apply', 'explain', 'improve'];
  const normalizedCurrent = (currentStage?.toLowerCase() || 'understand') as StageId;
  const currentIndex = stageOrder.indexOf(normalizedCurrent);

  return (
    <div className="w-full glass-panel rounded-2xl p-3 sm:p-4 mb-6 border border-indigo-500/30 shadow-xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === normalizedCurrent;
          const isCompleted = completedStages.includes(stage.id) || idx < currentIndex;

          return (
            <React.Fragment key={stage.id}>
              <button
                type="button"
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/40 via-violet-600/30 to-indigo-700/20 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : isCompleted
                    ? 'bg-slate-900/80 text-emerald-300 border border-emerald-500/30 hover:bg-slate-800/80 hover:border-emerald-500/50'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-850 hover:border-indigo-500/30 border border-slate-800'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold tracking-wide truncate ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-300'
                      : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{stage.desc}</div>
                </div>
              </button>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block w-3 h-0.5 bg-slate-800 shrink-0">
                  <div
                    className={`h-full transition-all ${
                      idx < currentIndex || isCompleted ? 'bg-emerald-500' : 'bg-transparent'
                    }`}
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
