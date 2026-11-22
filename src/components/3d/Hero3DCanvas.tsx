import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SceneFallback } from './SceneFallback';

// Interactive Central Core Mesh
const CentralCore: React.FC<{ mouse: React.MutableRefObject<[number, number]> }> = ({ mouse }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
      // Mouse response parallax
      meshRef.current.rotation.x += (mouse.current[1] * 0.5 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (mouse.current[0] * 0.5 - meshRef.current.rotation.y) * 0.05;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.15;
      wireframeRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group position={[1.8, 0, 0]}>
      {/* Inner glowing metallic torus knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.35, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#0f0c29"
          roughness={0.15}
          metalness={0.9}
          emissive="#7928ca"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Outer cyber wireframe cage */}
      <mesh ref={wireframeRef} scale={1.22}>
        <torusKnotGeometry args={[1.2, 0.35, 48, 16, 2, 3]} />
        <meshBasicMaterial
          color="#00f2fe"
          wireframe={true}
          transparent={true}
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

// Floating Geometric Orbiters
const FloatingGeometries: React.FC = () => {
  const octRef = useRef<THREE.Mesh>(null!);
  const icoRef = useRef<THREE.Mesh>(null!);
  const dodRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (octRef.current) {
      octRef.current.rotation.x += delta * 0.4;
      octRef.current.rotation.y += delta * 0.5;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y += delta * 0.3;
      icoRef.current.rotation.z += delta * 0.4;
    }
    if (dodRef.current) {
      dodRef.current.rotation.x += delta * 0.2;
      dodRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <>
      {/* Octahedron top right */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={octRef} position={[3.6, 2.2, -1]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>

      {/* Icosahedron bottom right */}
      <Float speed={3} rotationIntensity={2} floatIntensity={2.5}>
        <mesh ref={icoRef} position={[3.2, -2.4, 0]}>
          <icosahedronGeometry args={[0.85, 0]} />
          <meshStandardMaterial
            color="#06b6d4"
            roughness={0.2}
            metalness={0.8}
            emissive="#06b6d4"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Dodecahedron background left */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={dodRef} position={[-3.5, 2, -3]}>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#ec4899"
            wireframe
            emissive="#ec4899"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </>
  );
};

// Cyber Floor Mesh with perspective depth
const CyberFloor: React.FC = () => {
  const gridRef = useRef<THREE.GridHelper>(null!);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z = (gridRef.current.position.z + delta * 0.8) % 2;
    }
  });

  return (
    <group position={[0, -3.5, 0]} rotation={[0, 0, 0]}>
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#8b5cf6', '#1e1b4b']}
        position={[0, 0, 0]}
      />
    </group>
  );
};

// Scene composition with lights and camera
const Scene: React.FC<{ mouse: React.MutableRefObject<[number, number]> }> = ({ mouse }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={50} />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} color="#a855f7" intensity={3.5} distance={15} />
      <pointLight position={[-5, -5, 3]} color="#06b6d4" intensity={3} distance={15} />
      <pointLight position={[0, 4, 2]} color="#3b82f6" intensity={2} distance={10} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* Sparkles / cyber dust particles */}
      <Sparkles
        count={80}
        scale={10}
        size={3}
        speed={0.4}
        opacity={0.6}
        color="#a855f7"
      />
      <Sparkles
        count={60}
        scale={12}
        size={2.5}
        speed={0.6}
        opacity={0.5}
        color="#00f2fe"
      />

      <CentralCore mouse={mouse} />
      <FloatingGeometries />
      <CyberFloor />
    </>
  );
};

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<[number, number]>([0, 0]);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }

    // Monitor document visibility (tab switching) to halt render loop when inactive
    const handleVisibility = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Monitor IntersectionObserver to halt Three.js render loop when scrolled out of view
    const container = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (container && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    return () => {
      mediaQuery.removeEventListener('change', handler);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    mouse.current = [
      (clientX / innerWidth) * 2 - 1,
      -(clientY / innerHeight) * 2 + 1,
    ];
  };

  if (!hasWebGL || prefersReducedMotion) {
    return <SceneFallback />;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <SceneFallback />
      <Canvas
        className="w-full h-full"
        frameloop={isVisible && isTabActive ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
};

