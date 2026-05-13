import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Environment } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = [
  '#2dd4bf', // Teal
  '#10b981', // Emerald
  '#60a5fa', // Blue
  '#818cf8', // Indigo
  '#f8fafc'  // White
];
const LIGHT_MODE_ADJUST = { '#f8fafc': '#94a3b8' };
const DARK_MODE_ADJUST = { '#f8fafc': '#ffffff' };

function generateRandomMolecule(numAtoms: number = 20) {
  const atoms: { pos: THREE.Vector3, color: string, size: number }[] = [];
  const bonds: [number, number][] = [];
  const bondCounts: number[] = [];
  const MAX_BONDS = 4;

  atoms.push({
    pos: new THREE.Vector3(0, 0, 0),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 0.6 + Math.random() * 0.4
  });
  bondCounts.push(0);

  let attempts = 0;
  for (let i = 1; i < numAtoms && attempts < 500; i++) {
    const availableParents = atoms.map((_, idx) => idx).filter(idx => bondCounts[idx] < MAX_BONDS);
    if (availableParents.length === 0) break;

    const parentIdx = availableParents[Math.floor(Math.random() * availableParents.length)];
    const parentPos = atoms[parentIdx].pos;

    const newSize = 0.3 + Math.random() * 0.4;
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const MIN_PADDING = 0.8;
    const minBondLength = atoms[parentIdx].size + newSize + MIN_PADDING;
    const distance = minBondLength + Math.random() * 0.6;

    const offset = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ).multiplyScalar(distance);

    const newPos = parentPos.clone().add(offset);

    if (newPos.length() > 6) {
      i--;
      attempts++;
      continue;
    }

    let isTooClose = false;
    for (let j = 0; j < atoms.length; j++) {
      const requiredDist = atoms[j].size + newSize + (MIN_PADDING * 0.8);
      if (atoms[j].pos.distanceTo(newPos) < requiredDist) {
        isTooClose = true;
        break;
      }
    }

    if (isTooClose) {
      i--;
      attempts++;
      continue;
    }

    attempts = 0;
    atoms.push({ pos: newPos, color: newColor, size: newSize });
    bondCounts.push(0);
    bonds.push([parentIdx, i]);
    bondCounts[parentIdx]++;
    bondCounts[i]++;
  }

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      if (bondCounts[i] < MAX_BONDS && bondCounts[j] < MAX_BONDS) {
        if (Math.random() > 0.8 && atoms[i].pos.distanceTo(atoms[j].pos) < 2.5) {
          const exists = bonds.some(b => (b[0] === i && b[1] === j) || (b[0] === j && b[1] === i));
          if (!exists) {
            bonds.push([i, j]);
            bondCounts[i]++;
            bondCounts[j]++;
          }
        }
      }
    }
  }

  const center = new THREE.Vector3();
  atoms.forEach(a => center.add(a.pos));
  center.divideScalar(atoms.length);
  atoms.forEach(a => a.pos.sub(center));

  return { atoms, bonds };
}

interface MoleculeProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  isDarkMode: boolean;
  atomCount?: number;
}

const MoleculeGroup = ({ isDarkMode, position, scale, rotationSpeed, atomCount = 12 }: MoleculeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const molecule = useMemo(() => generateRandomMolecule(atomCount), [atomCount]);
  const { atoms, bonds } = molecule;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x = 0.5 + Math.cos(t * 0.2) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.2;
    }
  });

  const bondMeshes = useMemo(() => {
    return bonds.map((bond, i) => {
      const start = atoms[bond[0]].pos;
      const end = atoms[bond[1]].pos;
      const distance = start.distanceTo(end);
      const pos = start.clone().lerp(end, 0.5);
      const direction = end.clone().sub(start).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      return { key: i, distance, position: pos, quaternion };
    });
  }, [atoms, bonds]);

  return (
    <group ref={groupRef} position={new THREE.Vector3(...position)} scale={scale}>
      {atoms.map((atom, i) => {
        let color = atom.color;
        if (!isDarkMode && color in LIGHT_MODE_ADJUST) color = LIGHT_MODE_ADJUST[color as keyof typeof LIGHT_MODE_ADJUST];
        if (isDarkMode && color in DARK_MODE_ADJUST) color = DARK_MODE_ADJUST[color as keyof typeof DARK_MODE_ADJUST];

        return (
          <Sphere key={`atom-${i}`} args={[atom.size, 32, 32]} position={atom.pos}>
            <meshPhysicalMaterial
              color={color}
              roughness={isDarkMode ? 0.05 : 0.2}
              metalness={isDarkMode ? 0.5 : 0.1}
              emissive={isDarkMode ? color : '#000000'}
              emissiveIntensity={isDarkMode ? 0.2 : 0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={isDarkMode ? 2 : 1}
            />
          </Sphere>
        );
      })}
      {bondMeshes.map((b) => (
        <Cylinder
          key={`bond-${b.key}`}
          args={[0.07, 0.07, b.distance, 16]}
          position={b.position}
          quaternion={b.quaternion}
        >
          <meshPhysicalMaterial
            color={isDarkMode ? '#f8fafc' : '#cbd5e1'}
            emissive={isDarkMode ? '#ffffff' : '#000000'}
            emissiveIntensity={isDarkMode ? 0.1 : 0}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={isDarkMode ? 0.6 : 0.8}
          />
        </Cylinder>
      ))}
    </group>
  );
};

export default function Molecule3D({ isDarkMode, onLoaded }: { isDarkMode: boolean, onLoaded?: () => void }) {
  const [aspect, setAspect] = React.useState(typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1);

  React.useLayoutEffect(() => {
    const handleResize = () => setAspect(window.innerWidth / window.innerHeight);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Manually trigger a resize event to kick the Canvas component
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const cameraZ = aspect < 1 ? 14 : 10;
  const fov = aspect < 1 ? 65 : 55;

  const sceneMolecules: Omit<MoleculeProps, 'isDarkMode'>[] = useMemo(() => [
    { position: [0, 0, 0], scale: 1.5, rotationSpeed: 0.0006, atomCount: 16 },
    { position: [-6, 3, 3], scale: 0.9, rotationSpeed: 0.0003, atomCount: 10 },
    { position: [7, -2, 4], scale: 1.0, rotationSpeed: 0.0004, atomCount: 12 },
    { position: [-9, -5, -4], scale: 0.7, rotationSpeed: 0.0002, atomCount: 8 },
    { position: [9, 5, -5], scale: 0.8, rotationSpeed: 0.0003, atomCount: 9 },
    { position: [2, -7, 1], scale: 0.6, rotationSpeed: 0.0005, atomCount: 7 },
  ], []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400/20 dark:from-emerald-600/10 to-transparent rounded-full blur-3xl opacity-60 transition-colors duration-500"></div>

      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [0, 0, cameraZ], fov }}
        dpr={typeof window !== 'undefined' ? [1, Math.min(window.devicePixelRatio, 2)] : [1, 2]}
        resize={{ scroll: false }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance" 
        }}
        onCreated={() => onLoaded && onLoaded()}
      >
        <ambientLight intensity={isDarkMode ? 0.3 : 1.5} />
        <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={isDarkMode ? 5 : 2} />
        <pointLight position={[-10, -10, -10]} intensity={isDarkMode ? 3 : 1} color="#10b981" />
        <pointLight position={[5, 5, 10]} intensity={isDarkMode ? 2 : 0} color="#ffffff" />
        <Environment preset="studio" />
        {sceneMolecules.map((m, i) => (
          <MoleculeGroup key={i} {...m} isDarkMode={isDarkMode} />
        ))}
      </Canvas>
    </div>
  );
}
