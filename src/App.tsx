import { useEffect } from 'react';
import { MoleculeScene } from './components/MoleculeScene';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { useMoleculeStore } from './store/useMoleculeStore';

export default function App() {
  const { undo, redo, deleteSelected } = useMoleculeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault();
          deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">MolBuilder</h1>
            <p className="text-[10px] text-gray-400 leading-tight">3D Molecular Structure Builder</p>
          </div>
        </div>
      </header>

      <Toolbar />

      <div className="flex flex-1 min-h-0">
        <MoleculeScene />
        <Sidebar />
      </div>

      <StatusBar />
    </div>
  );
}
