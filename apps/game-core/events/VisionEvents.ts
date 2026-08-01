import type { GestureType } from '../types/GestureType';

/**
 * VisionEvents
 *
 * Eventos fuertemente tipados emitidos por el módulo de visión computacional.
 */
export interface CameraConnectedEventPayload {
  deviceId?: string;
  timestamp: number;
}

export interface CameraDisconnectedEventPayload {
  reason?: string;
  timestamp: number;
}

export interface VisionReadyEventPayload {
  timestamp: number;
}

export interface CalibrationStartedEventPayload {
  playerId?: string;
  timestamp: number;
}

export interface CalibrationFinishedEventPayload {
  playerId?: string;
  success: boolean;
  timestamp: number;
}

export interface GestureReceivedEventPayload {
  gesture: GestureType;
  confidence: number;
  playerId?: string;
  timestamp: number;
}

export interface VisionEventsMap {
  CAMERA_CONNECTED: CameraConnectedEventPayload;
  CAMERA_DISCONNECTED: CameraDisconnectedEventPayload;
  VISION_READY: VisionReadyEventPayload;
  CALIBRATION_STARTED: CalibrationStartedEventPayload;
  CALIBRATION_FINISHED: CalibrationFinishedEventPayload;
  GESTURE_RECEIVED: GestureReceivedEventPayload;
}

export type VisionEventName = keyof VisionEventsMap;
