import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlayerProps {
  position: [number, number, number]
  isSliding: boolean
}

export function Player({ position, isSliding }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const runPhase = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smooth position interpolation
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        position[0],
        0.15
      )
      groupRef.current.position.y = position[1]
      groupRef.current.position.z = position[2]

      // Sliding animation
      if (isSliding) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          Math.PI / 2,
          0.2
        )
        groupRef.current.scale.y = THREE.MathUtils.lerp(
          groupRef.current.scale.y,
          0.5,
          0.2
        )
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          0.2
        )
        groupRef.current.scale.y = THREE.MathUtils.lerp(
          groupRef.current.scale.y,
          1,
          0.2
        )
      }

      // Running animation
      runPhase.current += delta * 15
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00aaaa"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#ff77ff"
          emissive="#ff44ff"
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Eyes glow */}
      <mesh position={[0.15, 1.55, 0.25]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.15, 1.55, 0.25]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Energy trail */}
      <mesh position={[0, 0.5, -0.5]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[0.5, 1.5]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
