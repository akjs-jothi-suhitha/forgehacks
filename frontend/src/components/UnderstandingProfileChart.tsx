import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { ReasoningProfile } from '../services/api';

interface ChartProps {
  profile: ReasoningProfile;
}

export const UnderstandingProfileChart: React.FC<ChartProps> = ({ profile }) => {
  const data = [
    { subject: 'Concept Knowledge', score: profile.knowledge || 70, fullMark: 100 },
    { subject: 'Connections', score: profile.connections || 70, fullMark: 100 },
    { subject: 'Reasoning', score: profile.reasoning || 70, fullMark: 100 },
    { subject: 'Application', score: profile.application || 70, fullMark: 100 },
    { subject: 'Explanation', score: profile.explanation || 70, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Radar
            name="Understanding Profile"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
