import { useMoleculeStore } from '../store/useMoleculeStore';
import type { ToolMode } from '../types/chemistry';

const tools: { mode: ToolMode; label: string; icon: string; description: string }[] = [
  { mode: 'select', label: 'Select', icon: '🖱️', description: 'Select atoms or bonds' },
  { mode: 'addAtom', label: 'Add Atom', icon: '⚛️', description: 'Click to add an atom' },
  { mode: 'addBond', label: 'Add Bond', icon: '🔗', description: 'Select two atoms to create a bond' },
  { mode: 'move', label: 'Move', icon: '✋', description: 'Drag to move atoms' },
  { mode: 'delete', label: 'Delete', icon: '🗑️', description: 'Click to delete atoms or bonds' },
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
    selectedAtomIds,
    selectedBondIds,
  } = useMoleculeStore();

  const hasSelection = selectedAtomIds.length > 0 || selectedBondIds.length > 0;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-1">
        {tools.map(tool => (
          <button
            key={tool.mode}
            onClick={() => setToolMode(tool.mode)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              toolMode === tool.mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={tool.description}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-3 mr-1">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="px-2 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="px-2 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          ↪ Redo
        </button>
      </div>

      <div className="flex items-center gap-1">
        {hasSelection && (
          <button
            onClick={deleteSelected}
            className="px-2 py-1.5 rounded text-sm bg-red-600 text-white hover:bg-red-500"
            title="Delete Selected (Delete)"
          >
            Delete Selected
          </button>
        )}
        <button
          onClick={clearAll}
          className="px-2 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white"
          title="Clear Canvas"
        >
          Clear
        </button>
      </div>

      <div className="ml-auto text-xs text-gray-400">
        {toolMode === 'addBond' && 'Select the first atom, then click the second atom to create a bond'}
        {toolMode === 'addAtom' && 'Click on canvas to add an atom'}
        {toolMode === 'select' && 'Click to select, double-click a bond to toggle type'}
        {toolMode === 'move' && 'Drag atoms to reposition'}
        {toolMode === 'delete' && 'Click an atom or bond to delete'}
      </div>
    </div>
  );
}
