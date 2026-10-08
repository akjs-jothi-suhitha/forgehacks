import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ConceptItem, RelationshipItem } from '../services/api';
import { Sparkles, Info, X, Zap, Lightbulb, Globe } from 'lucide-react';

interface ConceptGraphProps {
  concepts: ConceptItem[];
  relationships: RelationshipItem[];
  topic: string;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ concepts, relationships, topic }) => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptItem | null>(null);

  // Layout node positions dynamically in structured hierarchy
  const { nodes, edges } = useMemo(() => {
    if (!concepts || concepts.length === 0) {
      return { nodes: [], edges: [] };
    }

    const prerequisites = concepts.filter(c => c.category === 'prerequisite');
    const mainConcepts = concepts.filter(c => c.category === 'main');
    const relatedConcepts = concepts.filter(c => c.category === 'related');
    const appConcepts = concepts.filter(c => c.category === 'application');

    const generatedNodes: Node[] = [];

    // Helper to calculate X positions nicely
    const placeRow = (items: ConceptItem[], startY: number) => {
      const total = items.length;
      const spacingX = 260;
      const startX = -((total - 1) * spacingX) / 2;

      items.forEach((item, idx) => {
        let nodeColorClass = 'bg-slate-900 border-slate-700 text-gray-200';
        let badgeColor = 'bg-slate-800 text-gray-400';

        if (item.category === 'main') {
          nodeColorClass = 'bg-gradient-to-br from-indigo-900/90 via-violet-900/90 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white';
          badgeColor = 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40';
        } else if (item.category === 'prerequisite') {
          nodeColorClass = 'bg-slate-900 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-500/10';
          badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        } else if (item.category === 'application') {
          nodeColorClass = 'bg-slate-900 border-amber-500/60 text-amber-200 shadow-md shadow-amber-500/10';
          badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
        } else {
          nodeColorClass = 'bg-slate-900 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-500/10';
          badgeColor = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
        }

        generatedNodes.push({
          id: item.name,
          position: { x: startX + idx * spacingX, y: startY },
          data: {
            label: (
              <div className="p-3 w-56 text-left cursor-pointer group">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeColor}`}>
                    {item.category}
                  </span>
                  <Info className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div className="font-bold text-sm text-gray-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {item.name}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-tight">
                  {item.summary}
                </div>
              </div>
            )
          },
          className: `rounded-xl border ${nodeColorClass} transition-all hover:scale-105`,
        });
      });
    };

    placeRow(prerequisites, 50);
    placeRow(mainConcepts, 200);
    placeRow(relatedConcepts, 360);
    placeRow(appConcepts, 520);

    // If any concept wasn't placed, place it at bottom
    const placedNames = new Set(generatedNodes.map(n => n.id));
    const unplaced = concepts.filter(c => !placedNames.has(c.name));
    if (unplaced.length > 0) {
      placeRow(unplaced, 660);
    }

    // Build edges
    const generatedEdges: Edge[] = relationships.map((rel, index) => {
      let strokeColor = '#6366f1';
      if (rel.relation_type === 'PREREQUISITE') strokeColor = '#10b981';
      else if (rel.relation_type === 'CONTRASTS_WITH') strokeColor = '#f43f5e';
      else if (rel.relation_type === 'CAUSES') strokeColor = '#f59e0b';

      return {
        id: `e-${index}-${rel.source_concept}-${rel.target_concept}`,
        source: rel.source_concept,
        target: rel.target_concept,
        label: rel.relation_type,
        labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.85 },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
        animated: rel.relation_type === 'PREREQUISITE' || rel.relation_type === 'CAUSES',
        style: { stroke: strokeColor, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
        },
      };
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [concepts, relationships]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    const concept = concepts.find(c => c.name === node.id);
    if (concept) {
      setSelectedConcept(concept);
    }
  };

  return (
    <div className="relative w-full h-[580px] glass-panel rounded-2xl border border-indigo-500/20 overflow-hidden">
      {/* Header Legend */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs">
        <span className="font-semibold text-gray-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" /> {topic} Concept Graph
        </span>
        <div className="h-4 w-px bg-gray-800" />
        <div className="flex items-center gap-1.5 text-indigo-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Main
        </div>
        <div className="flex items-center gap-1.5 text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Prerequisite
        </div>
        <div className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Related
        </div>
        <div className="flex items-center gap-1.5 text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Application
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls />
      </ReactFlow>

      {/* Node Details Modal */}
      {selectedConcept && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setSelectedConcept(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {selectedConcept.category}
              </span>
              {selectedConcept.contrast_concept && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Contrast: {selectedConcept.contrast_concept}
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{selectedConcept.name}</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {selectedConcept.summary}
            </p>

            {/* Explain Like I'm Learning Tabs / Accordions */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Progressive Understanding Levels
              </h4>

              {selectedConcept.depth_intuition && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">1. Simple Intuition</div>
                  <div className="text-sm text-gray-200">{selectedConcept.depth_intuition}</div>
                </div>
              )}

              {selectedConcept.depth_mechanism && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-cyan-400 mb-1">2. Core Mechanism</div>
                  <div className="text-sm text-gray-200">{selectedConcept.depth_mechanism}</div>
                </div>
              )}

              {selectedConcept.depth_technical && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-violet-400 mb-1">3. Technical Explanation</div>
                  <div className="text-sm text-gray-200 font-mono text-xs">{selectedConcept.depth_technical}</div>
                </div>
              )}

              {selectedConcept.depth_example && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-amber-400 mb-1">4. Practical Example</div>
                  <div className="text-sm text-gray-200">{selectedConcept.depth_example}</div>
                </div>
              )}
            </div>

            {/* Connections & Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedConcept.real_world_app && (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-gray-400 flex items-center gap-1 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-World Application
                  </div>
                  <div className="text-xs text-gray-300">{selectedConcept.real_world_app}</div>
                </div>
              )}

              {selectedConcept.cross_domain_app && (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-gray-400 flex items-center gap-1 mb-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Cross-Domain Connection
                  </div>
                  <div className="text-xs text-gray-300">{selectedConcept.cross_domain_app}</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                Close Concept View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
