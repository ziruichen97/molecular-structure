import { useRef, useState, useCallback, useMemo, memo } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { ELEMENTS } from '../data/elements';
import type { Atom } from '../types/chemistry';

interface AtomSphereProps {
  atom: Atom;
}

const sphereGeometryCache = new Map<number, THREE.SphereGeometry>();

function getSharedSphereGeometry(radius: number): THREE.SphereGeometry {
  const key = Math.round(radius * 1000);
  let geo = sphereGeometryCache.get(key);
  if (!geo) {
    geo = new THREE.SphereGeometry(radius, 20, 20);
    sphereGeometryCache.set(key, geo);
  }
  return geo;
}

export const AtomSphere = memo(function AtomSphere({ atom }: AtomSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef(new THREE.Plane());
  const dragOffset = useRef(new THREE.Vector3());

  const toolMode = useMoleculeStore(s => s.toolMode);
  const selectedAtomIds = useMoleculeStore(s => s.selectedAtomIds);
  const hoveredAtomId = useMoleculeStore(s => s.hoveredAtomId);
  const showLabels = useMoleculeStore(s => s.showLabels);
  const selectAtom = useMoleculeStore(s => s.selectAtom);
  const removeAtom = useMoleculeStore(s => s.removeAtom);
  const moveAtom = useMoleculeStore(s => s.moveAtom);
  const setHoveredAtomId = useMoleculeStore(s => s.setHoveredAtomId);
  const addBond = useMoleculeStore(s => s.addBond);
  const selectedBondType = useMoleculeStore(s => s.selectedBondType);

  const element = ELEMENTS[atom.element];
  const isSelected = selectedAtomIds.includes(atom.id);
  const isHovered = hoveredAtomId === atom.id;
  const radius = (element?.radius ?? 0.3) * 0.6;
  const color = element?.color ?? '#808080';

  const emissiveColor = isSelected
    ? '#4488ff'
    : isHovered
      ? '#66aaff'
      : '#000000';
  const emissiveIntensity = isSelected ? 0.4 : isHovered ? 0.2 : 0;

  const geometry = useMemo(() => getSharedSphereGeometry(radius), [radius]);

  useFrame(() => {
    if (!meshRef.current) return;
    if (isSelected) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.05);
    } else if (meshRef.current.scale.x !== 1) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (toolMode === 'delete') {
      removeAtom(atom.id);
      return;
    }

    if (toolMode === 'select') {
      selectAtom(atom.id, e.nativeEvent.shiftKey);
      return;
    }

    if (toolMode === 'addBond') {
      const selected = useMoleculeStore.getState().selectedAtomIds;
      if (selected.length === 1 && selected[0] !== atom.id) {
        addBond(selected[0], atom.id, selectedBondType);
        useMoleculeStore.setState({ selectedAtomIds: [] });
      } else {
        selectAtom(atom.id);
      }
      return;
    }

    if (toolMode === 'move') {
      setIsDragging(true);
      const camera = e.camera;
      const normal = new THREE.Vector3();
      camera.getWorldDirection(normal);
      const atomPos = new THREE.Vector3(atom.position.x, atom.position.y, atom.position.z);
      dragPlane.current.setFromNormalAndCoplanarPoint(normal, atomPos);

      const intersection = new THREE.Vector3();
      e.ray.intersectPlane(dragPlane.current, intersection);
      dragOffset.current.copy(atomPos).sub(intersection);

      (e.target as HTMLElement)?.setPointerCapture?.(e.nativeEvent.pointerId);
    }
  }, [toolMode, atom.id, atom.position, selectAtom, removeAtom, addBond, selectedBondType]);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || toolMode !== 'move') return;
    e.stopPropagation();

    const intersection = new THREE.Vector3();
    e.ray.intersectPlane(dragPlane.current, intersection);
    intersection.add(dragOffset.current);

    moveAtom(atom.id, { x: intersection.x, y: intersection.y, z: intersection.z });
  }, [isDragging, toolMode, atom.id, moveAtom]);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement)?.releasePointerCapture?.(e.nativeEvent.pointerId);
    }
  }, [isDragging]);

  const handlePointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredAtomId(atom.id);
  }, [atom.id, setHoveredAtomId]);

  const handlePointerLeave = useCallback(() => {
    setHoveredAtomId(null);
  }, [setHoveredAtomId]);

  const materialProps = useMemo(() => ({
    color,
    emissive: emissiveColor,
    emissiveIntensity,
    metalness: 0.1,
    roughness: 0.3,
  }), [color, emissiveColor, emissiveIntensity]);

  return (
    <group position={[atom.position.x, atom.position.y, atom.position.z]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {atom.chirality !== 'none' && (
        <Html
          position={[0, radius + 0.15, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <span className="text-xs font-bold text-purple-600 bg-white/90 px-1 rounded shadow-sm">
            ({atom.chirality})
          </span>
        </Html>
      )}
      {showLabels && (
        <Html
          position={[0, -radius - 0.15, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <span
            className="text-xs font-bold px-1 rounded select-none"
            style={{
              color: color === '#FFFFFF' || color === '#FFFF30' ? '#333' : '#fff',
              backgroundColor: `${color}cc`,
            }}
          >
            {atom.element}
            {atom.charge !== 0 && (
              <sup>{atom.charge > 0 ? `+${atom.charge}` : atom.charge}</sup>
            )}
          </span>
        </Html>
      )}
    </group>
  );
});
