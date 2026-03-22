import type { Atom, Bond, Vec3 } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';
import { getBondLength } from '../data/elements';

interface ForceLayoutOptions {
  iterations?: number;
  timestep?: number;
  repulsionStrength?: number;
  bondStrength?: number;
  damping?: number;
}

export function applyForceDirectedLayout(
  atoms: Atom[],
  bonds: Bond[],
  options: ForceLayoutOptions = {}
): Atom[] {
  const {
    iterations = 300,
    timestep = 0.005,
    repulsionStrength = 2.0,
    bondStrength = 50.0,
    damping = 0.95,
  } = options;

  if (atoms.length === 0) return atoms;

  const positions: Vec3[] = atoms.map(a => ({ ...a.position }));
  const velocities: Vec3[] = atoms.map(() => ({ x: 0, y: 0, z: 0 }));

  const atomIdToIndex = new Map<string, number>();
  atoms.forEach((a, i) => atomIdToIndex.set(a.id, i));

  for (let iter = 0; iter < iterations; iter++) {
    const forces: Vec3[] = atoms.map(() => ({ x: 0, y: 0, z: 0 }));
    const coolingFactor = 1 - iter / iterations;

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dz = positions[j].z - positions[i].z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq) || 0.01;

        const force = repulsionStrength / (distSq || 0.01);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        forces[i].x -= fx;
        forces[i].y -= fy;
        forces[i].z -= fz;
        forces[j].x += fx;
        forces[j].y += fy;
        forces[j].z += fz;
      }
    }

    for (const bond of bonds) {
      const i = atomIdToIndex.get(bond.atomId1);
      const j = atomIdToIndex.get(bond.atomId2);
      if (i === undefined || j === undefined) continue;

      const idealLength = getBondLength(atoms[i].element, atoms[j].element, bond.type)
        ?? getDefaultBondLength(bond.type);

      const dx = positions[j].x - positions[i].x;
      const dy = positions[j].y - positions[i].y;
      const dz = positions[j].z - positions[i].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

      const displacement = dist - idealLength;
      const force = bondStrength * displacement;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      forces[i].x += fx;
      forces[i].y += fy;
      forces[i].z += fz;
      forces[j].x -= fx;
      forces[j].y -= fy;
      forces[j].z -= fz;
    }

    applyAngleForces(atoms, bonds, positions, forces, atomIdToIndex);

    for (let i = 0; i < atoms.length; i++) {
      const ef = coolingFactor;
      velocities[i].x = (velocities[i].x + forces[i].x * timestep) * damping * ef;
      velocities[i].y = (velocities[i].y + forces[i].y * timestep) * damping * ef;
      velocities[i].z = (velocities[i].z + forces[i].z * timestep) * damping * ef;

      positions[i].x += velocities[i].x * timestep;
      positions[i].y += velocities[i].y * timestep;
      positions[i].z += velocities[i].z * timestep;
    }
  }

  return atoms.map((a, i) => ({
    ...a,
    position: { ...positions[i] },
  }));
}

function getDefaultBondLength(type: string): number {
  switch (type) {
    case 'double': return 1.34;
    case 'triple': return 1.20;
    case 'aromatic': return 1.40;
    default: return 1.54;
  }
}

