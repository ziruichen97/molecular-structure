import { useRef } from 'react';
import { useMoleculeStore } from '../store/useMoleculeStore';

export function FilePanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportMOL, exportJSON, importJSON, atoms } = useMoleculeStore();

  const handleExportMOL = () => {
    const content = exportMOL();
    downloadFile(content, 'molecule.mol', 'chemical/x-mdl-molfile');
  };

  const handleExportJSON = () => {
    const content = exportJSON();
    downloadFile(content, 'molecule.json', 'application/json');
  };

  const handleExportSDF = () => {
    const mol = exportMOL();
    const sdf = mol + '\n$$$$\n';
    downloadFile(sdf, 'molecule.sdf', 'chemical/x-mdl-sdfile');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (file.name.endsWith('.json')) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveLocal = () => {
    const content = exportJSON();
    const key = `molbuilder_save_${Date.now()}`;
    localStorage.setItem(key, content);
    const saves = JSON.parse(localStorage.getItem('molbuilder_saves') || '[]');
    saves.push({ key, name: useMoleculeStore.getState().moleculeName, date: new Date().toISOString() });
    localStorage.setItem('molbuilder_saves', JSON.stringify(saves));
    alert('已保存到本地存储');
  };

  return (
    <div className="p-3 space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          文件操作
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={handleSaveLocal}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            💾 保存到本地
          </button>
          <button
            onClick={handleImport}
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 border border-gray-600 transition-colors"
          >
            📂 导入 JSON
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          导出格式
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={handleExportJSON}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 border border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            📄 导出 JSON
          </button>
          <button
            onClick={handleExportMOL}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 border border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            🧪 导出 MOL (V2000)
          </button>
          <button
            onClick={handleExportSDF}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 border border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            📋 导出 SDF
          </button>
        </div>
      </div>

      <LocalSaves />
    </div>
  );
}

function LocalSaves() {
  const { importJSON } = useMoleculeStore();
  const saves: { key: string; name: string; date: string }[] = JSON.parse(
    localStorage.getItem('molbuilder_saves') || '[]'
  );

  if (saves.length === 0) return null;

  const handleLoad = (key: string) => {
    const data = localStorage.getItem(key);
    if (data) importJSON(data);
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    const updated = saves.filter(s => s.key !== key);
    localStorage.setItem('molbuilder_saves', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        本地存储
      </h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {saves.slice().reverse().map(save => (
          <div
            key={save.key}
            className="flex items-center justify-between px-2 py-1.5 rounded bg-gray-700/50 border border-gray-600 text-xs"
          >
            <div className="truncate flex-1 mr-2">
              <span className="text-gray-300">{save.name}</span>
              <span className="text-gray-500 ml-1">
                {new Date(save.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleLoad(save.key)}
                className="px-1.5 py-0.5 rounded bg-blue-600/50 text-blue-300 hover:bg-blue-600"
              >
                加载
              </button>
              <button
                onClick={() => handleDelete(save.key)}
                className="px-1.5 py-0.5 rounded bg-red-600/50 text-red-300 hover:bg-red-600"
              >
                删
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
