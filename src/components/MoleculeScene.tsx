import { useCallback, useRef } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { AtomSphere } from './AtomSphere';
import { BondStick } from './BondStick';

function GhostAtom({ position }: { position: [number, number, number] }) {
  return (
    <Sphere args={[0.18, 16, 16]} position={position}>
      <meshStandardMaterial
        color="#999999"
        transparent
        opacity={0.35}
        metalness={0.1}
        roughness={0.5}
      />
    </Sphere>
  );
}

function DashedBond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  return (
    <Line
      points={[start, end]}
      color="#999999"
      lineWidth={1.5}
      dashed
      dashSize={0.1}
      gapSize={0.08}
      transparent
      opacity={0.5}
    />
  );
}

function SceneContent() {
  const {
    atoms,
    bonds,
    toolMode,
    selectedElement,
    showAxes,
    isomerPositions,
    addAtom,
    clearSelection,
  } = useMoleculeStore();

  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const handleCanvasClick = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (toolMode === 'addAtom') {
      const intersection = new THREE.Vector3();
      e.ray.intersectPlane(planeRef.current, intersection);
      const snapped = {
        x: Math.round(intersection.x * 4) / 4,
        y: 0,
        z: Math.round(intersection.z * 4) / 4,
      };
      addAtom(selectedElement, snapped);
    } else if (toolMode === 'select') {
      clearSelection();
    }
  }, [toolMode, selectedElement, addAtom, clearSelection]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerDown={handleCanvasClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#d0d0d0"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#b0b0b0"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {atoms.map(atom => (
        <AtomSphere key={atom.id} atom={atom} />
      ))}

      {bonds.map(bond => (
        <BondStick key={bond.id} bond={bond} />
      ))}

      {isomerPositions.map((isomer, iIdx) => {
        const sourceAtom = atoms.find(a => a.id === isomer.atomId);
        if (!sourceAtom) return null;
        return isomer.positions.map((pos, pIdx) => (
          <group key={`isomer-${iIdx}-${pIdx}`}>
            <GhostAtom position={[pos.x, pos.y, pos.z]} />
            <DashedBond
              start={[sourceAtom.position.x, sourceAtom.position.y, sourceAtom.position.z]}
              end={[pos.x, pos.y, pos.z]}
            />
          </group>
        ));
      })}

      {showAxes && (
        <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      )}

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        mouseButtons={{
          LEFT: toolMode === 'addAtom' || toolMode === 'addBond' ? undefined : THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        minDistance={2}
        maxDistance={50}
      />
    </>
  );
}

export function MoleculeScene() {
  return (
    <div className="flex-1 h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#f8f9fa' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
