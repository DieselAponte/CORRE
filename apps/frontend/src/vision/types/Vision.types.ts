export type CameraState = 'OFF' | 'STARTING' | 'ACTIVE' | 'ERROR' | 'STOPPED';

export type VisionStatus = 'UNINITIALIZED' | 'INITIALIZING' | 'READY' | 'RUNNING' | 'ERROR' | 'PAUSED';

export type GestureType = 
  | 'NONE'
  | 'GESTURE_ONE'
  | 'GESTURE_TWO'
  | 'GESTURE_THREE'
  | 'OPEN_HAND'
  | 'CLOSED_HAND'
  | 'HAND_UP'
  | 'HAND_DOWN'
  | 'FACE_CENTERED'
  | 'SMILE';

export type GameEventType =
  | 'GESTURE_TRIGGERED'
  | 'FACE_STATE_CHANGED'
  | 'POSE_STATE_CHANGED'
  | 'CAMERA_STATUS_CHANGED'
  | 'VISION_ERROR';

export interface Point3D {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface HandLandmarks {
  landmarks: Point3D[][];
  handedness: Array<{
    index: number;
    score: number;
    categoryName: string;
    displayName: string;
  }>;
}

export interface PoseLandmarks {
  landmarks: Point3D[][];
  worldLandmarks?: Point3D[][];
}

export interface FaceLandmarks {
  landmarks: Point3D[][];
}

export interface DetectionFrameResult {
  timestamp: number;
  hands: HandLandmarks | null;
  pose: PoseLandmarks | null;
  face: FaceLandmarks | null;
  fps?: number;
  frameTime?: number;
}

export interface VisionEvent {
  id: string;
  type: GameEventType;
  gesture: GestureType;
  timestamp: number;
  payload?: Record<string, unknown>;
}
