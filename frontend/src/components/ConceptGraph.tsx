import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ConceptItem, RelationshipItem } from '../services/api';
import {
  Sparkles, Info, X, Zap, Lightbulb, Globe, Maximize2,
  Minimize2, ZoomIn, ZoomOut, Compass, Move, MousePointerClick
} from 'lucide-react';

interface ConceptGraphProps {
  concepts: ConceptItem[];
  relationships: RelationshipItem[];
  topic: string;
}

// Custom ReactFlow Node for crystal clear dark aesthetics and contrast
const ConceptCardNode: React.FC<{ data: any }> = ({ data }) => {
  const { item, onNodeSelect } = data;
  const category = item.category || 'related';

  let borderColor = 'border-cyan-500/50 hover:border-cyan-400';
  let badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  let bgStyle = 'bg-slate-900/95 shadow-cyan-950/40';
  let titleColor = 'text-cyan-100 group-hover:text-cyan-300';

  if (category === 'main') {
    borderColor = 'border-indigo-500 hover:border-indigo-400 shadow-lg shadow-indigo-500/30';
    badgeStyle = 'bg-indigo-500/30 text-indigo-200 border-indigo-400/50';
    bgStyle = 'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white';
    titleColor = 'text-white font-extrabold';
  } else if (category === 'prerequisite') {
    borderColor = 'border-emerald-500/60 hover:border-emerald-400 shadow-md shadow-emerald-950/40';
    badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    bgStyle = 'bg-slate-900/95';
    titleColor = 'text-emerald-100 group-hover:text-emerald-300';
  } else if (category === 'application') {
    borderColor = 'border-amber-500/60 hover:border-amber-400 shadow-md shadow-amber-950/40';
    badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    bgStyle = 'bg-slate-900/95';
    titleColor = 'text-amber-100 group-hover:text-amber-300';
  }

  return (
    <div
      onClick={() => onNodeSelect && onNodeSelect(item)}
      className={`relative w-64 rounded-2xl border-2 ${borderColor} ${bgStyle} p-3.5 shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer backdrop-blur-md`}
    >
      {/* Target handle on top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-900 !-top-1.5"
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
          {category}
        </span>
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-300 text-[11px] font-medium transition-colors">
          <Info className="w-3.5 h-3.5" />
          <span>Details</span>
        </div>
      </div>

      <div className={`text-sm font-bold leading-snug mb-1.5 ${titleColor} transition-colors line-clamp-1`}>
        {item.name}
      </div>

      <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
        {item.summary}
      </div>

      {item.contrast_concept && (
        <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-rose-300/90 line-clamp-1 flex items-center gap-1">
          <span className="font-semibold text-rose-400">Contrast:</span> {item.contrast_concept}
        </div>
      )}

      {/* Source handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-900 !-bottom-1.5"
      />
    </div>
  );
};

const nodeTypes = {
  conceptCard: ConceptCardNode,
};

const GraphInner: React.FC<ConceptGraphProps> = ({ concepts, relationships, topic }) => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const handleNodeSelect = useCallback((concept: ConceptItem) => {
    setSelectedConcept(concept);
  }, []);

  // Dynamic layout calculation
  const { nodes, edges } = useMemo(() => {
    if (!concepts || concepts.length === 0) {
      return { nodes: [], edges: [] };
    }

    const prerequisites = concepts.filter(c => c.category === 'prerequisite');
    const mainConcepts = concepts.filter(c => c.category === 'main');
    const relatedConcepts = concepts.filter(c => c.category === 'related');
    const appConcepts = concepts.filter(c => c.category === 'application');

    const generatedNodes: Node[] = [];

    const placeRow = (items: ConceptItem[], startY: number) => {
      const total = items.length;
      const spacingX = 290;
      const startX = -((total - 1) * spacingX) / 2;

      items.forEach((item, idx) => {
        generatedNodes.push({
          id: item.name,
          type: 'conceptCard',
          position: { x: startX + idx * spacingX, y: startY },
          data: {
            item,
            onNodeSelect: handleNodeSelect,
          },
        });
      });
    };

    placeRow(prerequisites, 50);
    placeRow(mainConcepts, 200);
    placeRow(relatedConcepts, 360);
    placeRow(appConcepts, 520);

    const placedNames = new Set(generatedNodes.map(n => n.id));
    const unplaced = concepts.filter(c => !placedNames.has(c.name));
    if (unplaced.length > 0) {
      placeRow(unplaced, 670);
    }

    const generatedEdges: Edge[] = (relationships || []).map((rel, index) => {
      let strokeColor = '#818cf8';
      if (rel.relation_type === 'PREREQUISITE') strokeColor = '#34d399';
      else if (rel.relation_type === 'CONTRASTS_WITH') strokeColor = '#fb7185';
      else if (rel.relation_type === 'CAUSES') strokeColor = '#fbbf24';

      return {
        id: `e-${index}-${rel.source_concept}-${rel.target_concept}`,
        source: rel.source_concept,
        target: rel.target_concept,
        label: rel.relation_type,
        labelStyle: { fill: '#cbd5e1', fontSize: 11, fontWeight: 700 },
        labelBgStyle: { fill: '#090d16', fillOpacity: 0.95 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 6,
        animated: rel.relation_type === 'PREREQUISITE' || rel.relation_type === 'CAUSES',
        style: { stroke: strokeColor, strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 16,
          height: 16,
        },
      };
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [concepts, relationships, handleNodeSelect]);

  return (
    <div className={`relative w-full rounded-2xl glass-panel border border-indigo-500/30 overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)] shadow-2xl' : 'h-[620px]'
    }`}>
      
      {/* Top Header Legend & Stats */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-800 text-xs shadow-xl">
        <span className="font-bold text-white flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <Sparkles className="w-4 h-4 text-indigo-400" /> {topic} Graph
        </span>
        <div className="flex items-center gap-1 text-indigo-300 px-1.5 py-0.5 rounded-md bg-indigo-500/10">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Main
        </div>
        <div className="flex items-center gap-1 text-emerald-300 px-1.5 py-0.5 rounded-md bg-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Prerequisite
        </div>
        <div className="flex items-center gap-1 text-cyan-300 px-1.5 py-0.5 rounded-md bg-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Related
        </div>
        <div className="flex items-center gap-1 text-amber-300 px-1.5 py-0.5 rounded-md bg-amber-500/10">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Application
        </div>
      </div>

      {/* Top Right Quick Controls Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
        <button
          onClick={() => zoomIn()}
          title="Zoom In"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => zoomOut()}
          title="Zoom Out"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
          title="Fit & Center Graph"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" /> Center View
        </button>
        <button
          onClick={() => setIsFullscreen(prev => !prev)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Graph'}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Interactive Tips Pill */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1">
          <Move className="w-3 h-3 text-indigo-400" /> Drag to pan
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <MousePointerClick className="w-3 h-3 text-emerald-400" /> Click node to inspect details
        </span>
        <span className="text-slate-600">•</span>
        <span>Scroll wheel to zoom</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={true}
        zoomOnScroll={true}
        nodesDraggable={true}
        elementsSelectable={true}
        minZoom={0.2}
        maxZoom={2.5}
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>

      {/* Node Details Modal */}
      {selectedConcept && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setSelectedConcept(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {selectedConcept.category}
              </span>
              {selectedConcept.contrast_concept && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Contrast: {selectedConcept.contrast_concept}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{selectedConcept.name}</h3>
            <p className="text-slate-200 text-sm mb-6 leading-relaxed bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              {selectedConcept.summary}
            </p>

            {/* Explain Like I'm Learning Levels */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Progressive Understanding Layers
              </h4>

              {selectedConcept.depth_intuition && (
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90">
                  <div className="text-xs font-bold text-emerald-400 mb-1">1. Intuition & Everyday Metaphor</div>
                  <div className="text-sm text-slate-200 leading-relaxed">{selectedConcept.depth_intuition}</div>
                </div>
              )}

              {selectedConcept.depth_mechanism && (
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90">
                  <div className="text-xs font-bold text-cyan-400 mb-1">2. Core Underlying Mechanism</div>
                  <div className="text-sm text-slate-200 leading-relaxed">{selectedConcept.depth_mechanism}</div>
                </div>
              )}

              {selectedConcept.depth_technical && (
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90">
                  <div className="text-xs font-bold text-violet-400 mb-1">3. Technical & Algorithmic Details</div>
                  <div className="text-sm text-slate-200 font-mono text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800 mt-1">
                    {selectedConcept.depth_technical}
                  </div>
                </div>
              )}

              {selectedConcept.depth_example && (
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800/90">
                  <div className="text-xs font-bold text-amber-400 mb-1">4. Practical Application Example</div>
                  <div className="text-sm text-slate-200 leading-relaxed">{selectedConcept.depth_example}</div>
                </div>
              )}
            </div>

            {/* Connections & Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedConcept.real_world_app && (
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-4 h-4" /> Real-World Engineering Use
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">{selectedConcept.real_world_app}</div>
                </div>
              )}

              {selectedConcept.cross_domain_app && (
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5">
                    <Globe className="w-4 h-4" /> Cross-Domain Analogy
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">{selectedConcept.cross_domain_app}</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
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

export const ConceptGraph: React.FC<ConceptGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
};
