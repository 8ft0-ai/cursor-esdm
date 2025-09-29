import { create } from 'zustand';
import type { Edge, Node, Prefix, ParseResult } from 'engine';
import { parseTurtleToGraph } from 'engine';

type DataState = {
  nodes: Node[];
  edges: Edge[];
  prefixes: Prefix[];
  loadFromTurtle: (turtle: string) => Promise<void>;
  reset: () => void;
};

export const useDataStore = create<DataState>((set) => ({
  nodes: [],
  edges: [],
  prefixes: [],
  async loadFromTurtle(turtle: string) {
    const result: ParseResult = await parseTurtleToGraph(turtle);
    set({ nodes: result.nodes, edges: result.edges, prefixes: result.prefixes });
  },
  reset() {
    set({ nodes: [], edges: [], prefixes: [] });
  }
}));

