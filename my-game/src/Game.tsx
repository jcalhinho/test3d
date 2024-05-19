import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
interface PlatformData {
    id: number;
    position: [number, number, number];
    size: [number, number, number];
    isMobile: boolean;
  }
  interface FlyingSquirrelProps {
    moveX: number;
    moveZ: number;
    platforms: React.RefObject<THREE.Mesh>[];
  }
  
  const Ground: React.FC = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="violet" />
      </mesh>
    );
  };
  
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
        <meshStandardMaterial color={isMobile ? 'orange' : 'green'} />
      </mesh>
    );
  });
  
  type WallsProps = {
    height: number;
  };
  
  const Walls: React.FC<WallsProps> = ({ height }) => {
    const wallThickness = 1;
    const wallLength = 100;
    const poleHeight = height;
  
    return (
      <>
        {/* Left Wall */}
        <mesh position={[-wallLength / 2, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, wallLength]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[wallLength / 2, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, wallLength]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
        {/* Front Wall */}
        <mesh position={[0, height / 2, -wallLength / 2]}>
          <boxGeometry args={[wallLength, height, wallThickness]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
        {/* Back Wall */}
        <mesh position={[0, height / 2, wallLength / 2]}>
          <boxGeometry args={[wallLength, height, wallThickness]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
        {/* Poles at the corners */}
        {/* Front Left */}
        <mesh position={[-wallLength / 2, poleHeight / 2, -wallLength / 2]}>
          <cylinderGeometry args={[wallThickness / 2, wallThickness / 2, poleHeight, 32]} />
          <meshStandardMaterial color="grey" />
        </mesh>
        {/* Front Right */}
        <mesh position={[wallLength / 2, poleHeight / 2, -wallLength / 2]}>
          <cylinderGeometry args={[wallThickness / 2, wallThickness / 2, poleHeight, 32]} />
          <meshStandardMaterial color="grey" />
        </mesh>
        {/* Back Left */}
        <mesh position={[-wallLength / 2, poleHeight / 2, wallLength / 2]}>
          <cylinderGeometry args={[wallThickness / 2, wallThickness / 2, poleHeight, 32]} />
          <meshStandardMaterial color="grey" />
        </mesh>
        {/* Back Right */}
        <mesh position={[wallLength / 2, poleHeight / 2, wallLength / 2]}>
          <cylinderGeometry args={[wallThickness / 2, wallThickness / 2, poleHeight, 32]} />
          <meshStandardMaterial color="grey" />
        </mesh>
      </>
    );
  };
  
  const generatePlatforms = (numPlatforms: number, minHeight: number, maxHeight: number, mobileRatio = 0.3): PlatformData[] => {
    const platforms: PlatformData[] = [];
    for (let i = 0; i < numPlatforms; i++) {
      const size: [number, number, number] = [Math.random() * 5 + 1, 0.5, Math.random() * 5 + 1];
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 100,
        Math.random() * (maxHeight - minHeight) + minHeight,
        (Math.random() - 0.5) * 100
      ];
      const isMobile = Math.random() < mobileRatio;
      platforms.push({ id: i, position, size, isMobile });
    }
    return platforms;
  };
  
  const FlyingSquirrel: React.FC<FlyingSquirrelProps> = ({ moveX, moveZ, platforms }) => {
    const squirrelRef = useRef<THREE.Mesh>(null);
    const [isJumping, setIsJumping] = useState(false);
    const [jumpVelocity, setJumpVelocity] = useState(0);
    const GRAVITY = 0.0012;
    const JUMP_FORCE = 0.3;
    const REBOUND_DAMPING = 0.5;
    const BOUNDARY = 50;
  
    useFrame((state) => {
      if (squirrelRef.current) {
        // Handle jumping and falling
        squirrelRef.current.position.y += jumpVelocity;
        setJumpVelocity(jumpVelocity - GRAVITY); // Slower gravity effect for gliding
  
        if (squirrelRef.current.position.y <= 0.2) {
          squirrelRef.current.position.y = 0.2;
          if (jumpVelocity < 0) {
            setJumpVelocity(-jumpVelocity * REBOUND_DAMPING); // Reverse velocity for rebound with damping
          } else {
            setJumpVelocity(0);
          }
        }
  
        // Handle horizontal movement
        squirrelRef.current.position.x += moveX;
        squirrelRef.current.position.z += moveZ;
  
        // Update camera position to follow the squirrel
        const cameraDistance = 25; // Distance of the camera from the squirrel
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
  
        // Check collision with walls and rebound
        if (squirrelRef.current.position.x > BOUNDARY) {
          squirrelRef.current.position.x = BOUNDARY;
          moveX = -moveX; // Reverse direction on x-axis
        } else if (squirrelRef.current.position.x < -BOUNDARY) {
          squirrelRef.current.position.x = -BOUNDARY;
          moveX = -moveX; // Reverse direction on x-axis
        }
        if (squirrelRef.current.position.z > BOUNDARY) {
          squirrelRef.current.position.z = BOUNDARY;
          moveZ = -moveZ; // Reverse direction on z-axis
        } else if (squirrelRef.current.position.z < -BOUNDARY) {
          squirrelRef.current.position.z = -BOUNDARY;
          moveZ = -moveZ; // Reverse direction on z-axis
        }
  
        // Check collision with platforms and rebound
        const squirrelBox = new THREE.Box3().setFromObject(squirrelRef.current);
        platforms.forEach((platform) => {
          if (platform.current) {
            const platformBox = new THREE.Box3().setFromObject(platform.current);
            if (squirrelBox.intersectsBox(platformBox)) {
              // Simple collision handling: rebound the squirrel
              setJumpVelocity(JUMP_FORCE);
              setIsJumping(true);
            }
          }
        });
      }
    });
  
    useEffect(() => {
      const handleSpace = (event: KeyboardEvent) => {
        if (event.key === ' ') {
          setIsJumping(true);
          setJumpVelocity(JUMP_FORCE);
        }
      };
  
      window.addEventListener('keydown', handleSpace);
      return () => {
        window.removeEventListener('keydown', handleSpace);
      };
    }, [isJumping]);
  
    return (
      <mesh ref={squirrelRef} position={[0, 1900, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  };
  
  const Scene: React.FC = () => {
    const [moveX, setMoveX] = useState(0);
    const [moveZ, setMoveZ] = useState(0);
    const MOVE_SPEED = 0.2;
  
    const platforms = useMemo(() => generatePlatforms(1000, 0, 1800), []);
    const platformRefs = useMemo(() => platforms.map(() => React.createRef<THREE.Mesh>()), [platforms]);
  
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'z':
          setMoveZ(-MOVE_SPEED);
          break;
        case 'ArrowDown':
        case 's':
          setMoveZ(MOVE_SPEED);
          break;
        case 'ArrowLeft':
        case 'q':
          setMoveX(-MOVE_SPEED);
          break;
        case 'ArrowRight':
        case 'd':
          setMoveX(MOVE_SPEED);
          break;
        default:
          break;
      }
    };
  
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'z':
        case 'ArrowDown':
        case 's':
          setMoveZ(0);
          break;
        case 'ArrowLeft':
        case 'q':
        case 'ArrowRight':
        case 'd':
          setMoveX(0);
          break;
        default:
          break;
      }
    };
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
  
    return (
      <Canvas
        shadows
        camera={{ position: [0, 1850, 0], fov: 50, near: 0.1, far: 2000, up: [0, 0, -1] }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[-10, 40, 1]}
          intensity={5}
          castShadow
        />
        <Ground />
        <Walls height={1800} />
        {platforms.map((platform, index) => (
          <Platform
            key={platform.id}
            position={platform.position}
            size={platform.size}
            isMobile={platform.isMobile}
            ref={platformRefs[index]}
          />
        ))}
        <FlyingSquirrel moveX={moveX} moveZ={moveZ} platforms={platformRefs} />
        <OrbitControls />
      </Canvas>
    );
  };
  
  export default Scene;