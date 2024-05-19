import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
const SpeedLines = () => {
    const linesRef = useRef<THREE.Group>(null);
  
    useFrame(() => {
      if (linesRef.current) {
        linesRef.current.children.forEach((line) => {
          line.position.y += 0.03; // Speed of the lines
          if (line.position.y > 400) {
            line.position.y = 0; // Reset position when it goes out of view
          }
        });
      }
    });
  
    // Create an array of lines
    const lines = Array.from({ length: 100 }).map((_, i) => (
      <mesh key={i} position={[Math.random() * 50 - 25, Math.random() * 400, Math.random() * 50 - 25]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="grey" />
      </mesh>
    ));
  
    return <group ref={linesRef}>{lines}</group>;
  };
const Ground = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="green" />
      </mesh>
    );
  };


  const FlyingSquirrel = () => {
    const squirrelRef = useRef<THREE.Mesh>(null);
    const [time, setTime] = useState(0);
    const [hasLanded, setHasLanded] = useState(false);
  
    useFrame((state) => {
      if (squirrelRef.current && !hasLanded) {
        // Update time
        setTime(time + 0.05);
  
        // Prevent rotation
        squirrelRef.current.rotation.set(0, 0, 0);
  
        // Apply random movement
        const randomX = (Math.random() - 0.5) * 0.02; // Random movement in X
        const randomZ = (Math.random() - 0.5) * 0.02; // Random movement in Z
  
        // Constant descent with slight random Y movement
        const descentSpeed = 0.21; // Descent speed
        const randomY = (Math.random() - 0.5) * 0.01; // Random movement in Y
  
        squirrelRef.current.position.x += randomX;
        squirrelRef.current.position.y -= descentSpeed + randomY; // Descent
        squirrelRef.current.position.z += randomZ;
  
        // Apply sinusoidal movement for smoother effect
        const amplitude = 0.05;
        const frequency = 0.8;
        squirrelRef.current.position.x += amplitude * Math.sin(time * frequency);
        squirrelRef.current.position.z += amplitude * Math.cos(time * frequency);
  
        // Check if it touches the ground
        if (squirrelRef.current.position.y <= 0.2) {
          squirrelRef.current.position.y = 0.2;
          setHasLanded(true); // Stop movement
        }
  
        // Handle squash and stretch
        const velocityY = -descentSpeed + randomY;
        if (velocityY < 0) {
          squirrelRef.current.scale.set(1 + Math.abs(velocityY) * 2, 1 - Math.abs(velocityY) * 2, 1 + Math.abs(velocityY) * 2);
        } else {
          squirrelRef.current.scale.set(1, 1, 1);
        }
  
        // Fixed aerial camera follow on Z axis
        state.camera.position.set(0, squirrelRef.current.position.y + 20, squirrelRef.current.position.z);
        state.camera.lookAt(0, squirrelRef.current.position.y, squirrelRef.current.position.z);
      }
    });
  
    return (
      <mesh ref={squirrelRef} position={[0, 398, 0]} castShadow> {/* Starting higher */}
        <boxGeometry args={[0.4, 0.3, 0.6]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    );
  };
  const Scene = () => {
    return (
      <Canvas
        shadows
        camera={{ position: [0, 420, 0], fov: 50, near: 0.1, far: 1000 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[15,15, 15]} castShadow />
        <Ground />
        <FlyingSquirrel />
        <SpeedLines />
        <OrbitControls />
      </Canvas>
    );
  };
  export default Scene;
  
  
  
