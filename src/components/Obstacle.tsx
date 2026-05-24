import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ObstacleProps {
  position: [number, number, number]
  type: 'barrier' | 'train' | 'low'
}

export function ObstacleModel({ position, type }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current && type === 'barrier') {
      meshRef.current.material = meshRef.current.material as THREE.MeshStandardMaterial
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3
    }
  })

  if (type === 'barrier') {
    // Jump-over barrier (tall, but can slide under)
    return (
      <group position={position}>
        {/* Main barrier body */}
        <mesh ref={meshRef} position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[2.5, 3, 0.5]} />
          <meshStandardMaterial
            color="#ff3366"
            emissive="#ff0044"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Warning stripes */}
        <mesh position={[0, 2.5, 0.26]}>
          <planeGeometry args={[2.4, 0.3]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
        <mesh position={[0, 3, 0.26]}>
          <planeGeometry args={[2.4, 0.3]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Support posts */}
        <mesh position={[-1, 1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2]} />
          <meshStandardMaterial color="#333333" metalness={0.9} />
        </mesh>
        <mesh position={[1, 1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2]} />
          <meshStandardMaterial color="#333333" metalness={0.9} />
        </mesh>
      </group>
    )
  }

  if (type === 'train') {
    // Train - full height, must dodge
    return (
      <group position={position}>
        {/* Train car body */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2, 3, 4]} />
          <meshStandardMaterial
            color="#4444ff"
            emissive="#0000ff"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Train roof */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.2, 0.4, 4.2]} />
          <meshStandardMaterial
            color="#222266"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Windows */}
        <mesh position={[1.01, 2, 0.8]}>
          <planeGeometry args={[0.01, 0.8, 1]} />
          <meshBasicMaterial color="#88ffff" />
        </mesh>
        <mesh position={[1.01, 2, -0.8]}>
          <planeGeometry args={[0.01, 0.8, 1]} />
          <meshBasicMaterial color="#88ffff" />
        </mesh>
        <mesh position={[-1.01, 2, 0.8]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.01, 0.8, 1]} />
          <meshBasicMaterial color="#88ffff" />
        </mesh>
        <mesh position={[-1.01, 2, -0.8]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.01, 0.8, 1]} />
          <meshBasicMaterial color="#88ffff" />
        </mesh>
        {/* Wheels */}
        <mesh position={[-0.8, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} />
        </mesh>
        <mesh position={[0.8, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} />
        </mesh>
        <mesh position={[-0.8, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} />
        </mesh>
        <mesh position={[0.8, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} />
        </mesh>
      </group>
    )
  }

  // Low obstacle - jump over it
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 1]} />
        <meshStandardMaterial
          color="#ff8800"
          emissive="#ff4400"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Hazard stripes */}
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 0.9]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  )
}
