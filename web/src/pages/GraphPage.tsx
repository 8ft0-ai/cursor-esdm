// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';
import cytoscape, { ElementsDefinition } from 'cytoscape';
import cytoscapeSvg from 'cytoscape-svg';
import { useDataStore } from '../store';

cytoscapeSvg(cytoscape);

export function GraphPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodes = useDataStore((s) => s.nodes);
  const edges = useDataStore((s) => s.edges);
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);

  const elements = useMemo<ElementsDefinition>(() => {
    return {
      nodes: nodes.map((n) => ({ data: { id: n.id, label: n.label, types: n.types } })),
      edges: edges.map((e) => ({ data: { id: e.id, source: e.source, target: e.target, label: e.predicate } }))
    };
  }, [nodes, edges]);

  useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        { selector: 'node', style: { label: 'data(label)', 'background-color': '#0b5cff', color: '#fff', 'text-valign': 'center', 'text-halign': 'center' } },
        { selector: 'edge', style: { label: 'data(label)', width: 2, 'line-color': '#a0b4ff', 'target-arrow-shape': 'triangle', 'target-arrow-color': '#a0b4ff', 'curve-style': 'bezier' } }
      ],
      layout: { name: 'cose', padding: 20 }
    });
    setCyInstance(cy);
    cy.resize();
    return () => {
      setCyInstance(null);
      cy.destroy();
    };
  }, [elements]);

  const exportSvg = () => {
    if (!cyInstance) return;
    const svg = (cyInstance as any).svg({ full: true });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <h1>Graph</h1>
      <div className="actions"><button onClick={exportSvg}>Export SVG</button></div>
      <div className="graph-container" ref={containerRef} />
    </div>
  );
}
