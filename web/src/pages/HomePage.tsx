import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store';

export function HomePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loadFromTurtle = useDataStore((s) => s.loadFromTurtle);

  const onFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setLoading(true);
      try {
        const text = await files[0].text();
        await loadFromTurtle(text);
        navigate('/graph');
      } finally {
        setLoading(false);
      }
    },
    [loadFromTurtle, navigate]
  );

  return (
    <div className="page">
      <h1>Load RDF Dataset</h1>
      <p>Drag & drop a Turtle/RDF file or choose a sample to get started.</p>
      <div
        className="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer?.files ?? null);
        }}
      >
        <span>{loading ? 'Parsing…' : 'Drop files here or click to browse'}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttl,.trig,.rdf,.xml,.jsonld,.nq"
          multiple={false}
          style={{ display: 'none' }}
          onChange={(e) => onFiles(e.currentTarget.files)}
        />
      </div>
      <div className="actions">
        <button onClick={() => navigate('/graph')}>Open Graph View</button>
        <button onClick={() => navigate('/validate')}>Go to Validation</button>
      </div>
    </div>
  );
}
