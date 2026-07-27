import type { GestureType } from '../types/Vision.types';

export interface GestureRecognitionResult {
  gesture: GestureType;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface GestureConfig {
  handUpThresholdY?: number;
  handDownThresholdY?: number;
  faceCenterToleranceX?: number;
  smileThresholdRatio?: number;
}
