import { createStore } from 'zustand/vanilla';
import type { Wave } from '../entities/Wave';
import type { Building } from '../entities/Building';

/**
 * WaveState
 *
 * Store especializado de Zustand para almacenar el estado de las oleadas, edificios disponibles y edificio seleccionado.
 */
export interface WaveStateValues {
  currentWave: Wave | null;
  availableBuildings: Building[];
  completedWaves: Wave[];
  selectedBuilding: Building | null;
}

export interface WaveStateActions {
  setCurrentWave: (wave: Wave | null) => void;
  setAvailableBuildings: (buildings: Building[]) => void;
  setSelectedBuilding: (building: Building | null) => void;
  addCompletedWave: (wave: Wave) => void;
  resetWaveState: () => void;
}

export type WaveStateStore = WaveStateValues & WaveStateActions;

export const initialWaveStateValues: WaveStateValues = {
  currentWave: null,
  availableBuildings: [],
  completedWaves: [],
  selectedBuilding: null,
};

export const waveStateStore = createStore<WaveStateStore>()((set) => ({
  ...initialWaveStateValues,
  setCurrentWave: (currentWave) => set({ currentWave }),
  setAvailableBuildings: (availableBuildings) => set({ availableBuildings }),
  setSelectedBuilding: (selectedBuilding) => set({ selectedBuilding }),
  addCompletedWave: (wave) =>
    set((state) => ({
      completedWaves: [...state.completedWaves, wave],
    })),
  resetWaveState: () => set(initialWaveStateValues),
}));