function applyAngleForces(
  atoms: Atom[],
  bonds: Bond[],
  positions: Vec3[],
  forces: Vec3[],
  atomIdToIndex: Map<string, number>
) {
  const adjMap = new Map<number, number[]>();
  for (let i = 0; i < atoms.length; i++) {
    adjMap.set(i, []);
  }
  for (const bond of bonds) {
    const i = atomIdToIndex.get(bond.atomId1);
    const j = atomIdToIndex.get(bond.atomId2);
    if (i !== undefined && j !== undefined) {
      adjMap.get(i)!.push(j);
      adjMap.get(j)!.push(i);
    }
  }

  for (let center = 0; center < atoms.length; center++) {
    const neighbors = adjMap.get(center) || [];
    if (neighbors.length < 2) continue;

    const el = ELEMENTS[atoms[center].element];
    const maxBonds = el?.maxBonds ?? 4;
    let idealAngle: number;

    if (neighbors.length === 2) {
      idealAngle = maxBonds <= 2 ? 180 : maxBonds === 3 ? 120 : 109.47;
    } else if (neighbors.length === 3) {
      idealAngle = maxBonds <= 3 ? 120 : 109.47;
    } else {
      idealAngle = 109.47;
    }

    const idealRad = idealAngle * Math.PI / 180;
    const strength = 5.0;

    for (let a = 0; a < neighbors.length; a++) {
      for (let b = a + 1; b < neighbors.length; b++) {
        const ni = neighbors[a];
        const nj = neighbors[b];

        const v1 = {
          x: positions[ni].x - positions[center].x,
          y: positions[ni].y - positions[center].y,
          z: positions[ni].z - positions[center].z,
        };
        const v2 = {
          x: positions[nj].x - positions[center].x,
          y: positions[nj].y - positions[center].y,
          z: positions[nj].z - positions[center].z,
        };

        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) || 0.01;
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z) || 0.01;

        const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
        const currentAngle = Math.acos(cosAngle);

        const angleDiff = currentAngle - idealRad;
        const torque = strength * angleDiff;

        const cross = {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x,
        };
        const crossMag = Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z) || 0.01;

        const perpForce1 = {
          x: ((v2.x / mag2 - v1.x / mag1 * cosAngle) / mag1) * torque,
          y: ((v2.y / mag2 - v1.y / mag1 * cosAngle) / mag1) * torque,
          z: ((v2.z / mag2 - v1.z / mag1 * cosAngle) / mag1) * torque,
        };
        const perpForce2 = {
          x: ((v1.x / mag1 - v2.x / mag2 * cosAngle) / mag2) * torque,
          y: ((v1.y / mag1 - v2.y / mag2 * cosAngle) / mag2) * torque,
          z: ((v1.z / mag1 - v2.z / mag2 * cosAngle) / mag2) * torque,
        };

        if (crossMag > 0.001) {
          forces[ni].x -= perpForce1.x;
          forces[ni].y -= perpForce1.y;
          forces[ni].z -= perpForce1.z;
          forces[nj].x -= perpForce2.x;
          forces[nj].y -= perpForce2.y;
          forces[nj].z -= perpForce2.z;
        }
      }
    }
  }
}

export interface IsomerPosition {
  atomId: string;
  positions: Vec3[];
}

export function generateIsomerPositions(
  atoms: Atom[],
  bonds: Bond[]
): IsomerPosition[] {
  const isomers: IsomerPosition[] = [];

  const adjMap = new Map<string, { neighborId: string; bondType: string }[]>();
  for (const a of atoms) {
    adjMap.set(a.id, []);
  }
  for (const b of bonds) {
    adjMap.get(b.atomId1)?.push({ neighborId: b.atomId2, bondType: b.type });
    adjMap.get(b.atomId2)?.push({ neighborId: b.atomId1, bondType: b.type });
  }

  const atomById = new Map(atoms.map(a => [a.id, a]));

  for (const atom of atoms) {
    const neighbors = adjMap.get(atom.id) || [];
    if (neighbors.length !== 4) continue;

    const el = ELEMENTS[atom.element];
    if (!el || el.maxBonds < 4) continue;

    const allSingle = neighbors.every(n => n.bondType === 'single');
    if (!allSingle) continue;

    const neighborElements = neighbors.map(n => atomById.get(n.neighborId)?.element ?? '');
    const uniqueElements = new Set(neighborElements);
    if (uniqueElements.size < 3) continue;

    const altPositions: Vec3[] = [];
    for (let swap = 0; swap < neighbors.length; swap++) {
      for (let swapWith = swap + 1; swapWith < neighbors.length; swapWith++) {
        const n1 = atomById.get(neighbors[swap].neighborId);
        const n2 = atomById.get(neighbors[swapWith].neighborId);
        if (!n1 || !n2) continue;
        if (n1.element === n2.element) continue;

        altPositions.push({
          x: n2.position.x,
          y: n2.position.y,
          z: n2.position.z,
        });
        break;
      }
      if (altPositions.length > 0) break;
    }

    if (altPositions.length > 0) {
      const swapNeighborId = neighbors[0].neighborId;
      isomers.push({
        atomId: swapNeighborId,
        positions: altPositions,
      });
    }
  }

  return isomers;
}
