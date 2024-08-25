export type Coin = "b" | "w" | undefined

export type Board = {
  places: Coin[][];
  size: number;
}

export interface Player {
  symbol: Coin
}

export interface GameState {
  completed: boolean;
  board: Board;
  player: Player;
  winner: Player[];
}

export type CoinPlacement = [number, number];

export type DeltaMovement = [number, number];
