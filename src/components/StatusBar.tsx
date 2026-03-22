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

  const toolLabels: Record<string, string> = {
    select: 'Select',
    addAtom: 'Add Atom',
    addBond: 'Add Bond',
    move: 'Move',
    delete: 'Delete',
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span>Atoms: {atoms.length}</span>
        <span>Bonds: {bonds.length}</span>
        {formula && <span>Formula: {formula}</span>}
        {weight > 0 && <span>Weight: {weight.toFixed(2)} g/mol</span>}
      </div>
      <div className="flex items-center gap-4">
        {(selectedAtomIds.length > 0 || selectedBondIds.length > 0) && (
          <span>
            Selected: {selectedAtomIds.length} atom(s), {selectedBondIds.length} bond(s)
          </span>
        )}
        <span>Tool: {toolLabels[toolMode] ?? toolMode}</span>
      </div>
    </div>
  );
}
