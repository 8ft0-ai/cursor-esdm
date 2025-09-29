import { useState } from 'react';
import { validateShacl } from 'engine';

export function ValidatePage() {
  const [report, setReport] = useState<string>('');
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function onRunValidation() {
    setLoading(true);
    try {
      const data = await (await fetch('/samples/data.ttl')).text();
      const shapes = await (await fetch('/samples/shapes.ttl')).text();
      const res = await validateShacl(data, shapes);
      setReport(res.reportGraphTurtle);
      setViolations(res.violations);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Validate</h1>
      <p>Run SHACL validation on sample data. Custom file inputs will be added next.</p>
      <div className="actions">
        <button onClick={onRunValidation} disabled={loading}>{loading ? 'Validating…' : 'Run Validation'}</button>
      </div>
      <div className="violations">
        <div className="card"><strong>Report:</strong><pre style={{whiteSpace:'pre-wrap'}}>{report || 'No report yet.'}</pre></div>
        <div className="card"><strong>Violations:</strong> {violations.length}</div>
      </div>
    </div>
  );
}
