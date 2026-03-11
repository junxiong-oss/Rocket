import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, useScroll } from '@react-three/drei';
import * as THREE from 'three';

interface RocketPartProps {
  position: [number, number, number];
  onHover: (part: string | null) => void;
  activePart: string | null;
  partId: string;
  separation?: number;
}

const RocketPart: React.FC<RocketPartProps & { children: React.ReactNode }> = ({ 
  position, 
  onHover, 
  activePart, 
  partId, 
  separation = 0,
  children 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const isActive = activePart === partId;

  useFrame((state) => {
    if (meshRef.current) {
      // Smoothly animate separation
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1] + separation,
        0.1
      );

      // Highlight effect
      if (isActive) {
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1.05, 0.1));
      } else {
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1));
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[position[0], position[1], position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(partId);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onHover(null);
      }}
    >
      {children}
    </group>
  );
};

const RocketModel = ({ activePart, onHoverPart, scrollProgress }: { 
  activePart: string | null, 
  onHoverPart: (part: string | null) => void,
  scrollProgress: number 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  
  // Separation logic based on scroll
  // We want separation to happen as we scroll down
  const separationFactor = scrollProgress * 5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
    if (engineLightRef.current) {
      engineLightRef.current.intensity = 5 + Math.sin(state.clock.elapsedTime * 10) * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nose Cone */}
      <RocketPart 
        partId="structure" 
        position={[0, 4.5, 0]} 
        onHover={onHoverPart} 
        activePart={activePart}
        separation={separationFactor * 1.5}
      >
        <mesh castShadow>
          <coneGeometry args={[1, 2, 32]} />
          <meshStandardMaterial 
            color={activePart === 'structure' ? '#60A5FA' : '#F8FAFC'} 
            roughness={0.2} 
            metalness={0.9} 
            emissive={activePart === 'structure' ? '#3B82F6' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </RocketPart>

      {/* Payload Section */}
      <RocketPart 
        partId="payload" 
        position={[0, 2.5, 0]} 
        onHover={onHoverPart} 
        activePart={activePart}
        separation={separationFactor * 1.0}
      >
        <mesh castShadow>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color={activePart === 'payload' ? '#60A5FA' : '#E2E8F0'} 
            roughness={0.2} 
            metalness={0.7}
            emissive={activePart === 'payload' ? '#3B82F6' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Window */}
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1} />
        </mesh>
      </RocketPart>

      {/* Electronics Section */}
      <RocketPart 
        partId="electronics" 
        position={[0, 0.5, 0]} 
        onHover={onHoverPart} 
        activePart={activePart}
        separation={separationFactor * 0.5}
      >
        <mesh castShadow>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color={activePart === 'electronics' ? '#60A5FA' : '#CBD5E1'} 
            roughness={0.4} 
            metalness={0.4}
            emissive={activePart === 'electronics' ? '#3B82F6' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Circuit details */}
        <mesh position={[0, 0, 0.95]}>
          <boxGeometry args={[0.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </RocketPart>

      {/* Main Body / Propulsion */}
      <RocketPart 
        partId="propulsion" 
        position={[0, -1.5, 0]} 
        onHover={onHoverPart} 
        activePart={activePart}
      >
        <mesh castShadow>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color={activePart === 'propulsion' ? '#60A5FA' : '#94A3B8'} 
            roughness={0.3} 
            metalness={0.8}
            emissive={activePart === 'propulsion' ? '#3B82F6' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Fins */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[1.2, -0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#EF4444" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Engine Nozzle */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.5, 32]} />
          <meshStandardMaterial color="#334155" metalness={1} roughness={0.2} />
        </mesh>

        {/* Engine Glow */}
        <pointLight ref={engineLightRef} position={[0, -2, 0]} color="#F97316" intensity={5} distance={5} />
        <mesh position={[0, -2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 1.5, 32]} />
          <meshStandardMaterial 
            color="#F97316" 
            emissive="#F97316" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      </RocketPart>
    </group>
  );
};

export const Rocket3D: React.FC<{ 
  activePart: string | null, 
  onHoverPart: (part: string | null) => void,
  scrollProgress: number 
}> = ({ activePart, onHoverPart, scrollProgress }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <RocketModel 
            activePart={activePart} 
            onHoverPart={onHoverPart} 
            scrollProgress={scrollProgress} 
          />
        </Float>

        <Environment preset="city" />
        <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
};
