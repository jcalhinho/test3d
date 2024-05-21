import React from 'react';

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

export default Walls;
