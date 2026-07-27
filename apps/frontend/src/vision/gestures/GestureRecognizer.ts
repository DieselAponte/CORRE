import type { DetectionFrameResult, GestureType, Point3D } from '../types/Vision.types';
import type { GestureConfig, GestureRecognitionResult } from './Gesture.types';

export class GestureRecognizer {
  private config: Required<GestureConfig>;

  constructor(config: GestureConfig = {}) {
    this.config = {
      handUpThresholdY: config.handUpThresholdY ?? 0.35,
      handDownThresholdY: config.handDownThresholdY ?? 0.65,
      faceCenterToleranceX: config.faceCenterToleranceX ?? 0.1,
      smileThresholdRatio: config.smileThresholdRatio ?? 0.05,
    };
  }

  public recognize(frame: DetectionFrameResult): GestureRecognitionResult {
    const timestamp = frame.timestamp;

    // 1. Check Hand Gestures first
    if (frame.hands && frame.hands.landmarks.length > 0) {
      const handLandmarks = frame.hands.landmarks[0];
      const handGesture = this.analyzeHand(handLandmarks);
      if (handGesture !== 'NONE') {
        return {
          gesture: handGesture,
          confidence: 0.9,
          timestamp,
        };
      }
    }

    // 2. Check Pose Gestures
    if (frame.pose && frame.pose.landmarks.length > 0) {
      const poseLandmarks = frame.pose.landmarks[0];
      const poseGesture = this.analyzePose(poseLandmarks);
      if (poseGesture !== 'NONE') {
        return {
          gesture: poseGesture,
          confidence: 0.85,
          timestamp,
        };
      }
    }

    // 3. Check Face Gestures
    if (frame.face && frame.face.landmarks.length > 0) {
      const faceLandmarks = frame.face.landmarks[0];
      const faceGesture = this.analyzeFace(faceLandmarks);
      if (faceGesture !== 'NONE') {
        return {
          gesture: faceGesture,
          confidence: 0.8,
          timestamp,
        };
      }
    }

    return {
      gesture: 'NONE',
      confidence: 1.0,
      timestamp,
    };
  }

  private analyzeHand(landmarks: Point3D[]): GestureType {
    if (landmarks.length < 21) return 'NONE';

    const wrist = landmarks[0];
    if (wrist.y < this.config.handUpThresholdY) {
      return 'HAND_UP';
    }
    if (wrist.y > this.config.handDownThresholdY) {
      return 'HAND_DOWN';
    }

    // Count extended fingers
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;

    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

    if (extendedCount === 1 && indexExtended) {
      return 'GESTURE_ONE';
    }
    if (extendedCount === 2 && indexExtended && middleExtended) {
      return 'GESTURE_TWO';
    }
    if (extendedCount === 3 && indexExtended && middleExtended && ringExtended) {
      return 'GESTURE_THREE';
    }

    return 'NONE';
  }

  private analyzePose(landmarks: Point3D[]): GestureType {
    if (landmarks.length < 17) return 'NONE';

    // Left wrist (15) or Right wrist (16)
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const nose = landmarks[0];

    if ((leftWrist && leftWrist.y < nose.y) || (rightWrist && rightWrist.y < nose.y)) {
      return 'HAND_UP';
    }

    return 'NONE';
  }

  private analyzeFace(landmarks: Point3D[]): GestureType {
    if (landmarks.length < 10) return 'NONE';

    const nose = landmarks[1]; // nose tip
    if (nose) {
      const distFromCenter = Math.abs(nose.x - 0.5);
      if (distFromCenter <= this.config.faceCenterToleranceX) {
        return 'FACE_CENTERED';
      }
    }

    return 'NONE';
  }
}
