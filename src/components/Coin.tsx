import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoinProps {
  position: [number, number, number]
}

export function CoinModel({ position }: CoinProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 3
    }
  })

  return (
    <group position={position}>
      {/* Main coin */}
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Inner detail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#ffee00"
          emissive="#ffcc00"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Glow effect */}
      <pointLight color="#ffd700" intensity={0.5} distance={3} />
    </group>
  )
}
