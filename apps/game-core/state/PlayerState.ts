import { createStore } from 'zustand/vanilla';
import type { Player } from '../entities/Player';
import type { PlayerStatus } from '../types/PlayerStatus';
import type { GestureType } from '../types/GestureType';

/**
 * PlayerState
 *
 * Store especializado de Zustand para almacenar el estado persistente de los jugadores.
 */
export interface PlayerStateValues {
  players: Record<string, Player>;
}

export interface PlayerStateActions {
  setPlayer: (player: Player) => void;
  updatePlayerStatus: (playerId: string, status: PlayerStatus) => void;
  updatePlayerLives: (playerId: string, lives: number) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  updatePlayerSelectedGesture: (playerId: string, gesture: GestureType) => void;
  resetPlayerState: () => void;
}

export type PlayerStateStore = PlayerStateValues & PlayerStateActions;

export const initialPlayerStateValues: PlayerStateValues = {
  players: {},
};

export const playerStateStore = createStore<PlayerStateStore>()((set) => ({
  ...initialPlayerStateValues,
  setPlayer: (player) =>
    set((state) => ({
      players: { ...state.players, [player.id]: player },
    })),
  updatePlayerStatus: (playerId, status) =>
    set((state) => {
      const existing = state.players[playerId];
      if (!existing) return state;
      existing.status = status;
      return { players: { ...state.players, [playerId]: existing } };
    }),
  updatePlayerLives: (playerId, lives) =>
    set((state) => {
      const existing = state.players[playerId];
      if (!existing) return state;
      existing.lives = lives;
      return { players: { ...state.players, [playerId]: existing } };
    }),
  updatePlayerScore: (playerId, score) =>
    set((state) => {
      const existing = state.players[playerId];
      if (!existing) return state;
      existing.score = score;
      return { players: { ...state.players, [playerId]: existing } };
    }),
  updatePlayerSelectedGesture: (playerId, gesture) =>
    set((state) => {
      const existing = state.players[playerId];
      if (!existing) return state;
      existing.selectedGesture = gesture;
      return { players: { ...state.players, [playerId]: existing } };
    }),
  resetPlayerState: () => set(initialPlayerStateValues),
}));
