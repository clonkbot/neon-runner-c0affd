import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LANE_WIDTH = 3
const TRACK_LENGTH = 200

export function Track() {
  const gridRef = useRef<THREE.Group>(null!)
  const scrollOffset = useRef(0)

  // Create grid pattern
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = []

    // Cross lines (horizontal)
    for (let i = 0; i < 40; i++) {
      lines.push(
        <mesh
          key={`h-${i}`}
          position={[0, 0.01, -i * 5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[12, 0.1]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
        </mesh>
      )
    }

    return lines
  }, [])

  useFrame((_, delta) => {
    if (gridRef.current) {
      scrollOffset.current = (scrollOffset.current + delta * 15) % 5
      gridRef.current.position.z = scrollOffset.current
    }
  })

  return (
    <group>
      {/* Main track surface */}
      <mesh
        position={[0, -0.01, -TRACK_LENGTH / 2 + 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#1a0a2e"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Lane dividers */}
      <mesh position={[-LANE_WIDTH, 0.02, -TRACK_LENGTH / 2 + 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, TRACK_LENGTH]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[LANE_WIDTH, 0.02, -TRACK_LENGTH / 2 + 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, TRACK_LENGTH]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} />
      </mesh>

      {/* Center glow line */}
      <mesh position={[0, 0.02, -TRACK_LENGTH / 2 + 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, TRACK_LENGTH]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
      </mesh>

      {/* Scrolling grid */}
      <group ref={gridRef}>
        {gridLines}
      </group>

      {/* Side rails - left */}
      <mesh position={[-7, 1, -TRACK_LENGTH / 2 + 10]}>
        <boxGeometry args={[0.5, 2, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#2a1b4a"
          emissive="#ff00ff"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Side rails - right */}
      <mesh position={[7, 1, -TRACK_LENGTH / 2 + 10]}>
        <boxGeometry args={[0.5, 2, TRACK_LENGTH]} />
        <meshStandardMaterial
          color="#2a1b4a"
          emissive="#ff00ff"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Neon strips on rails */}
      <mesh position={[-7, 2.1, -TRACK_LENGTH / 2 + 10]}>
        <boxGeometry args={[0.6, 0.1, TRACK_LENGTH]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[7, 2.1, -TRACK_LENGTH / 2 + 10]}>
        <boxGeometry args={[0.6, 0.1, TRACK_LENGTH]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>

      {/* Building silhouettes - left */}
      {[-30, -50, -70, -90, -110].map((z, i) => (
        <mesh key={`bl-${i}`} position={[-15 - i * 2, 5 + i * 2, z]}>
          <boxGeometry args={[6, 10 + i * 4, 8]} />
          <meshStandardMaterial
            color="#0a0515"
            emissive="#ff00ff"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Building silhouettes - right */}
      {[-40, -60, -80, -100, -120].map((z, i) => (
        <mesh key={`br-${i}`} position={[15 + i * 2, 6 + i * 2, z]}>
          <boxGeometry args={[6, 12 + i * 3, 8]} />
          <meshStandardMaterial
            color="#0a0515"
            emissive="#00ffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
