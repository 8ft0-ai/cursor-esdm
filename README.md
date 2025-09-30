# cursor-esdm
cursor esdm demo
RDF/SHACL Visualizer — Web-only MVP
===================================

Getting Started
---------------

1. Install pnpm (Corepack):

```
corepack enable
```

2. Install deps and run dev server:

```
pnpm install
pnpm dev
```

3. Open http://localhost:5173 and try the Graph and Validate pages.

Scripts
-------

- `pnpm dev` – start the web app
- `pnpm build` – build all packages
- `pnpm e2e` – run Playwright tests
- `pnpm validate --data samples/data.ttl --shapes samples/shapes.ttl` – run SHACL placeholder

Structure
---------

- `web` – React+Vite app with PWA plugin
- `engine` – TypeScript parsing/validation stubs
- `samples` – Demo datasets
- `e2e` – Playwright tests