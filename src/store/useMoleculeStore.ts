import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Atom, Bond, BondType, ToolMode, HistoryEntry, MoleculeTemplate, Vec3 } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';

interface MoleculeState {
  atoms: Atom[];
  bonds: Bond[];

  toolMode: ToolMode;
  selectedElement: string;
  selectedBondType: BondType;
  selectedAtomIds: string[];
  selectedBondIds: string[];
  hoveredAtomId: string | null;
  hoveredBondId: string | null;

  history: HistoryEntry[];
  historyIndex: number;

  showLabels: boolean;
  showBondInfo: boolean;
  showAxes: boolean;

  moleculeName: string;

  setToolMode: (mode: ToolMode) => void;
  setSelectedElement: (element: string) => void;
  setSelectedBondType: (type: BondType) => void;
  setHoveredAtomId: (id: string | null) => void;
  setHoveredBondId: (id: string | null) => void;
  setShowLabels: (show: boolean) => void;
  setShowBondInfo: (show: boolean) => void;
  setShowAxes: (show: boolean) => void;
  setMoleculeName: (name: string) => void;

  addAtom: (element: string, position: Vec3) => string;
  removeAtom: (id: string) => void;
  moveAtom: (id: string, position: Vec3) => void;
  updateAtomChirality: (id: string, chirality: Atom['chirality']) => void;
  updateAtomCharge: (id: string, charge: number) => void;

  addBond: (atomId1: string, atomId2: string, type?: BondType) => string | null;
  removeBond: (id: string) => void;
  updateBondType: (id: string, type: BondType) => void;

  selectAtom: (id: string, multi?: boolean) => void;
  selectBond: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  deleteSelected: () => void;

  loadTemplate: (template: MoleculeTemplate) => void;
  clearAll: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: (description: string) => void;

  exportMOL: () => string;
  exportJSON: () => string;
  importJSON: (json: string) => void;

  getMolecularWeight: () => number;
  getMolecularFormula: () => string;
  getBondCount: (atomId: string) => number;
}

const MAX_HISTORY = 50;

function cloneState(atoms: Atom[], bonds: Bond[]): { atoms: Atom[]; bonds: Bond[] } {
  return {
    atoms: atoms.map(a => ({ ...a, position: { ...a.position } })),
    bonds: bonds.map(b => ({ ...b })),
  };
}

