export interface GameState {
  score: number
  coins: number
  isPlaying: boolean
  isGameOver: boolean
  speed: number
  distance: number
}

export interface Obstacle {
  id: number
  lane: number
  z: number
  type: 'barrier' | 'train' | 'low'
}

export interface Coin {
  id: number
  lane: number
  z: number
  y: number
}

export interface PlayerState {
  lane: number // -1, 0, 1
  isJumping: boolean
  isSliding: boolean
  y: number
  targetLane: number
}
