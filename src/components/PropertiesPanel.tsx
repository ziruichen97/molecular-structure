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
          分子信息
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">分子式:</span>
            <span className="text-gray-200 font-mono">{formula || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">分子量:</span>
            <span className="text-gray-200 font-mono">
              {atoms.length > 0 ? `${molecularWeight.toFixed(3)} g/mol` : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">原子数:</span>
            <span className="text-gray-200">{atoms.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">化学键数:</span>
            <span className="text-gray-200">{bonds.length}</span>
          </div>
        </div>
      </div>

      {selectedAtom && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            原子属性
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">元素:</span>
              <span className="text-gray-200 font-bold">
                {selectedAtom.element} ({ELEMENTS[selectedAtom.element]?.nameCN})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">位置:</span>
              <span className="text-gray-200 font-mono text-xs">
                ({selectedAtom.position.x.toFixed(2)}, {selectedAtom.position.y.toFixed(2)}, {selectedAtom.position.z.toFixed(2)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">手性:</span>
              <select
                value={selectedAtom.chirality}
                onChange={(e) => updateAtomChirality(selectedAtom.id, e.target.value as 'none' | 'R' | 'S')}
                className="bg-gray-700 text-gray-200 rounded px-2 py-0.5 text-xs border border-gray-600"
              >
                <option value="none">无</option>
                <option value="R">R</option>
                <option value="S">S</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">电荷:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge - 1)}
                  className="w-5 h-5 rounded bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-gray-200 w-6 text-center">{selectedAtom.charge}</span>
                <button
                  onClick={() => updateAtomCharge(selectedAtom.id, selectedAtom.charge + 1)}
                  className="w-5 h-5 rounded bg-gray-700 text-gray-300 text-xs hover:bg-gray-600 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            {bondAngles.length > 0 && (
              <div>
                <span className="text-gray-400 text-xs">键角:</span>
                {bondAngles.map((angle, i) => (
                  <div key={i} className="flex justify-between ml-2 text-xs">
                    <span className="text-gray-500">
                      {angle.atom1}-{selectedAtom.element}-{angle.atom2}
                    </span>
                    <span className="text-gray-300 font-mono">{angle.angle.toFixed(1)}°</span>
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
              化学键属性
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">连接:</span>
                <span className="text-gray-200">{a1.element} — {a2.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">键长:</span>
                <span className="text-gray-200 font-mono">{bondLength.toFixed(3)} Å</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">键型:</span>
                <select
                  value={selectedBond.type}
                  onChange={(e) => updateBondType(selectedBond.id, e.target.value as 'single' | 'double' | 'triple' | 'aromatic')}
                  className="bg-gray-700 text-gray-200 rounded px-2 py-0.5 text-xs border border-gray-600"
                >
                  <option value="single">单键</option>
                  <option value="double">双键</option>
                  <option value="triple">三键</option>
                  <option value="aromatic">芳香键</option>
                </select>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
