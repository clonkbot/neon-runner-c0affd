import { GameState } from '../types'

interface GameUIProps {
  gameState: GameState
  onStartGame: () => void
}

export function GameUI({ gameState, onStartGame }: GameUIProps) {
  return (
    <>
      {/* Score HUD - Top */}
      {gameState.isPlaying && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          {/* Score Panel */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="text-white/60 text-xs uppercase tracking-widest font-medium mb-1">Score</div>
            <div className="text-4xl md:text-5xl font-black text-white tabular-nums"
                 style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
              {Math.floor(gameState.score).toLocaleString()}
            </div>
          </div>

          {/* Coins Panel */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg shadow-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-900 font-bold text-sm md:text-base">$</span>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white tabular-nums"
                   style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
                {gameState.coins}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed indicator */}
      {gameState.isPlaying && (
        <div className="absolute bottom-20 md:bottom-16 left-4 z-10 pointer-events-none">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-2 shadow-xl">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Speed</div>
            <div className="flex items-center gap-2">
              <div className="w-24 md:w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full transition-all duration-300"
                  style={{ width: `${((gameState.speed - 15) / 20) * 100}%` }}
                />
              </div>
              <span className="text-white font-bold text-sm">{Math.floor(gameState.speed)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls Hint */}
      {gameState.isPlaying && (
        <div className="absolute bottom-20 md:bottom-16 right-4 z-10 pointer-events-none md:hidden">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-3 py-2 shadow-xl">
            <div className="text-white/60 text-[10px] uppercase tracking-wider text-center">Swipe</div>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <div />
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white/60 text-xs">^</div>
              <div />
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white/60 text-xs">{'<'}</div>
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white/60 text-xs">v</div>
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white/60 text-xs">{'>'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!gameState.isPlaying && !gameState.isGameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center"
               style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-pink-300 mb-2"
                style={{ textShadow: '0 0 40px rgba(255,0,255,0.3)' }}>
              NEON RUN
            </h1>
            <p className="text-white/60 text-sm md:text-base mb-8">
              Race through the cyberpunk city
            </p>

            <button
              onClick={onStartGame}
              className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white
                       bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500
                       hover:from-fuchsia-400 hover:via-purple-400 hover:to-cyan-400
                       transform hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
              style={{ boxShadow: '0 0 30px rgba(168,85,247,0.4), inset 0 1px 1px rgba(255,255,255,0.3)' }}
            >
              START GAME
            </button>

            <div className="mt-8 space-y-3">
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white/80 font-semibold text-sm mb-2">Controls</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="bg-white/20 px-2 py-1 rounded font-mono">A/D</span>
                    <span>Change lane</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="bg-white/20 px-2 py-1 rounded font-mono">W/^</span>
                    <span>Jump</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="bg-white/20 px-2 py-1 rounded font-mono">S/v</span>
                    <span>Slide</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="bg-white/20 px-2 py-1 rounded">Swipe</span>
                    <span>Mobile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center animate-fade-in"
               style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-fuchsia-400 mb-6">
              GAME OVER
            </h2>

            <div className="space-y-4 mb-8">
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Final Score</div>
                <div className="text-4xl md:text-5xl font-black text-white"
                     style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
                  {Math.floor(gameState.score).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Coins</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center">
                      <span className="text-yellow-900 font-bold text-xs">$</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{gameState.coins}</span>
                  </div>
                </div>

                <div className="flex-1 backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Distance</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(gameState.distance)}m
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onStartGame}
              className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white
                       bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500
                       hover:from-fuchsia-400 hover:via-purple-400 hover:to-cyan-400
                       transform hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
              style={{ boxShadow: '0 0 30px rgba(168,85,247,0.4), inset 0 1px 1px rgba(255,255,255,0.3)' }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Animated background elements for menus */}
      {(!gameState.isPlaying || gameState.isGameOver) && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </>
  )
}
