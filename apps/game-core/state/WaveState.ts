import { createStore } from 'zustand/vanilla';
import type { Wave } from '../entities/Wave';
import type { Building } from '../entities/Building';

/**
 * WaveState
 *
 * Store especializado de Zustand para almacenar el estado de las oleadas y edificios disponibles.
 */
export interface WaveStateValues {
  currentWave: Wave | null;
  availableBuildings: Building[];
  completedWaves: Wave[];
}

export interface WaveStateActions {
  setCurrentWave: (wave: Wave | null) => void;
  setAvailableBuildings: (buildings: Building[]) => void;
  addCompletedWave: (wave: Wave) => void;
  resetWaveState: () => void;
}

export type WaveStateStore = WaveStateValues & WaveStateActions;

export const initialWaveStateValues: WaveStateValues = {
  currentWave: null,
  availableBuildings: [],
  completedWaves: [],
};

export const waveStateStore = createStore<WaveStateStore>()((set) => ({
  ...initialWaveStateValues,
  setCurrentWave: (currentWave) => set({ currentWave }),
  setAvailableBuildings: (availableBuildings) => set({ availableBuildings }),
  addCompletedWave: (wave) =>
    set((state) => ({
      completedWaves: [...state.completedWaves, wave],
    })),
  resetWaveState: () => set(initialWaveStateValues),
}));
