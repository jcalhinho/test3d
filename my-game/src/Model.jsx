import React from 'react'
import { useGLTF } from '@react-three/drei'

function Model(props) {
  const { nodes, materials } = useGLTF('/sans_nom.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphère001.geometry} material={materials.Matériau} position={[-2.184, 0.244, 1.343]} rotation={[-3.112, 1.168, 3.092]} scale={[0.728, 1, 1]} />
    </group>
  )
}

useGLTF.preload('/sans_nom.glb')
export default Model;