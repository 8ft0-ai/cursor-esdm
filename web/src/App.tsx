import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { GraphPage } from './pages/GraphPage';
import { HomePage } from './pages/HomePage';
import { ValidatePage } from './pages/ValidatePage';

export default function App() {
  return (
    <div className="app-root">
      <header className="topbar">
        <Link to="/" className="brand">RDF/SHACL Visualizer</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/graph">Graph</NavLink>
          <NavLink to="/validate">Validate</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/validate" element={<ValidatePage />} />
        </Routes>
      </main>
    </div>
  );
}
