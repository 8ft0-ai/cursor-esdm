export type Node = {
  id: string;
  iri?: string;
  label: string;
  types: string[];
  literals: { pred: string; value: string; datatype?: string; lang?: string }[];
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  predicate: string;
};

export type Prefix = { prefix: string; iri: string };

export type Constraint = Record<string, unknown>;

export type Shape = {
  id: string;
  targetClass?: string;
  path?: string;
  constraints: Constraint[];
};

export type TripleRef = { s: string; p: string; o: string };

export type Violation = {
  focusNode: string;
  path?: string;
  message?: string;
  severity: 'Violation' | 'Warning' | 'Info';
  sourceShape: string;
  details: TripleRef[];
};

export type ParseResult = {
  nodes: Node[];
  edges: Edge[];
  prefixes: Prefix[];
};

export async function parseTurtleToGraph(turtleText: string): Promise<ParseResult> {
  const { Parser } = await import('n3');
  const parser = new Parser();
  const quads = parser.parse(turtleText);
  const nodeIdSet = new Set<string>();
  const nodesById = new Map<string, Node>();
  const edges: Edge[] = [];
  const prefixesMap: Record<string, string> = (parser as any)._prefixes ?? {};

  function ensureNode(nodeId: string): Node {
    if (!nodesById.has(nodeId)) {
      nodesById.set(nodeId, {
        id: nodeId,
        iri: nodeId.startsWith('_:') ? undefined : nodeId,
        label: deriveLabel(nodeId),
        types: [],
        literals: []
      });
    }
    return nodesById.get(nodeId)!;
  }

  for (const q of quads) {
    const s = termToString(q.subject);
    const p = termToString(q.predicate);
    const o = termToString(q.object);
    nodeIdSet.add(s);
    ensureNode(s);
    if (q.object.termType === 'Literal') {
      const n = ensureNode(s);
      n.literals.push({
        pred: p,
        value: (q.object as any).value,
        datatype: (q.object as any).datatype?.value,
        lang: (q.object as any).language || undefined
      });
    } else {
      nodeIdSet.add(o);
      ensureNode(o);
      const id = `${s} ${p} ${o}`;
      edges.push({ id, source: s, target: o, predicate: p });
    }
    if (p === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
      const n = ensureNode(s);
      n.types.push(o);
    }
  }

  const nodes = Array.from(nodesById.values());
  const prefixes: Prefix[] = Object.entries(prefixesMap).map(([prefix, iri]) => ({ prefix, iri }));
  return { nodes, edges, prefixes };
}

export function deriveLabel(iriOrBlank: string): string {
  if (iriOrBlank.startsWith('_:')) return iriOrBlank;
  const hash = iriOrBlank.lastIndexOf('#');
  const slash = iriOrBlank.lastIndexOf('/');
  const idx = Math.max(hash, slash);
  const frag = idx >= 0 ? iriOrBlank.slice(idx + 1) : iriOrBlank;
  return decodeURIComponent(frag || iriOrBlank);
}

function termToString(term: any): string {
  if (!term) return '';
  if (term.termType === 'NamedNode') return term.value;
  if (term.termType === 'BlankNode') return `_:${term.value}`;
  if (term.termType === 'Literal') return `"${term.value}"`;
  return String(term.value ?? term);
}

export type ValidationResult = {
  reportGraphTurtle: string;
  violations: Violation[];
};

export async function validateShacl(_dataTurtle: string, _shapesTurtle: string): Promise<ValidationResult> {
  // Placeholder: integrate shacl-js or pySHACL via Pyodide later
  return {
    reportGraphTurtle: '@prefix sh: <http://www.w3.org/ns/shacl#> .\n[] a sh:ValidationReport ; sh:conforms true .',
    violations: []
  };
}

