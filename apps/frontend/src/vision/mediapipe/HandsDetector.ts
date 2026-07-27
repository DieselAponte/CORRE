import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { HandLandmarks } from '../types/Vision.types';
import type { MediaPipeConfig } from './VisionConfig';

export class HandsDetector {
  private handLandmarker: HandLandmarker | null = null;
  private isInitialized = false;

  public async initialize(visionResolver: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>, config: MediaPipeConfig): Promise<void> {
    if (this.isInitialized) return;

    this.handLandmarker = await HandLandmarker.createFromOptions(visionResolver, {
      baseOptions: {
        modelAssetPath: config.handLandmarkerModelUrl,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: config.numHands,
      minHandDetectionConfidence: config.minHandDetectionConfidence,
      minHandPresenceConfidence: config.minHandPresenceConfidence,
      minTrackingConfidence: config.minHandTrackingConfidence,
    });

    this.isInitialized = true;
  }

  public detect(videoElement: HTMLVideoElement, timestamp: number): HandLandmarks | null {
    if (!this.handLandmarker || !this.isInitialized) {
      return null;
    }

    try {
      const result = this.handLandmarker.detectForVideo(videoElement, timestamp);

      if (!result || !result.landmarks || result.landmarks.length === 0) {
        return null;
      }

      return {
        landmarks: result.landmarks.map((hand) =>
          hand.map((pt) => ({
            x: pt.x,
            y: pt.y,
            z: pt.z ?? 0,
            visibility: pt.visibility,
          }))
        ),
        handedness: (result.handedness || []).map((h) => ({
          index: h[0]?.index ?? 0,
          score: h[0]?.score ?? 0,
          categoryName: h[0]?.categoryName ?? '',
          displayName: h[0]?.displayName ?? '',
        })),
      };
    } catch {
      return null;
    }
  }

  public close(): void {
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
    this.isInitialized = false;
  }
}
