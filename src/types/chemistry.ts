export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type BondType = 'single' | 'double' | 'triple' | 'aromatic';

export type ChiralityType = 'none' | 'R' | 'S';

export type CisTransType = 'none' | 'cis' | 'trans';

export interface ElementData {
  symbol: string;
  name: string;
  nameCN: string;
  atomicNumber: number;
  atomicMass: number;
  color: string;
  radius: number; // van der Waals radius in Angstroms (scaled for display)
  covalentRadius: number;
  maxBonds: number;
  electronegativity: number;
  category: string;
}

export interface Atom {
  id: string;
  element: string;
  position: Vec3;
  chirality: ChiralityType;
  charge: number;
  label?: string;
}

export interface Bond {
  id: string;
  atomId1: string;
  atomId2: string;
  type: BondType;
  cisTransConfig: CisTransType;
}

export interface Molecule {
  id: string;
  name: string;
  atoms: Atom[];
  bonds: Bond[];
  createdAt: number;
  updatedAt: number;
}

export type ToolMode =
  | 'select'
  | 'addAtom'
  | 'addBond'
  | 'delete'
  | 'move';

export interface HistoryEntry {
  atoms: Atom[];
  bonds: Bond[];
  description: string;
}

export interface TemplateBond {
  atomIndex1: number;
  atomIndex2: number;
  type: BondType;
  cisTransConfig: CisTransType;
}

export interface MoleculeTemplate {
  name: string;
  nameCN: string;
  formula: string;
  description: string;
  atoms: Omit<Atom, 'id'>[];
  bonds: TemplateBond[];
}
