import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { PoseLandmarks } from '../types/Vision.types';
import type { MediaPipeConfig } from './VisionConfig';

export class PoseDetector {
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitialized = false;

  public async initialize(visionResolver: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>, config: MediaPipeConfig): Promise<void> {
    if (this.isInitialized) return;

    this.poseLandmarker = await PoseLandmarker.createFromOptions(visionResolver, {
      baseOptions: {
        modelAssetPath: config.poseLandmarkerModelUrl,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: config.numPoses,
      minPoseDetectionConfidence: config.minPoseDetectionConfidence,
      minPosePresenceConfidence: config.minPosePresenceConfidence,
      minTrackingConfidence: config.minPoseTrackingConfidence,
    });

    this.isInitialized = true;
  }

  public detect(videoElement: HTMLVideoElement, timestamp: number): PoseLandmarks | null {
    if (!this.poseLandmarker || !this.isInitialized) {
      return null;
    }

    try {
      const result = this.poseLandmarker.detectForVideo(videoElement, timestamp);

      if (!result || !result.landmarks || result.landmarks.length === 0) {
        return null;
      }

      return {
        landmarks: result.landmarks.map((pose) =>
          pose.map((pt) => ({
            x: pt.x,
            y: pt.y,
            z: pt.z ?? 0,
            visibility: pt.visibility,
          }))
        ),
        worldLandmarks: result.worldLandmarks?.map((worldPose) =>
          worldPose.map((pt) => ({
            x: pt.x,
            y: pt.y,
            z: pt.z ?? 0,
            visibility: pt.visibility,
          }))
        ),
      };
    } catch {
      return null;
    }
  }

  public close(): void {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.isInitialized = false;
  }
}
