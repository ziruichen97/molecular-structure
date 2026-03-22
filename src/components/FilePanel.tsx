import { useRef } from 'react';
import { useMoleculeStore } from '../store/useMoleculeStore';

export function FilePanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportMOL, exportJSON, importJSON, importMOL, atoms } = useMoleculeStore();

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
      } else if (file.name.endsWith('.mol') || file.name.endsWith('.sdf')) {
        importMOL(content);
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
  };

  return (
    <div className="p-4 space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.mol,.sdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          File Operations
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={handleSaveLocal}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary-hover shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-colors"
          >
            Save to Local
          </button>
          <button
            onClick={handleImport}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high border border-outline-variant transition-colors"
          >
            Import (JSON / MOL / SDF)
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          Export
        </h3>
        <div className="space-y-1.5">
          <ExportButton label="JSON" onClick={handleExportJSON} disabled={atoms.length === 0} />
          <ExportButton label="MOL (V2000)" onClick={handleExportMOL} disabled={atoms.length === 0} />
          <ExportButton label="SDF" onClick={handleExportSDF} disabled={atoms.length === 0} />
        </div>
      </div>

      <LocalSaves />
    </div>
  );
}

function ExportButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-3 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-left flex items-center justify-between"
    >
      <span>{label}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
        <path d="M7 1v9M3.5 6.5L7 10l3.5-3.5M2 12.5h10" />
      </svg>
    </button>
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
      <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
        Local Storage
      </h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {saves.slice().reverse().map(save => (
          <div
            key={save.key}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container text-xs"
          >
            <div className="truncate flex-1 mr-2">
              <span className="text-on-surface font-medium">{save.name}</span>
              <span className="text-on-surface-variant ml-1.5">
                {new Date(save.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleLoad(save.key)}
                className="px-2 py-1 rounded-lg bg-primary-light text-primary font-medium hover:bg-primary hover:text-on-primary transition-colors"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(save.key)}
                className="px-2 py-1 rounded-lg text-on-surface-variant hover:bg-danger-light hover:text-danger transition-colors"
              >
                Del
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
