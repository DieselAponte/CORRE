import { useSyncExternalStore } from 'react';
import {
  gameStateStore,
  playerStateStore,
  waveStateStore,
  visionStateStore,
  type GameStateValues,
  type PlayerStateValues,
  type WaveStateValues,
  type VisionStateValues,
} from 'game-core';

/**
 * Custom hooks utilizando useSyncExternalStore para suscribir componentes React
 * a los stores de Zustand Vanilla de game-core sin duplicación de estado local.
 */

export function useGameState(): GameStateValues {
  return useSyncExternalStore(
    (cb) => gameStateStore.subscribe(cb),
    () => gameStateStore.getState()
  );
}

export function usePlayerState(): PlayerStateValues {
  return useSyncExternalStore(
    (cb) => playerStateStore.subscribe(cb),
    () => playerStateStore.getState()
  );
}

export function useWaveState(): WaveStateValues {
  return useSyncExternalStore(
    (cb) => waveStateStore.subscribe(cb),
    () => waveStateStore.getState()
  );
}

export function useVisionState(): VisionStateValues {
  return useSyncExternalStore(
    (cb) => visionStateStore.subscribe(cb),
    () => visionStateStore.getState()
  );
}
