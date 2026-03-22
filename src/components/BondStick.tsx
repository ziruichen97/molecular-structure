import { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useMoleculeStore } from '../store/useMoleculeStore';
import type { Bond, Atom } from '../types/chemistry';
import { distance } from '../utils/geometry';

interface BondStickProps {
  bond: Bond;
}

const BOND_RADIUS = 0.06;
const BOND_GAP = 0.15;

function SingleBond({ start, end, color, onPointerDown, onPointerEnter, onPointerLeave }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerEnter?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerLeave?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { position: mid, quaternion: quat, length: len };
  }, [start, end]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      quaternion={quaternion}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <cylinderGeometry args={[BOND_RADIUS, BOND_RADIUS, length, 8]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
    </mesh>
  );
}

export function BondStick({ bond }: BondStickProps) {
  const {
    atoms,
    selectedBondIds,
    hoveredBondId,
    toolMode,
    showBondInfo,
    selectBond,
    removeBond,
    setHoveredBondId,
    updateBondType,
  } = useMoleculeStore();

  const atom1 = atoms.find((a: Atom) => a.id === bond.atomId1);
  const atom2 = atoms.find((a: Atom) => a.id === bond.atomId2);

  const isSelected = selectedBondIds.includes(bond.id);
  const isHovered = hoveredBondId === bond.id;

  const bondColor = isSelected ? '#4488ff' : isHovered ? '#66aaff' : '#aaaaaa';

  if (!atom1 || !atom2) return null;

  const start = new THREE.Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
  const end = new THREE.Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
  const bondLength = distance(atom1.position, atom2.position);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (toolMode === 'delete') {
      removeBond(bond.id);
      return;
    }
    if (toolMode === 'select') {
      selectBond(bond.id, e.nativeEvent.shiftKey);
      if (e.nativeEvent.detail === 2) {
        const types = ['single', 'double', 'triple', 'aromatic'] as const;
        const currentIndex = types.indexOf(bond.type);
        const nextType = types[(currentIndex + 1) % types.length];
        updateBondType(bond.id, nextType);
      }
    }
  };

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredBondId(bond.id);
  };
  const handlePointerLeave = () => setHoveredBondId(null);

  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const perpendicular = new THREE.Vector3();
  if (Math.abs(dir.y) < 0.9) {
    perpendicular.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  } else {
    perpendicular.crossVectors(dir, new THREE.Vector3(1, 0, 0)).normalize();
  }

  const renderBonds = () => {
    switch (bond.type) {
      case 'double': {
        const offset = perpendicular.clone().multiplyScalar(BOND_GAP / 2);
        const s1 = start.clone().add(offset);
        const e1 = end.clone().add(offset);
        const s2 = start.clone().sub(offset);
        const e2 = end.clone().sub(offset);
        return (
          <>
            <SingleBond start={s1} end={e1} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
            <SingleBond start={s2} end={e2} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
          </>
        );
      }
      case 'triple': {
        const offset = perpendicular.clone().multiplyScalar(BOND_GAP);
        const s1 = start.clone().add(offset);
        const e1 = end.clone().add(offset);
        const s2 = start.clone().sub(offset);
        const e2 = end.clone().sub(offset);
        return (
          <>
            <SingleBond start={start} end={end} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
            <SingleBond start={s1} end={e1} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
            <SingleBond start={s2} end={e2} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
          </>
        );
      }
      case 'aromatic': {
        const offset = perpendicular.clone().multiplyScalar(BOND_GAP / 2);
        const s1 = start.clone().add(offset);
        const e1 = end.clone().add(offset);
        const s2 = start.clone().sub(offset);
        const e2 = end.clone().sub(offset);
        return (
          <>
            <SingleBond start={s1} end={e1} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
            <group>
              <mesh
                position={new THREE.Vector3().addVectors(s2, e2).multiplyScalar(0.5)}
                quaternion={new THREE.Quaternion().setFromUnitVectors(
                  new THREE.Vector3(0, 1, 0),
                  new THREE.Vector3().subVectors(e2, s2).normalize()
                )}
              >
                <cylinderGeometry args={[BOND_RADIUS * 0.7, BOND_RADIUS * 0.7, s2.distanceTo(e2), 8]} />
                <meshStandardMaterial color={bondColor} transparent opacity={0.5} metalness={0.2} roughness={0.4} />
              </mesh>
            </group>
          </>
        );
      }
      default:
        return (
          <SingleBond start={start} end={end} color={bondColor} onPointerDown={handlePointerDown} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
        );
    }
  };

  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  return (
    <group>
      {renderBonds()}
      {showBondInfo && (
        <Html position={[mid.x, mid.y + 0.2, mid.z]} center style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] bg-white/90 text-gray-700 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap select-none">
            {bond.type} · {bondLength.toFixed(2)}Å
          </div>
        </Html>
      )}
    </group>
  );
}
