import { useMoleculeStore } from '../store/useMoleculeStore';
import type { ToolMode } from '../types/chemistry';

function IconSelect() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2.5l8.5 14.5 1.8-5.4L19.5 9.5z" transform="translate(-2, -0.5) scale(0.9)" />
    </svg>
  );
}

function IconAtom() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="10" cy="10" r="2.2" />
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" />
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" transform="rotate(60 10 10)" />
      <ellipse cx="10" cy="10" rx="8.5" ry="3.5" transform="rotate(-60 10 10)" />
    </svg>
  );
}

function IconBond() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="5" cy="15" r="3" />
      <circle cx="15" cy="5" r="3" />
      <line x1="7.5" y1="12.5" x2="12.5" y2="7.5" />
    </svg>
  );
}

function IconMove() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v16M2 10h16M10 2l-3 3M10 2l3 3M10 18l-3-3M10 18l3-3M2 10l3-3M2 10l3 3M18 10l-3-3M18 10l-3 3" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h14M7 5V3.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0113 3.5V5M8 8.5v6M12 8.5v6" />
      <path d="M4.5 5l.8 11a2 2 0 002 1.8h5.4a2 2 0 002-1.8L15.5 5" />
    </svg>
  );
}

function IconUndo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7.5h8.5a5 5 0 010 10H10" />
      <path d="M7.5 4L4 7.5 7.5 11" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 7.5H7.5a5 5 0 000 10H10" />
      <path d="M12.5 4L16 7.5 12.5 11" />
    </svg>
  );
}

function IconOptimize() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v3.5M10 14.5V18M2 10h3.5M14.5 10H18" />
      <path d="M4.5 4.5l2.5 2.5M13 13l2.5 2.5M4.5 15.5l2.5-2.5M13 7l2.5-2.5" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

const tools: { mode: ToolMode; label: string; icon: React.ReactNode; shortcut: string; description: string }[] = [
  { mode: 'select', label: 'Select', icon: <IconSelect />, shortcut: '1', description: 'Select atoms or bonds (1)' },
  { mode: 'addAtom', label: 'Atom', icon: <IconAtom />, shortcut: '2', description: 'Click to add an atom (2)' },
  { mode: 'addBond', label: 'Bond', icon: <IconBond />, shortcut: '3', description: 'Select two atoms to bond (3)' },
  { mode: 'move', label: 'Move', icon: <IconMove />, shortcut: '4', description: 'Drag to move atoms (4)' },
  { mode: 'delete', label: 'Erase', icon: <IconDelete />, shortcut: '5', description: 'Click to delete (5)' },
];

export function Toolbar() {
  const {
    toolMode,
    setToolMode,
    undo,
    redo,
    historyIndex,
    history,
    clearAll,
    deleteSelected,
    optimizeLayout,
    atoms,
    selectedAtomIds,
    selectedBondIds,
  } = useMoleculeStore();

  const hasSelection = selectedAtomIds.length > 0 || selectedBondIds.length > 0;

  return (
    <div className="px-5 pb-3 pt-1 flex items-center gap-4 flex-wrap">
      <div className="flex items-center bg-surface-container rounded-2xl p-1 gap-0.5">
        {tools.map(tool => (
          <button
            key={tool.mode}
            onClick={() => setToolMode(tool.mode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              toolMode === tool.mode
                ? 'bg-primary-light text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title={tool.description}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-7 bg-outline-variant" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <IconUndo />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <IconRedo />
        </button>
      </div>

      <div className="w-px h-7 bg-outline-variant" />

      <button
        onClick={optimizeLayout}
        disabled={atoms.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-hover shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        title="Optimize molecular geometry"
      >
        <IconOptimize />
        Optimize
      </button>

      <div className="flex items-center gap-2">
        {hasSelection && (
          <button
            onClick={deleteSelected}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-danger-light text-danger hover:bg-danger hover:text-on-primary"
            title="Delete Selected (Del)"
          >
            Delete Selected
          </button>
        )}
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-danger-light hover:text-danger"
          title="Clear Canvas"
        >
          Clear
        </button>
      </div>

      <div className="ml-auto text-xs text-on-surface-variant opacity-70 hidden md:block">
        {toolMode === 'addBond' && 'Select first atom, then click second to create bond'}
        {toolMode === 'addAtom' && 'Click on canvas to place an atom'}
        {toolMode === 'select' && 'Click to select \u00b7 Double-click bond to toggle type'}
        {toolMode === 'move' && 'Drag atoms to reposition'}
        {toolMode === 'delete' && 'Click an atom or bond to delete'}
      </div>
    </div>
  );
}
