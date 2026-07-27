export interface MediaPipeConfig {
  wasmLoaderPath: string;
  handLandmarkerModelUrl: string;
  poseLandmarkerModelUrl: string;
  faceLandmarkerModelUrl: string;
  numHands: number;
  minHandDetectionConfidence: number;
  minHandPresenceConfidence: number;
  minHandTrackingConfidence: number;
  numPoses: number;
  minPoseDetectionConfidence: number;
  minPosePresenceConfidence: number;
  minPoseTrackingConfidence: number;
  numFaces: number;
  minFaceDetectionConfidence: number;
  minFacePresenceConfidence: number;
  minFaceTrackingConfidence: number;
}

export const DEFAULT_VISION_CONFIG: MediaPipeConfig = {
  wasmLoaderPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  handLandmarkerModelUrl:
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  poseLandmarkerModelUrl:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  faceLandmarkerModelUrl:
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minHandTrackingConfidence: 0.5,
  numPoses: 1,
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minPoseTrackingConfidence: 0.5,
  numFaces: 1,
  minFaceDetectionConfidence: 0.5,
  minFacePresenceConfidence: 0.5,
  minFaceTrackingConfidence: 0.5,
};