export const useMoleculeStore = create<MoleculeState>((set, get) => ({
  atoms: [],
  bonds: [],
  toolMode: 'addAtom',
  selectedElement: 'C',
  selectedBondType: 'single',
  selectedAtomIds: [],
  selectedBondIds: [],
  hoveredAtomId: null,
  hoveredBondId: null,
  history: [],
  historyIndex: -1,
  showLabels: true,
  showBondInfo: false,
  showAxes: true,
  moleculeName: 'Untitled Molecule',

  setToolMode: (mode) => set({ toolMode: mode, selectedAtomIds: [], selectedBondIds: [] }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setSelectedBondType: (type) => set({ selectedBondType: type }),
  setHoveredAtomId: (id) => set({ hoveredAtomId: id }),
  setHoveredBondId: (id) => set({ hoveredBondId: id }),
  setShowLabels: (show) => set({ showLabels: show }),
  setShowBondInfo: (show) => set({ showBondInfo: show }),
  setShowAxes: (show) => set({ showAxes: show }),
  setMoleculeName: (name) => set({ moleculeName: name }),

  addAtom: (element, position) => {
    const id = uuidv4();
    const atom: Atom = {
      id,
      element,
      position: { ...position },
      chirality: 'none',
      charge: 0,
    };
    set((state) => ({ atoms: [...state.atoms, atom] }));
    get().pushHistory(`Add ${element} atom`);
    return id;
  },

  removeAtom: (id) => {
    set((state) => ({
      atoms: state.atoms.filter(a => a.id !== id),
      bonds: state.bonds.filter(b => b.atomId1 !== id && b.atomId2 !== id),
      selectedAtomIds: state.selectedAtomIds.filter(i => i !== id),
    }));
    get().pushHistory('Remove atom');
  },

  moveAtom: (id, position) => {
    set((state) => ({
      atoms: state.atoms.map(a =>
        a.id === id ? { ...a, position: { ...position } } : a
      ),
    }));
  },

  updateAtomChirality: (id, chirality) => {
    set((state) => ({
      atoms: state.atoms.map(a =>
        a.id === id ? { ...a, chirality } : a
      ),
    }));
    get().pushHistory('Update chirality');
  },

  updateAtomCharge: (id, charge) => {
    set((state) => ({
      atoms: state.atoms.map(a =>
        a.id === id ? { ...a, charge } : a
      ),
    }));
    get().pushHistory('Update charge');
  },

  addBond: (atomId1, atomId2, type) => {
    const state = get();
    if (atomId1 === atomId2) return null;

    const existingBond = state.bonds.find(
      b => (b.atomId1 === atomId1 && b.atomId2 === atomId2) ||
           (b.atomId1 === atomId2 && b.atomId2 === atomId1)
    );
    if (existingBond) return null;

    const id = uuidv4();
    const bond: Bond = {
      id,
      atomId1,
      atomId2,
      type: type || state.selectedBondType,
      cisTransConfig: 'none',
    };
    set((s) => ({ bonds: [...s.bonds, bond] }));
    get().pushHistory(`Add ${bond.type} bond`);
    return id;
  },

  removeBond: (id) => {
    set((state) => ({
      bonds: state.bonds.filter(b => b.id !== id),
      selectedBondIds: state.selectedBondIds.filter(i => i !== id),
    }));
    get().pushHistory('Remove bond');
  },

  updateBondType: (id, type) => {
    set((state) => ({
      bonds: state.bonds.map(b =>
        b.id === id ? { ...b, type } : b
      ),
    }));
    get().pushHistory('Update bond type');
  },

  selectAtom: (id, multi = false) => {
    set((state) => {
      if (multi) {
        const isSelected = state.selectedAtomIds.includes(id);
        return {
          selectedAtomIds: isSelected
            ? state.selectedAtomIds.filter(i => i !== id)
            : [...state.selectedAtomIds, id],
        };
      }
      return { selectedAtomIds: [id], selectedBondIds: [] };
    });
  },

  selectBond: (id, multi = false) => {
    set((state) => {
      if (multi) {
        const isSelected = state.selectedBondIds.includes(id);
        return {
          selectedBondIds: isSelected
            ? state.selectedBondIds.filter(i => i !== id)
            : [...state.selectedBondIds, id],
        };
      }
      return { selectedBondIds: [id], selectedAtomIds: [] };
    });
  },

  clearSelection: () => set({ selectedAtomIds: [], selectedBondIds: [] }),

  deleteSelected: () => {
    const state = get();
    const atomsToDelete = new Set(state.selectedAtomIds);
    set((s) => ({
      atoms: s.atoms.filter(a => !atomsToDelete.has(a.id)),
      bonds: s.bonds.filter(b =>
        !s.selectedBondIds.includes(b.id) &&
        !atomsToDelete.has(b.atomId1) &&
        !atomsToDelete.has(b.atomId2)
      ),
      selectedAtomIds: [],
      selectedBondIds: [],
    }));
    get().pushHistory('Delete selected');
  },

  loadTemplate: (template) => {
    const state = get();
    const atomIds: string[] = [];

    let offsetX = 0;
    if (state.atoms.length > 0) {
      let maxX = -Infinity;
      let minTemplateX = Infinity;
      for (const a of state.atoms) {
        if (a.position.x > maxX) maxX = a.position.x;
      }
      for (const a of template.atoms) {
        if (a.position.x < minTemplateX) minTemplateX = a.position.x;
      }
      offsetX = maxX - minTemplateX + 3;
    }

    const newAtoms: Atom[] = template.atoms.map((a) => {
      const id = uuidv4();
      atomIds.push(id);
      return {
        ...a,
        id,
        position: { x: a.position.x + offsetX, y: a.position.y, z: a.position.z },
      };
    });
    const newBonds: Bond[] = template.bonds.map((b) => ({
      id: uuidv4(),
      atomId1: atomIds[b.atomIndex1],
      atomId2: atomIds[b.atomIndex2],
      type: b.type,
      cisTransConfig: b.cisTransConfig,
    }));
    set((s) => ({
      atoms: [...s.atoms, ...newAtoms],
      bonds: [...s.bonds, ...newBonds],
      selectedAtomIds: [],
      selectedBondIds: [],
    }));
    get().pushHistory(`Load template: ${template.name}`);
  },

  clearAll: () => {
    set({ atoms: [], bonds: [], selectedAtomIds: [], selectedBondIds: [] });
    get().pushHistory('Clear all');
  },

  pushHistory: (description) => {
    set((state) => {
      const { atoms, bonds } = cloneState(state.atoms, state.bonds);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ atoms, bonds, description });
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const entry = state.history[newIndex];
      return {
        ...cloneState(entry.atoms, entry.bonds),
        historyIndex: newIndex,
        selectedAtomIds: [],
        selectedBondIds: [],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const entry = state.history[newIndex];
      return {
        ...cloneState(entry.atoms, entry.bonds),
        historyIndex: newIndex,
        selectedAtomIds: [],
        selectedBondIds: [],
      };
    });
  },

  exportMOL: () => {
    const { atoms, bonds, moleculeName } = get();
    const lines: string[] = [];
    lines.push(moleculeName);
    lines.push('  MolBuilder   3D');
    lines.push('');
    const atomCount = atoms.length.toString().padStart(3);
    const bondCount = bonds.length.toString().padStart(3);
    lines.push(`${atomCount}${bondCount}  0  0  0  0  0  0  0  0999 V2000`);

    const atomIndexMap = new Map<string, number>();
    atoms.forEach((atom, i) => {
      atomIndexMap.set(atom.id, i + 1);
      const x = atom.position.x.toFixed(4).padStart(10);
      const y = atom.position.y.toFixed(4).padStart(10);
      const z = atom.position.z.toFixed(4).padStart(10);
      const sym = atom.element.padEnd(3);
      lines.push(`${x}${y}${z} ${sym} 0  0  0  0  0  0  0  0  0  0  0  0`);
    });

    bonds.forEach((bond) => {
      const a1 = (atomIndexMap.get(bond.atomId1) ?? 0).toString().padStart(3);
      const a2 = (atomIndexMap.get(bond.atomId2) ?? 0).toString().padStart(3);
      const typeMap: Record<string, number> = { single: 1, double: 2, triple: 3, aromatic: 4 };
      const bt = (typeMap[bond.type] ?? 1).toString().padStart(3);
      lines.push(`${a1}${a2}${bt}  0  0  0  0`);
    });

    lines.push('M  END');
    return lines.join('\n');
  },

  exportJSON: () => {
    const { atoms, bonds, moleculeName } = get();
    return JSON.stringify({ name: moleculeName, atoms, bonds }, null, 2);
  },

  importJSON: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.atoms && data.bonds) {
        set({
          atoms: data.atoms,
          bonds: data.bonds,
          moleculeName: data.name || 'Imported Molecule',
          selectedAtomIds: [],
          selectedBondIds: [],
        });
        get().pushHistory('Import molecule');
      }
    } catch {
      console.error('Failed to import JSON');
    }
  },

  getMolecularWeight: () => {
    return get().atoms.reduce((sum, atom) => {
      const el = ELEMENTS[atom.element];
      return sum + (el?.atomicMass ?? 0);
    }, 0);
  },

  getMolecularFormula: () => {
    const counts: Record<string, number> = {};
    get().atoms.forEach(atom => {
      counts[atom.element] = (counts[atom.element] || 0) + 1;
    });
    const order = ['C', 'H'];
    const sorted = Object.keys(counts).sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
    return sorted.map(el => {
      const count = counts[el];
      return count === 1 ? el : `${el}${count}`;
    }).join('');
  },

  getBondCount: (atomId) => {
    return get().bonds.reduce((count, bond) => {
      if (bond.atomId1 !== atomId && bond.atomId2 !== atomId) return count;
      const multiplier = bond.type === 'double' ? 2 : bond.type === 'triple' ? 3 : 1;
      return count + multiplier;
    }, 0);
  },
}));
