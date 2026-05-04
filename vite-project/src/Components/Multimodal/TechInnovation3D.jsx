import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const Laptop = ({ position, scale = 1, color = "#374151" }) => {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Pulse screen emissive intensity
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh && child.material.emissive) {
          child.material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3;
        }
      });
    }
  });

  return (
    <group position={position} scale={scale} ref={group}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[2.8, 0.12, 1.9]} />
        <meshPhongMaterial color={color} shininess={120} />
      </mesh>
      
      {/* Keyboard area */}
      <mesh position={[0, 0.07, -0.05]}>
        <boxGeometry args={[2.4, 0.02, 1.5]} />
        <meshPhongMaterial color="#1f2937" shininess={60} />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.06, -0.95]} rotation={[-1.15, 0, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshPhongMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.9, 0.04]}>
          <boxGeometry args={[2.5, 1.55, 0.05]} />
          <meshPhongMaterial 
            color="#1e40af" 
            emissive="#3b82f6" 
            emissiveIntensity={0.6} 
            shininess={200} 
          />
        </mesh>
        {/* Screen lines */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, 1.35 - i * 0.25, 0.08]}>
            <boxGeometry args={[1.6 - i * 0.1, 0.04, 0.06]} />
            <meshBasicMaterial color="#93c5fd" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Monitor = ({ position, scale = 1 }) => {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh && child.material.emissive) {
          child.material.emissiveIntensity = 0.4 + Math.sin(t * 1.5 + 1) * 0.25;
        }
      });
    }
  });

  return (
    <group position={position} scale={scale} ref={group}>
      <mesh>
        <boxGeometry args={[3.2, 2.1, 0.15]} />
        <meshPhongMaterial color="#374151" shininess={100} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.9, 1.8, 0.1]} />
        <meshPhongMaterial 
          color="#0f172a" 
          emissive="#6366f1" 
          emissiveIntensity={0.5} 
          shininess={200} 
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, -1.4, 0]}>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshPhongMaterial color="#374151" />
      </mesh>
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[1.1, 0.1, 0.6]} />
        <meshPhongMaterial color="#374151" />
      </mesh>
    </group>
  );
};

const Chip = ({ position, scale = 1 }) => {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.traverse((child) => {
        if (child.isMesh && child.material.emissive) {
          child.material.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.4;
        }
      });
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} scale={scale} ref={group}>
        <mesh>
          <boxGeometry args={[1.4, 0.18, 1.4]} />
          <meshPhongMaterial color="#1e293b" shininess={200} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.7, 0.22, 0.7]} />
          <meshPhongMaterial 
            color="#6366f1" 
            emissive="#4338ca" 
            emissiveIntensity={0.8} 
            shininess={300} 
          />
        </mesh>
        {/* Pins could be added here if needed for detail */}
      </group>
    </Float>
  );
};

const Scene = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const { mouse } = state;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.4, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#7c6ef7" />
      <directionalLight position={[-6, -3, 4]} intensity={1.5} color="#38bdf8" />
      <pointLight position={[0, 3, 3]} intensity={3} color="#a78bfa" />
      
      <Monitor position={[0, 0, -2]} scale={1.2} />
      <Laptop position={[-4, -1, 0]} scale={1} />
      <Laptop position={[4, -1.5, 1]} scale={0.8} />
      <Chip position={[-1.5, -2, 2]} scale={1.2} />
      <Chip position={[2, -2.5, 1.5]} scale={0.9} />
      
      {/* Decorative Floating Elements */}
      {[...Array(20)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={2} floatIntensity={2}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5 - 2
            ]}
          >
            {i % 3 === 0 ? <octahedronGeometry args={[0.15]} /> : i % 3 === 1 ? <boxGeometry args={[0.2, 0.2, 0.2]} /> : <tetrahedronGeometry args={[0.15]} />}
            <meshPhongMaterial 
              color={["#818cf8", "#38bdf8", "#34d399", "#fbbf24"][i % 4]} 
              transparent 
              opacity={0.6} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const TechInnovation3D = () => {
  return (
    <div className="w-full h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas shadows alpha>
        <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={50} />
        <Scene />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default TechInnovation3D;
