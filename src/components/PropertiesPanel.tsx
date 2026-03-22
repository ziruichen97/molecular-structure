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
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          Molecule Info
        </h3>
        <div className="bg-surface-container rounded-xl p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Formula</span>
            <span className="text-on-surface font-mono font-medium">{formula || '\u2014'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Weight</span>
            <span className="text-on-surface font-mono">
              {atoms.length > 0 ? `${molecularWeight.toFixed(3)} g/mol` : '\u2014'}
            </span>
          </div>
          <div className="h-px bg-outline-variant" />
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Atoms</span>
            <span className="text-on-surface">{atoms.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Bonds</span>
            <span className="text-on-surface">{bonds.length}</span>
          </div>
        </div>
      </div>

      {selectedAtom && (
        <div>
          <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Atom Properties
          </h3>
          <div className="bg-surface-container rounded-xl p-3 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Element</span>
              <span className="text-on-surface font-semibold">
                {selectedAtom.element} ({ELEMENTS[selectedAtom.element]?.name})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Position</span>
              <span className="text-on-surface font-mono text-xs">
                ({selectedAtom.position.x.toFixed(2)}, {selectedAtom.position.y.toFixed(2)}, {selectedAtom.position.z.toFixed(2)})
              </span>
            </div>
            <div className="h-px bg-outline-variant" />
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Chirality</span>
              <select
                value={selectedAtom.chirality}
                onChange={(e) => updateAtomChirality(selectedAtom.id, e.target.value as 'none' | 'R' | 'S')}
                className="bg-surface text-on-surface rounded-lg px-2 py-1 text-xs border border-outline-variant focus:border-primary focus:outline-none"
              >
                <option value="none">None</option>
                <option value="R">R</option>
                <option value="S">S</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Charge</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge - 1)}
                  className="w-6 h-6 rounded-lg bg-surface text-on-surface-variant text-xs hover:bg-surface-container-high flex items-center justify-center border border-outline-variant"
                >
                  &minus;
                </button>
                <span className="text-on-surface w-6 text-center font-mono">{selectedAtom.charge}</span>
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge + 1)}
                  className="w-6 h-6 rounded-lg bg-surface text-on-surface-variant text-xs hover:bg-surface-container-high flex items-center justify-center border border-outline-variant"
                >
                  +
                </button>
              </div>
            </div>
            {bondAngles.length > 0 && (
              <>
                <div className="h-px bg-outline-variant" />
                <div>
                  <span className="text-on-surface-variant text-xs font-medium">Bond Angles</span>
                  {bondAngles.map((angle, i) => (
                    <div key={i} className="flex justify-between mt-1 text-xs">
                      <span className="text-on-surface-variant">
                        {angle.atom1}-{selectedAtom.element}-{angle.atom2}
                      </span>
                      <span className="text-on-surface font-mono">{angle.angle.toFixed(1)}&deg;</span>
                    </div>
                  ))}
                </div>
              </>
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
            <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Bond Properties
            </h3>
            <div className="bg-surface-container rounded-xl p-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Connection</span>
                <span className="text-on-surface font-medium">{a1.element} \u2014 {a2.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Length</span>
                <span className="text-on-surface font-mono">{bondLength.toFixed(3)} \u00c5</span>
              </div>
              <div className="h-px bg-outline-variant" />
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Type</span>
                <select
                  value={selectedBond.type}
                  onChange={(e) => updateBondType(selectedBond.id, e.target.value as 'single' | 'double' | 'triple' | 'aromatic')}
                  className="bg-surface text-on-surface rounded-lg px-2 py-1 text-xs border border-outline-variant focus:border-primary focus:outline-none"
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
