import * as THREE from 'three';

export const createGround = (): THREE.Mesh => {
  const groundGeometry = new THREE.BoxGeometry(20, 0.1, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x007700 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;  // Enable shadow receiving
  return ground;
};
