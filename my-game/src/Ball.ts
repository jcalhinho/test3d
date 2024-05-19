import * as THREE from 'three';

export const createBall = (): THREE.Mesh => {
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.y = 1;
  ball.castShadow = true;  // Enable shadow casting
  return ball;
};
