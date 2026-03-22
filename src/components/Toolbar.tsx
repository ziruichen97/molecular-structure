import { useMoleculeStore } from '../store/useMoleculeStore';
import type { ToolMode } from '../types/chemistry';

function IconSelect() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2l7 12 1.5-4.5L16 8z" transform="translate(-1.5, -0.5) scale(0.9)" />
    </svg>
  );
}

function IconAtom() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="8" r="2" />
      <ellipse cx="8" cy="8" rx="7" ry="3" />
      <ellipse cx="8" cy="8" rx="7" ry="3" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="7" ry="3" transform="rotate(-60 8 8)" />
    </svg>
  );
}

function IconBond() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="4" cy="12" r="2.5" />
      <circle cx="12" cy="4" r="2.5" />
      <line x1="6" y1="10" x2="10" y2="6" />
    </svg>
  );
}

function IconMove() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1v14M1 8h14M8 1l-2.5 2.5M8 1l2.5 2.5M8 15l-2.5-2.5M8 15l2.5-2.5M1 8l2.5-2.5M1 8l2.5 2.5M15 8l-2.5-2.5M15 8l-2.5 2.5" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4M6.5 7v5M9.5 7v5" />
      <path d="M3.5 4l.7 9.1a1.5 1.5 0 001.5 1.4h4.6a1.5 1.5 0 001.5-1.4L12.5 4" />
    </svg>
  );
}

function IconUndo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h7a4 4 0 010 8H8" />
      <path d="M6 3L3 6l3 3" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 6H6a4 4 0 000 8h2" />
      <path d="M10 3l3 3-3 3" />
    </svg>
  );
}

function IconOptimize() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
      <path d="M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

const tools: { mode: ToolMode; label: string; icon: React.ReactNode; description: string }[] = [
  { mode: 'select', label: 'Select', icon: <IconSelect />, description: 'Select atoms or bonds' },
  { mode: 'addAtom', label: 'Atom', icon: <IconAtom />, description: 'Click to add an atom' },
  { mode: 'addBond', label: 'Bond', icon: <IconBond />, description: 'Select two atoms to create a bond' },
  { mode: 'move', label: 'Move', icon: <IconMove />, description: 'Drag to move atoms' },
  { mode: 'delete', label: 'Erase', icon: <IconDelete />, description: 'Click to delete atoms or bonds' },
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
    <div className="px-5 pb-2.5 flex items-center gap-3 flex-wrap">
      <div className="flex items-center bg-surface-container rounded-xl p-0.5">
        {tools.map(tool => (
          <button
            key={tool.mode}
            onClick={() => setToolMode(tool.mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-all ${
              toolMode === tool.mode
                ? 'bg-primary-light text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title={tool.description}
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-outline-variant" />

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <IconUndo />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <IconRedo />
        </button>
      </div>

      <div className="w-px h-6 bg-outline-variant" />

      <button
        onClick={optimizeLayout}
        disabled={atoms.length === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium bg-primary text-on-primary hover:bg-primary-hover shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        title="Optimize molecular geometry"
      >
        <IconOptimize />
        Optimize
      </button>

      <div className="flex items-center gap-1.5">
        {hasSelection && (
          <button
            onClick={deleteSelected}
            className="px-3 py-1.5 rounded-xl text-[13px] font-medium bg-danger-light text-danger hover:bg-danger hover:text-on-primary"
            title="Delete Selected (Delete)"
          >
            Delete Selected
          </button>
        )}
        <button
          onClick={clearAll}
          className="px-3 py-1.5 rounded-xl text-[13px] font-medium text-on-surface-variant hover:bg-danger-light hover:text-danger"
          title="Clear Canvas"
        >
          Clear
        </button>
      </div>

      <div className="ml-auto text-xs text-on-surface-variant opacity-70">
        {toolMode === 'addBond' && 'Select first atom, then click second to create bond'}
        {toolMode === 'addAtom' && 'Click on canvas to place an atom'}
        {toolMode === 'select' && 'Click to select \u00b7 Double-click bond to toggle type'}
        {toolMode === 'move' && 'Drag atoms to reposition'}
        {toolMode === 'delete' && 'Click an atom or bond to delete'}
      </div>
    </div>
  );
}
