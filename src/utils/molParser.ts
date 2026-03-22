import type { Atom, Bond, BondType } from '../types/chemistry';
import { v4 as uuidv4 } from 'uuid';

interface ParsedMolecule {
  name: string;
  atoms: Atom[];
  bonds: Bond[];
}

export function parseMOLV2000(content: string): ParsedMolecule | null {
  try {
    const lines = content.split('\n');
    if (lines.length < 4) return null;

    const name = lines[0].trim() || 'Imported Molecule';

    const countsLine = lines[3].trim();
    const atomCount = parseInt(countsLine.substring(0, 3).trim());
    const bondCount = parseInt(countsLine.substring(3, 6).trim());

    if (isNaN(atomCount) || isNaN(bondCount)) return null;

    const atoms: Atom[] = [];
    const atomIds: string[] = [];

    for (let i = 0; i < atomCount; i++) {
      const line = lines[4 + i];
      if (!line) return null;

      const x = parseFloat(line.substring(0, 10).trim());
      const y = parseFloat(line.substring(10, 20).trim());
      const z = parseFloat(line.substring(20, 30).trim());
      const symbol = line.substring(31, 34).trim();

      const id = uuidv4();
      atomIds.push(id);
      atoms.push({
        id,
        element: symbol,
        position: { x, y, z },
        chirality: 'none',
        charge: 0,
      });
    }

    const bonds: Bond[] = [];
    for (let i = 0; i < bondCount; i++) {
      const line = lines[4 + atomCount + i];
      if (!line) break;

      const a1 = parseInt(line.substring(0, 3).trim()) - 1;
      const a2 = parseInt(line.substring(3, 6).trim()) - 1;
      const bt = parseInt(line.substring(6, 9).trim());

      if (a1 < 0 || a2 < 0 || a1 >= atomCount || a2 >= atomCount) continue;

      const typeMap: Record<number, BondType> = {
        1: 'single',
        2: 'double',
        3: 'triple',
        4: 'aromatic',
      };

      bonds.push({
        id: uuidv4(),
        atomId1: atomIds[a1],
        atomId2: atomIds[a2],
        type: typeMap[bt] ?? 'single',
        cisTransConfig: 'none',
      });
    }

    return { name, atoms, bonds };
  } catch {
    return null;
  }
}

export function is2DStructure(atoms: Atom[]): boolean {
  if (atoms.length === 0) return false;
  return atoms.every(a => Math.abs(a.position.z) < 0.01);
}

export function convert2Dto3D(atoms: Atom[], bonds: Bond[]): Atom[] {
  if (atoms.length === 0) return atoms;

  const adjMap = new Map<string, { neighborId: string; bondType: BondType }[]>();
  for (const a of atoms) {
    adjMap.set(a.id, []);
  }
  for (const b of bonds) {
    adjMap.get(b.atomId1)?.push({ neighborId: b.atomId2, bondType: b.type });
    adjMap.get(b.atomId2)?.push({ neighborId: b.atomId1, bondType: b.type });
  }

  const result = atoms.map(a => ({
    ...a,
    position: { ...a.position },
  }));

  const atomById = new Map(result.map(a => [a.id, a]));

  for (const atom of result) {
    const neighbors = adjMap.get(atom.id) || [];
    const degree = neighbors.length;

    if (degree <= 2) {
      continue;
    }

    if (degree === 3) {
      const allSingleOrAromatic = neighbors.every(
        n => n.bondType === 'single'
      );
      if (allSingleOrAromatic) {
        const n2 = atomById.get(neighbors[2].neighborId);
        if (n2) {
          n2.position.z += 0.6;
        }
      }
    }

    if (degree === 4) {
      const n2 = atomById.get(neighbors[2].neighborId);
      const n3 = atomById.get(neighbors[3].neighborId);
      if (n2) n2.position.z += 0.9;
      if (n3) n3.position.z -= 0.9;
    }
  }

  return result;
}
