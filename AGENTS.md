# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

MolBuilder is a client-side SPA (React 19 + TypeScript + Vite 8 + Three.js) for interactive 3D molecular structure building. There is no backend — all logic runs in the browser.

### Development commands

See `package.json` scripts and `README.md` for standard commands:

- `npm run dev` — starts the Vite dev server on `http://localhost:5173`
- `npm run build` — runs `tsc` then `vite build` (production build)
- `npm run preview` — preview the production build

### Notes

- **No lint/test scripts are configured.** The project has no ESLint, Prettier, or test framework set up. TypeScript type-checking (`npx tsc --noEmit`) is the primary static analysis available.
- **No backend services required.** The app is entirely client-side; no databases, APIs, or Docker containers are needed.
- **WebGL required.** The 3D rendering (Three.js / React Three Fiber) requires a browser with WebGL 2.0 support. Chrome in the Cloud VM works fine for manual testing.
- **UI is in English.** All labels, tabs, tooltips, and status text use English.
- **Three.js scene background** must be set via `scene.background` in a `useThree()` hook (not CSS) because the Canvas uses `alpha: false`.
- **Template loading appends** to existing molecules (not replaces). Offset is auto-calculated along the X axis.
- **Custom templates** are stored in `localStorage` under key `molbuilder_custom_templates`.
- **MOL V2000 import** with automatic 2D-to-3D conversion is supported via the File panel.
- **Force-directed layout** (`⚡ Optimize` button) uses repulsion, spring, and angle forces for geometry optimization.
