declare module 'cytoscape-svg' {
  import type cytoscape from 'cytoscape';
  const ext: (cytoscape: typeof cytoscape) => void;
  export default ext;
}
