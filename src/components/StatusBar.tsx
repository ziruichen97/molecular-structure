import { useMoleculeStore } from '../store/useMoleculeStore';

export function StatusBar() {
  const {
    atoms,
    bonds,
    toolMode,
    selectedAtomIds,
    selectedBondIds,
    getMolecularFormula,
    getMolecularWeight,
  } = useMoleculeStore();

  const formula = getMolecularFormula();
  const weight = getMolecularWeight();

  return (
    <div className="bg-gray-900 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span>原子: {atoms.length}</span>
        <span>化学键: {bonds.length}</span>
        {formula && <span>分子式: {formula}</span>}
        {weight > 0 && <span>分子量: {weight.toFixed(2)} g/mol</span>}
      </div>
      <div className="flex items-center gap-4">
        {(selectedAtomIds.length > 0 || selectedBondIds.length > 0) && (
          <span>
            选中: {selectedAtomIds.length} 原子, {selectedBondIds.length} 键
          </span>
        )}
        <span className="capitalize">工具: {toolMode}</span>
      </div>
    </div>
  );
}
