import { createStore } from 'zustand/vanilla';
import type { GestureType } from '../types/GestureType';

export type VisionCameraState = 'OFF' | 'STARTING' | 'ACTIVE' | 'ERROR' | 'STOPPED';

/**
 * VisionState
 *
 * Store especializado de Zustand para reflejar el estado del módulo de visión dentro del dominio del juego.
 * No se conecta directamente a MediaPipe; se actualiza mediante eventos emitidos.
 */
export interface VisionStateValues {
  cameraState: VisionCameraState;
  currentGesture: GestureType;
  confidence: number;
  isCalibrated: boolean;
}

export interface VisionStateActions {
  setCameraState: (cameraState: VisionCameraState) => void;
  setCurrentGesture: (gesture: GestureType) => void;
  setConfidence: (confidence: number) => void;
  setCalibrationStatus: (isCalibrated: boolean) => void;
  resetVisionState: () => void;
}

export type VisionStateStore = VisionStateValues & VisionStateActions;

export const initialVisionStateValues: VisionStateValues = {
  cameraState: 'OFF',
  currentGesture: 'NONE',
  confidence: 0,
  isCalibrated: false,
};

export const visionStateStore = createStore<VisionStateStore>()((set) => ({
  ...initialVisionStateValues,
  setCameraState: (cameraState) => set({ cameraState }),
  setCurrentGesture: (currentGesture) => set({ currentGesture }),
  setConfidence: (confidence) => set({ confidence }),
  setCalibrationStatus: (isCalibrated) => set({ isCalibrated }),
  resetVisionState: () => set(initialVisionStateValues),
}));
