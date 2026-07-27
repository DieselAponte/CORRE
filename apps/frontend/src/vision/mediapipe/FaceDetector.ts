import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import type { FaceLandmarks } from '../types/Vision.types';
import type { MediaPipeConfig } from './VisionConfig';

export class FaceDetector {
  private faceLandmarker: FaceLandmarker | null = null;
  private isInitialized = false;

  public async initialize(visionResolver: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>, config: MediaPipeConfig): Promise<void> {
    if (this.isInitialized) return;

    this.faceLandmarker = await FaceLandmarker.createFromOptions(visionResolver, {
      baseOptions: {
        modelAssetPath: config.faceLandmarkerModelUrl,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: config.numFaces,
      minFaceDetectionConfidence: config.minFaceDetectionConfidence,
      minFacePresenceConfidence: config.minFacePresenceConfidence,
      minTrackingConfidence: config.minFaceTrackingConfidence,
    });

    this.isInitialized = true;
  }

  public detect(videoElement: HTMLVideoElement, timestamp: number): FaceLandmarks | null {
    if (!this.faceLandmarker || !this.isInitialized) {
      return null;
    }

    try {
      const result = this.faceLandmarker.detectForVideo(videoElement, timestamp);

      if (!result || !result.faceLandmarks || result.faceLandmarks.length === 0) {
        return null;
      }

      return {
        landmarks: result.faceLandmarks.map((face) =>
          face.map((pt) => ({
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
    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.faceLandmarker = null;
    }
    this.isInitialized = false;
  }
}
