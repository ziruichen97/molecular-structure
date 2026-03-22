import { useMoleculeStore } from '../store/useMoleculeStore';
import type { ToolMode } from '../types/chemistry';

const tools: { mode: ToolMode; label: string; icon: string; description: string }[] = [
  { mode: 'select', label: '选择', icon: '🖱️', description: '选择原子或化学键' },
  { mode: 'addAtom', label: '添加原子', icon: '⚛️', description: '点击添加原子' },
  { mode: 'addBond', label: '添加键', icon: '🔗', description: '选择两个原子添加化学键' },
  { mode: 'move', label: '移动', icon: '✋', description: '拖拽移动原子' },
  { mode: 'delete', label: '删除', icon: '🗑️', description: '点击删除原子或化学键' },
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
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 border-r border-gray-600 pr-3 mr-1">
        {tools.map(tool => (
          <button
            key={tool.mode}
            onClick={() => setToolMode(tool.mode)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              toolMode === tool.mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={tool.description}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-3 mr-1">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="px-2 py-1.5 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title="撤销 (Ctrl+Z)"
        >
          ↩ 撤销
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="px-2 py-1.5 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title="重做 (Ctrl+Y)"
        >
          ↪ 重做
        </button>
      </div>

      <div className="flex items-center gap-1">
        {hasSelection && (
          <button
            onClick={deleteSelected}
            className="px-2 py-1.5 rounded text-sm bg-red-700 text-white hover:bg-red-600"
            title="删除选中 (Delete)"
          >
            删除选中
          </button>
        )}
        <button
          onClick={clearAll}
          className="px-2 py-1.5 rounded text-sm bg-gray-700 text-gray-300 hover:bg-red-700 hover:text-white"
          title="清空画布"
        >
          清空
        </button>
      </div>

      <div className="ml-auto text-xs text-gray-500">
        {toolMode === 'addBond' && '选择第一个原子，然后点击第二个原子创建化学键'}
        {toolMode === 'addAtom' && '点击画布添加原子'}
        {toolMode === 'select' && '点击选择，双击化学键切换键型'}
        {toolMode === 'move' && '拖拽原子改变位置'}
        {toolMode === 'delete' && '点击原子或化学键删除'}
      </div>
    </div>
  );
}
