import { createStore } from 'zustand/vanilla';
import type { GameStatus } from '../types/GameStatus';
import type { WinnerType } from '../types/WinnerType';
import type { Wave } from '../entities/Wave';

/**
 * GameState
 *
 * Store especializado de Zustand para almacenar el estado persistente del ciclo de vida de la partida.
 */
export interface GameStateValues {
  status: GameStatus;
  currentWave: Wave | null;
  winner: WinnerType;
  remainingTime: number;
  elapsedTime: number;
  formattedTime: string;
}

export interface GameStateActions {
  setGameStatus: (status: GameStatus) => void;
  setCurrentWave: (wave: Wave | null) => void;
  setWinner: (winner: WinnerType) => void;
  setRemainingTime: (time: number) => void;
  setElapsedTime: (elapsedTime: number, formattedTime: string) => void;
  resetGameState: () => void;
}

export type GameStateStore = GameStateValues & GameStateActions;

export const initialGameStateValues: GameStateValues = {
  status: 'BOOT',
  currentWave: null,
  winner: 'NONE',
  remainingTime: 0,
  elapsedTime: 0,
  formattedTime: '00:00',
};

export const gameStateStore = createStore<GameStateStore>()((set) => ({
  ...initialGameStateValues,
  setGameStatus: (status) => set({ status }),
  setCurrentWave: (currentWave) => set({ currentWave }),
  setWinner: (winner) => set({ winner }),
  setRemainingTime: (remainingTime) => set({ remainingTime }),
  setElapsedTime: (elapsedTime, formattedTime) => set({ elapsedTime, formattedTime }),
  resetGameState: () => set(initialGameStateValues),
}));
