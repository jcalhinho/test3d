import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

interface FlyingSquirrelProps {
  moveX: number;
  moveZ: number;
  platforms: React.RefObject<THREE.Mesh>[];
  isPaused: boolean;
}

const FlyingSquirrel: React.FC<FlyingSquirrelProps> = ({ moveX, moveZ, platforms, isPaused }) => {
  const squirrelRef = useRef<THREE.Mesh>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  const GRAVITY = new THREE.Vector3(0, -0.0002, 0);
  const JUMP_FORCE = 0.3;
  const REBOUND_DAMPING = 0.5;
  const BOUNDARY = 50;
  const AIR_RESISTANCE = 0.99;

  const { positionY } = useSpring({
    positionY: isPaused ? 2000 : squirrelRef.current?.position.y ?? 2000,
    config: { mass: 1, tension: 120, friction: 14 },
    loop: { reverse: true }
  });

  useFrame((state, delta) => {
    if (!isPaused && squirrelRef.current) {
      const newVelocity = velocity.clone().add(GRAVITY.clone().multiplyScalar(delta * 1000));

      newVelocity.x *= AIR_RESISTANCE;
      newVelocity.z *= AIR_RESISTANCE;
      setVelocity(newVelocity);

      squirrelRef.current.position.add(newVelocity.clone().multiplyScalar(delta * 1000));

      if (squirrelRef.current.position.y <= 0.2) {
        squirrelRef.current.position.y = 0.2;
        if (newVelocity.y < 0) {
          newVelocity.y = -newVelocity.y * REBOUND_DAMPING;
          setVelocity(newVelocity);
        } else {
          newVelocity.y = 0;
        }
      }

      squirrelRef.current.position.x += moveX * delta * 1000;
      squirrelRef.current.position.z += moveZ * delta * 1000;

      const cameraDistance = 25;
      state.camera.position.set(
        squirrelRef.current.position.x,
        squirrelRef.current.position.y + cameraDistance,
        squirrelRef.current.position.z
      );
      state.camera.lookAt(
        squirrelRef.current.position.x,
        squirrelRef.current.position.y,
        squirrelRef.current.position.z
      );

      if (squirrelRef.current.position.x > BOUNDARY) {
        squirrelRef.current.position.x = BOUNDARY;
        newVelocity.x = -newVelocity.x * REBOUND_DAMPING;
        setVelocity(newVelocity);
      } else if (squirrelRef.current.position.x < -BOUNDARY) {
        squirrelRef.current.position.x = -BOUNDARY;
        newVelocity.x = -newVelocity.x * REBOUND_DAMPING;
        setVelocity(newVelocity);
      }
      if (squirrelRef.current.position.z > BOUNDARY) {
        squirrelRef.current.position.z = BOUNDARY;
        newVelocity.z = -newVelocity.z * REBOUND_DAMPING;
        setVelocity(newVelocity);
      } else if (squirrelRef.current.position.z < -BOUNDARY) {
        squirrelRef.current.position.z = -BOUNDARY;
        newVelocity.z = -newVelocity.z * REBOUND_DAMPING;
        setVelocity(newVelocity);
      }

      const squirrelBox = new THREE.Box3().setFromObject(squirrelRef.current);
      platforms.forEach((platform) => {
        if (platform.current) {
          const platformBox = new THREE.Box3().setFromObject(platform.current);
          if (squirrelBox.intersectsBox(platformBox)) {
            newVelocity.y = JUMP_FORCE;
            setVelocity(newVelocity);
            setIsJumping(true);
          }
        }
      });

      // Animation de déformation du carré pour imiter un parachute
      const time = state.clock.getElapsedTime();
      const geometry = squirrelRef.current.geometry;
      const position = geometry.attributes.position;
      const waveAmplitude = 0.1;
      const waveFrequency = 2;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const offset = Math.sin(time * waveFrequency + distanceFromCenter * 3) * waveAmplitude;
        position.setZ(i, offset);
      }
      position.needsUpdate = true;

      // Assurez-vous que le plan reste horizontal
      squirrelRef.current.rotation.set(-Math.PI / 2, 0, 0);
    }
  });

  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setIsJumping(true);
        const newVelocity = velocity.clone();
        newVelocity.y = JUMP_FORCE;
        setVelocity(newVelocity);
      }
    };

    window.addEventListener('keydown', handleSpace);
    return () => {
      window.removeEventListener('keydown', handleSpace);
    };
  }, [isJumping, velocity]);

  return (
    <a.mesh ref={squirrelRef} position-y={positionY} castShadow>
      <planeGeometry args={[2, 2, 10, 10]} />
      <meshStandardMaterial color="violet" side={THREE.DoubleSide} />
    </a.mesh>
  );
};

export default FlyingSquirrel;
