import { useMemo } from 'react';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { ELEMENTS } from '../data/elements';
import { distance, angleBetween } from '../utils/geometry';

export function PropertiesPanel() {
  const {
    atoms,
    bonds,
    selectedAtomIds,
    selectedBondIds,
    getMolecularWeight,
    getMolecularFormula,
    updateAtomChirality,
    updateAtomCharge,
    updateBondType,
  } = useMoleculeStore();

  const selectedAtom = selectedAtomIds.length === 1
    ? atoms.find(a => a.id === selectedAtomIds[0])
    : null;

  const selectedBond = selectedBondIds.length === 1
    ? bonds.find(b => b.id === selectedBondIds[0])
    : null;

  const molecularWeight = getMolecularWeight();
  const formula = getMolecularFormula();

  const bondAngles = useMemo(() => {
    if (!selectedAtom) return [];
    const connectedBonds = bonds.filter(
      b => b.atomId1 === selectedAtom.id || b.atomId2 === selectedAtom.id
    );
    const neighborIds = connectedBonds.map(b =>
      b.atomId1 === selectedAtom.id ? b.atomId2 : b.atomId1
    );
    const neighbors = neighborIds
      .map(id => atoms.find(a => a.id === id))
      .filter(Boolean);

    const angles: { atom1: string; atom2: string; angle: number }[] = [];
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const n1 = neighbors[i]!;
        const n2 = neighbors[j]!;
        angles.push({
          atom1: n1.element,
          atom2: n2.element,
          angle: angleBetween(n1.position, selectedAtom.position, n2.position),
        });
      }
    }
    return angles;
  }, [selectedAtom, bonds, atoms]);

  return (
    <div className="p-3 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Molecule Info
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Formula:</span>
            <span className="text-gray-800 font-mono">{formula || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Weight:</span>
            <span className="text-gray-800 font-mono">
              {atoms.length > 0 ? `${molecularWeight.toFixed(3)} g/mol` : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Atoms:</span>
            <span className="text-gray-800">{atoms.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bonds:</span>
            <span className="text-gray-800">{bonds.length}</span>
          </div>
        </div>
      </div>

      {selectedAtom && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Atom Properties
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Element:</span>
              <span className="text-gray-800 font-bold">
                {selectedAtom.element} ({ELEMENTS[selectedAtom.element]?.name})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Position:</span>
              <span className="text-gray-800 font-mono text-xs">
                ({selectedAtom.position.x.toFixed(2)}, {selectedAtom.position.y.toFixed(2)}, {selectedAtom.position.z.toFixed(2)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Chirality:</span>
              <select
                value={selectedAtom.chirality}
                onChange={(e) => updateAtomChirality(selectedAtom.id, e.target.value as 'none' | 'R' | 'S')}
                className="bg-gray-50 text-gray-800 rounded px-2 py-0.5 text-xs border border-gray-200"
              >
                <option value="none">None</option>
                <option value="R">R</option>
                <option value="S">S</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Charge:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge - 1)}
                  className="w-5 h-5 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-gray-800 w-6 text-center">{selectedAtom.charge}</span>
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge + 1)}
                  className="w-5 h-5 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            {bondAngles.length > 0 && (
              <div>
                <span className="text-gray-500 text-xs">Bond Angles:</span>
                {bondAngles.map((angle, i) => (
                  <div key={i} className="flex justify-between ml-2 text-xs">
                    <span className="text-gray-400">
                      {angle.atom1}-{selectedAtom.element}-{angle.atom2}
                    </span>
                    <span className="text-gray-700 font-mono">{angle.angle.toFixed(1)}°</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedBond && (() => {
        const a1 = atoms.find(a => a.id === selectedBond.atomId1);
        const a2 = atoms.find(a => a.id === selectedBond.atomId2);
        if (!a1 || !a2) return null;
        const bondLength = distance(a1.position, a2.position);
        return (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Bond Properties
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Connection:</span>
                <span className="text-gray-800">{a1.element} — {a2.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Length:</span>
                <span className="text-gray-800 font-mono">{bondLength.toFixed(3)} Å</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Type:</span>
                <select
                  value={selectedBond.type}
                  onChange={(e) => updateBondType(selectedBond.id, e.target.value as 'single' | 'double' | 'triple' | 'aromatic')}
                  className="bg-gray-50 text-gray-800 rounded px-2 py-0.5 text-xs border border-gray-200"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="aromatic">Aromatic</option>
                </select>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
