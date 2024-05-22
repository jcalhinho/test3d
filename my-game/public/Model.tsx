
import { useGLTF } from '@react-three/drei'
import { ExtendedColors, Overwrite, NodeProps, NonFunctionKeys, Vector3, Euler, Matrix4, Quaternion, Layers } from '@react-three/fiber'
import { EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events'
import { JSX } from 'react/jsx-runtime'
import { Group, Object3DEventMap } from 'three';


function Model(props: JSX.IntrinsicAttributes & Omit<ExtendedColors<Overwrite<Partial<Group<Object3DEventMap>>, NodeProps<Group<Object3DEventMap>, Group>>>, NonFunctionKeys<{ position?: Vector3 | undefined; up?: Vector3 | undefined; scale?: Vector3 | undefined; rotation?: Euler | undefined; matrix?: Matrix4 | undefined; quaternion?: Quaternion | undefined; layers?: Layers | undefined; dispose?: (() => void) | null | undefined }>> & { position?: Vector3 | undefined; up?: Vector3 | undefined; scale?: Vector3 | undefined; rotation?: Euler | undefined; matrix?: Matrix4 | undefined; quaternion?: Quaternion | undefined; layers?: Layers | undefined; dispose?: (() => void) | null | undefined } & EventHandlers) {
  const { nodes, materials } = useGLTF('/sans_nom.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphère001.geometry} material={materials.Matériau} position={[-2.184, 0.244, 1.343]} rotation={[-3.112, 1.168, 3.092]} scale={[0.728, 1, 1]} />
    </group>
  )
}

useGLTF.preload('/sans_nom.glb')
export default Model;