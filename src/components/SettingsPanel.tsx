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
    <div className="p-3 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Molecule Name
        </h3>
        <input
          type="text"
          value={moleculeName}
          onChange={(e) => setMoleculeName(e.target.value)}
          className="w-full bg-gray-50 text-gray-800 rounded px-2 py-1.5 text-sm border border-gray-200 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Display Settings
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded bg-gray-50 border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Atom Labels</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBondInfo}
              onChange={(e) => setShowBondInfo(e.target.checked)}
              className="rounded bg-gray-50 border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Bond Lengths</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAxes}
              onChange={(e) => setShowAxes(e.target.checked)}
              className="rounded bg-gray-50 border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Axes</span>
          </label>
        </div>
      </div>
    </div>
  );
}
