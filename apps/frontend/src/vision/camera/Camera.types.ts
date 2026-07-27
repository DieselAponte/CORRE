import type { CameraState } from '../types/Vision.types';

export interface CameraConfig {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  frameRate?: number;
}

export interface CameraError {
  code: 'PERMISSION_DENIED' | 'NOT_FOUND' | 'NOT_READABLE' | 'UNKNOWN';
  message: string;
  originalError?: unknown;
}

export type CameraStateListener = (state: CameraState, error?: CameraError) => void;
