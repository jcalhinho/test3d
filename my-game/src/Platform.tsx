import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type PlatformProps = {
  position: [number, number, number];
  size: [number, number, number];
  isMobile: boolean;
};

const Platform = React.forwardRef<THREE.Mesh, PlatformProps>(({ position, size, isMobile }, ref) => {
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const SPEED = 0.05; // Speed of movement

  useFrame(() => {
    if (isMobile && ref && (ref as React.MutableRefObject<THREE.Mesh>).current) {
      const mesh = (ref as React.MutableRefObject<THREE.Mesh>).current;
      mesh.position.x += SPEED * direction;
      if (mesh.position.x > 50 || mesh.position.x < -50) {
        setDirection(-direction); // Reverse direction
      }
    }
  });

  return (
    <mesh ref={ref} position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={'yellow'} />
    </mesh>
  );
});

export default Platform;
