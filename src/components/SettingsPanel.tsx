import { useMoleculeStore } from '../store/useMoleculeStore';

export function SettingsPanel() {
  const {
    showLabels,
    setShowLabels,
    showBondInfo,
    setShowBondInfo,
    showAxes,
    setShowAxes,
    moleculeName,
    setMoleculeName,
  } = useMoleculeStore();

  return (
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          Molecule Name
        </h3>
        <input
          type="text"
          value={moleculeName}
          onChange={(e) => setMoleculeName(e.target.value)}
          className="w-full bg-surface-container text-on-surface rounded-xl px-3 py-2.5 text-sm border border-outline-variant focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          Display
        </h3>
        <div className="space-y-1">
          <ToggleRow
            label="Atom Labels"
            checked={showLabels}
            onChange={setShowLabels}
          />
          <ToggleRow
            label="Bond Lengths"
            checked={showBondInfo}
            onChange={setShowBondInfo}
          />
          <ToggleRow
            label="Axes"
            checked={showAxes}
            onChange={setShowAxes}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
      <span className="text-sm text-on-surface">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-outline'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}
