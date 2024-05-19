import * as THREE from 'three';

export const createPlatforms = (): THREE.Mesh[] => {
  const platforms: THREE.Mesh[] = [];
  const shapes = [
    new THREE.BoxGeometry(3, 0.5, 1),
    new THREE.BoxGeometry(2, 0.5, 2),
    new THREE.CylinderGeometry(1, 1, 0.5, 32),
  ];
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  for (let i = 0; i < 10; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const platform = new THREE.Mesh(shape, material);
    platform.position.set(
      (Math.random() - 0.5) * 20,
      -Math.random() * 20,
      (Math.random() - 0.5) * 20
    );
    platforms.push(platform);
  }

  return platforms;
};
