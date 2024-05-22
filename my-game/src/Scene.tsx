import React, { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Ground from './Ground';
import Platform from './Platform';
import Walls from './Walls';
import FlyingSquirrel from './FlyingSquirrel';
import generatePlatforms from './utils/generatePlatforms';
import * as THREE from 'three';
import './index.css'; // Assurez-vous d'avoir un fichier CSS pour styler les boutons
// const Box = () => {
//   const geometry = new THREE.BoxGeometry(1, 1, 1);
//   const material = new THREE.MeshBasicMaterial({ color: 'orange' });
//   return <primitive object={new THREE.Mesh(geometry, material)} />;
// };
const Scene: React.FC = () => {
  const [moveX, setMoveX] = useState(0);
  const [moveZ, setMoveZ] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const MOVE_SPEED = 0.2;

  const platforms = useMemo(() => generatePlatforms(1500, 1, 1800), []);
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

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRestart = () => {
    window.location.reload(); // Simple way to restart the scene
  };

  return (
    <div>
      <Canvas
      
        shadows
        camera={{ position: [0, 50, 100], fov: 50, near: 0.1, far: 2000 }}
        style={{ width: '100vw', height: '100vh' }}
      >
         <OrbitControls
  
/>
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
        <FlyingSquirrel moveX={moveX} moveZ={moveZ} platforms={platformRefs} isPaused={isPaused} />
      
      </Canvas>
     
      <div className="controls">
        <button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
};

export default Scene;
