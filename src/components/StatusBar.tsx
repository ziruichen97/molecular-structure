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
    delete: 'Erase',
  };

  return (
    <div className="bg-surface border-t border-outline-variant px-6 py-2 flex items-center justify-between text-xs text-on-surface-variant">
      <div className="flex items-center gap-2.5">
        <span>{atoms.length} atoms</span>
        <span className="opacity-40">&middot;</span>
        <span>{bonds.length} bonds</span>
        {formula && (
          <>
            <span className="opacity-40">&middot;</span>
            <span className="font-mono text-on-surface">{formula}</span>
          </>
        )}
        {weight > 0 && (
          <>
            <span className="opacity-40">&middot;</span>
            <span className="font-mono">{weight.toFixed(2)} g/mol</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {(selectedAtomIds.length > 0 || selectedBondIds.length > 0) && (
          <>
            <span>
              {selectedAtomIds.length} atom{selectedAtomIds.length !== 1 ? 's' : ''}, {selectedBondIds.length} bond{selectedBondIds.length !== 1 ? 's' : ''} selected
            </span>
            <span className="opacity-40">&middot;</span>
          </>
        )}
        <span className="bg-surface-container px-2.5 py-1 rounded-md font-medium text-on-surface">
          {toolLabels[toolMode] ?? toolMode}
        </span>
      </div>
    </div>
  );
}
