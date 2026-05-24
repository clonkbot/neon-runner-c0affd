import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { GameState, Obstacle, Coin, PlayerState } from '../types'
import { Player } from './Player'
import { Track } from './Track'
import { ObstacleModel } from './Obstacle'
import { CoinModel } from './Coin'

interface GameProps {
  gameState: GameState
  onCollectCoin: () => void
  onGameOver: () => void
  onUpdateDistance: (delta: number) => void
}

const LANE_WIDTH = 3
const SPAWN_DISTANCE = -100
const DESPAWN_DISTANCE = 20
const OBSTACLE_SPACING = 15
const COIN_SPACING = 8

export function Game({ gameState, onCollectCoin, onGameOver, onUpdateDistance }: GameProps) {
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [player, setPlayer] = useState<PlayerState>({
    lane: 0,
    isJumping: false,
    isSliding: false,
    y: 1,
    targetLane: 0
  })

  const obstacleIdRef = useRef(0)
  const coinIdRef = useRef(0)
  const lastObstacleZ = useRef(SPAWN_DISTANCE)
  const lastCoinZ = useRef(SPAWN_DISTANCE + 5)
  const gameOverTriggered = useRef(false)
  const { camera } = useThree()

  // Reset game state when starting
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      setObstacles([])
      setCoins([])
      setPlayer({
        lane: 0,
        isJumping: false,
        isSliding: false,
        y: 1,
        targetLane: 0
      })
      lastObstacleZ.current = SPAWN_DISTANCE
      lastCoinZ.current = SPAWN_DISTANCE + 5
      gameOverTriggered.current = false
    }
  }, [gameState.isPlaying])

  // Controls
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (!gameState.isPlaying || gameState.isGameOver) return

    setPlayer(prev => {
      if (direction === 'left' && prev.lane > -1) {
        return { ...prev, targetLane: prev.lane - 1 }
      }
      if (direction === 'right' && prev.lane < 1) {
        return { ...prev, targetLane: prev.lane + 1 }
      }
      if (direction === 'up' && !prev.isJumping && !prev.isSliding) {
        return { ...prev, isJumping: true }
      }
      if (direction === 'down' && !prev.isJumping && !prev.isSliding) {
        return { ...prev, isSliding: true }
      }
      return prev
    })
  }, [gameState.isPlaying, gameState.isGameOver])

  // Keyboard and touch controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleSwipe('left')
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleSwipe('right')
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') handleSwipe('up')
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleSwipe('down')
    }

    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const dx = touchEndX - touchStartX
      const dy = touchEndY - touchStartY

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) {
          handleSwipe(dx > 0 ? 'right' : 'left')
        }
      } else {
        if (Math.abs(dy) > 30) {
          handleSwipe(dy > 0 ? 'down' : 'up')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleSwipe])

  // Game loop
  useFrame((_, delta) => {
    if (!gameState.isPlaying || gameState.isGameOver || gameOverTriggered.current) return

    const speed = gameState.speed
    onUpdateDistance(delta)

    // Move obstacles
    setObstacles(prev => {
      const updated = prev
        .map(o => ({ ...o, z: o.z + speed * delta }))
        .filter(o => o.z < DESPAWN_DISTANCE)
      return updated
    })

    // Move coins
    setCoins(prev => {
      const updated = prev
        .map(c => ({ ...c, z: c.z + speed * delta }))
        .filter(c => c.z < DESPAWN_DISTANCE)
      return updated
    })

    // Spawn obstacles
    if (lastObstacleZ.current > SPAWN_DISTANCE + OBSTACLE_SPACING) {
      const newObstacles: Obstacle[] = []
      const occupiedLanes: number[] = []
      const numObstacles = Math.random() > 0.7 ? 2 : 1

      for (let i = 0; i < numObstacles; i++) {
        let lane: number
        do {
          lane = Math.floor(Math.random() * 3) - 1
        } while (occupiedLanes.includes(lane))
        occupiedLanes.push(lane)

        const types: Array<'barrier' | 'train' | 'low'> = ['barrier', 'train', 'low']
        const type = types[Math.floor(Math.random() * types.length)]

        newObstacles.push({
          id: obstacleIdRef.current++,
          lane,
          z: SPAWN_DISTANCE,
          type
        })
      }

      setObstacles(prev => [...prev, ...newObstacles])
      lastObstacleZ.current = SPAWN_DISTANCE
    }
    lastObstacleZ.current += speed * delta

    // Spawn coins
    if (lastCoinZ.current > SPAWN_DISTANCE + COIN_SPACING) {
      const lane = Math.floor(Math.random() * 3) - 1
      const y = Math.random() > 0.5 ? 2 : 1

      setCoins(prev => [...prev, {
        id: coinIdRef.current++,
        lane,
        z: SPAWN_DISTANCE,
        y
      }])
      lastCoinZ.current = SPAWN_DISTANCE
    }
    lastCoinZ.current += speed * delta

    // Update player position
    setPlayer(prev => {
      let newY = prev.y
      let isJumping = prev.isJumping
      let isSliding = prev.isSliding
      let newLane = prev.lane

      // Smooth lane transition
      if (prev.lane !== prev.targetLane) {
        const diff = prev.targetLane - prev.lane
        newLane = prev.lane + Math.sign(diff) * Math.min(Math.abs(diff), delta * 8)
        if (Math.abs(prev.targetLane - newLane) < 0.05) {
          newLane = prev.targetLane
        }
      }

      // Jump physics
      if (isJumping) {
        newY = prev.y + delta * 12
        if (newY >= 4) {
          newY = 4
          isJumping = false
        }
      } else if (prev.y > 1 && !isSliding) {
        newY = Math.max(1, prev.y - delta * 15)
      }

      // Slide mechanics
      if (isSliding) {
        newY = 0.5
        setTimeout(() => {
          setPlayer(p => ({ ...p, isSliding: false }))
        }, 500)
      } else if (!isJumping && prev.y < 1) {
        newY = Math.min(1, prev.y + delta * 10)
      }

      return {
        ...prev,
        lane: newLane,
        y: newY,
        isJumping,
        isSliding
      }
    })

    // Collision detection
    const playerX = player.lane * LANE_WIDTH
    const playerY = player.y
    const playerZ = 5

    obstacles.forEach(obstacle => {
      if (obstacle.z > playerZ - 1.5 && obstacle.z < playerZ + 1.5) {
        const obstacleX = obstacle.lane * LANE_WIDTH
        if (Math.abs(playerX - obstacleX) < 1.5) {
          // Check if can pass
          if (obstacle.type === 'low' && playerY > 2) return // Jumped over
          if (obstacle.type === 'barrier' && player.isSliding) return // Slid under

          if (!gameOverTriggered.current) {
            gameOverTriggered.current = true
            onGameOver()
          }
        }
      }
    })

    // Coin collection
    coins.forEach(coin => {
      if (coin.z > playerZ - 1 && coin.z < playerZ + 1) {
        const coinX = coin.lane * LANE_WIDTH
        if (Math.abs(playerX - coinX) < 1.5 && Math.abs(playerY - coin.y) < 1.5) {
          setCoins(prev => prev.filter(c => c.id !== coin.id))
          onCollectCoin()
        }
      }
    })

    // Camera follow
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, player.lane * LANE_WIDTH * 0.3, 0.1)
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff77ff" />
      <pointLight position={[10, 10, -10]} intensity={0.5} color="#77ffff" />

      {/* Environment */}
      <Environment preset="sunset" />
      <fog attach="fog" args={['#2a1b4a', 30, 120]} />

      {/* Track */}
      <Track />

      {/* Player */}
      <Player
        position={[player.lane * LANE_WIDTH, player.y, 5]}
        isSliding={player.isSliding}
      />

      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <ObstacleModel
          key={obstacle.id}
          position={[obstacle.lane * LANE_WIDTH, 0, obstacle.z]}
          type={obstacle.type}
        />
      ))}

      {/* Coins */}
      {coins.map(coin => (
        <Float key={coin.id} speed={4} floatIntensity={0.3}>
          <CoinModel
            position={[coin.lane * LANE_WIDTH, coin.y, coin.z]}
          />
        </Float>
      ))}
    </>
  )
}
