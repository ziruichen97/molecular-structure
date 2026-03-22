import { useEffect } from 'react';
import { MoleculeScene } from './components/MoleculeScene';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { useMoleculeStore } from './store/useMoleculeStore';

const TOOL_MODES = ['select', 'addAtom', 'addBond', 'move', 'delete'] as const;

export default function App() {
  const { undo, redo, deleteSelected, setToolMode, clearSelection, selectAll } = useMoleculeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInputFocused = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
        if (e.key === 'a' && !isInputFocused) {
          e.preventDefault();
          selectAll();
        }
      }

      if (isInputFocused) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }

      if (e.key === 'Escape') {
        clearSelection();
      }

      const toolIndex = parseInt(e.key) - 1;
      if (toolIndex >= 0 && toolIndex < TOOL_MODES.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setToolMode(TOOL_MODES[toolIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected, setToolMode, clearSelection, selectAll]);

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-dim text-on-surface overflow-hidden">
      <div className="bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)] z-10">
        <header className="px-5 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-sm font-semibold text-on-primary shadow-sm">
              M
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-on-surface">MolBuilder</h1>
              <p className="text-[10px] text-on-surface-variant leading-tight">3D Molecular Structure Builder</p>
            </div>
          </div>
        </header>
        <Toolbar />
      </div>

      <div className="flex flex-1 min-h-0">
        <MoleculeScene />
        <Sidebar />
      </div>

      <StatusBar />
    </div>
  );
}
