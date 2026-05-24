import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect } from 'react'
import { Game } from './components/Game'
import { GameUI } from './components/GameUI'
import { GameState } from './types'

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    coins: 0,
    isPlaying: false,
    isGameOver: false,
    speed: 15,
    distance: 0
  })

  const startGame = useCallback(() => {
    setGameState({
      score: 0,
      coins: 0,
      isPlaying: true,
      isGameOver: false,
      speed: 15,
      distance: 0
    })
  }, [])

  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }))
  }, [])

  const collectCoin = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + 1,
      score: prev.score + 100
    }))
  }, [])

  const updateDistance = useCallback((delta: number) => {
    setGameState(prev => ({
      ...prev,
      distance: prev.distance + delta * prev.speed,
      score: prev.score + Math.floor(delta * prev.speed),
      speed: Math.min(35, prev.speed + delta * 0.1)
    }))
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 via-transparent to-pink-300/30" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 8, 15], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Game
              gameState={gameState}
              onCollectCoin={collectCoin}
              onGameOver={endGame}
              onUpdateDistance={updateDistance}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <GameUI
        gameState={gameState}
        onStartGame={startGame}
      />

      {/* Footer */}
      <footer className="absolute bottom-3 left-0 right-0 text-center z-20">
        <p className="text-white/40 text-xs font-light tracking-wider">
          Requested by <span className="text-white/60">@flipflipyy</span> · Built by <span className="text-white/60">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}
