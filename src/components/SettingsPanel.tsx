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
          分子名称
        </h3>
        <input
          type="text"
          value={moleculeName}
          onChange={(e) => setMoleculeName(e.target.value)}
          className="w-full bg-gray-700 text-gray-200 rounded px-2 py-1.5 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          显示设置
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">显示原子标签</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBondInfo}
              onChange={(e) => setShowBondInfo(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">显示键长信息</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAxes}
              onChange={(e) => setShowAxes(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">显示坐标轴</span>
          </label>
        </div>
      </div>
    </div>
  );
}
