import { FilesetResolver } from '@mediapipe/tasks-vision';
import type { DetectionFrameResult, VisionStatus } from '../types/Vision.types';
import { HandsDetector } from './HandsDetector';
import { PoseDetector } from './PoseDetector';
import { FaceDetector } from './FaceDetector';
import { DEFAULT_VISION_CONFIG, type MediaPipeConfig } from './VisionConfig';

export type FrameResultCallback = (result: DetectionFrameResult) => void;
export type VisionStatusCallback = (status: VisionStatus, error?: Error) => void;

export class VisionEngine {
  private handsDetector: HandsDetector;
  private poseDetector: PoseDetector;
  private faceDetector: FaceDetector;
  private config: MediaPipeConfig;

  private status: VisionStatus = 'UNINITIALIZED';
  private animFrameId: number | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private lastVideoTime = -1;

  private frameListeners: Set<FrameResultCallback> = new Set();
  private statusListeners: Set<VisionStatusCallback> = new Set();

  constructor(config: Partial<MediaPipeConfig> = {}) {
    this.config = { ...DEFAULT_VISION_CONFIG, ...config };
    this.handsDetector = new HandsDetector();
    this.poseDetector = new PoseDetector();
    this.faceDetector = new FaceDetector();
  }

  public getStatus(): VisionStatus {
    return this.status;
  }

  public onFrameResult(callback: FrameResultCallback): () => void {
    this.frameListeners.add(callback);
    return () => {
      this.frameListeners.delete(callback);
    };
  }

  public onStatusChange(callback: VisionStatusCallback): () => void {
    this.statusListeners.add(callback);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  public async initialize(): Promise<void> {
    if (this.status === 'READY' || this.status === 'RUNNING') {
      return;
    }

    this.setStatus('INITIALIZING');

    try {
      const visionResolver = await FilesetResolver.forVisionTasks(this.config.wasmLoaderPath);

      await Promise.all([
        this.handsDetector.initialize(visionResolver, this.config),
        this.poseDetector.initialize(visionResolver, this.config),
        this.faceDetector.initialize(visionResolver, this.config),
      ]);

      this.setStatus('READY');
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Failed to initialize VisionEngine');
      this.setStatus('ERROR', error);
      throw error;
    }
  }

  public startLoop(videoElement: HTMLVideoElement): void {
    if (this.status !== 'READY' && this.status !== 'PAUSED') {
      if (this.status === 'UNINITIALIZED') {
        throw new Error('VisionEngine must be initialized before starting detection loop.');
      }
    }

    this.videoElement = videoElement;
    this.setStatus('RUNNING');
    this.lastVideoTime = -1;
    this.processFrame();
  }

  public stopLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.videoElement = null;

    if (this.status === 'RUNNING') {
      this.setStatus('PAUSED');
    }
  }

  public destroy(): void {
    this.stopLoop();
    this.handsDetector.close();
    this.poseDetector.close();
    this.faceDetector.close();
    this.frameListeners.clear();
    this.statusListeners.clear();
    this.setStatus('UNINITIALIZED');
  }

  private processFrame = (): void => {
    if (this.status !== 'RUNNING' || !this.videoElement) {
      return;
    }

    const video = this.videoElement;

    if (video.readyState >= 2 && video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = video.currentTime;
      const timestamp = performance.now();

      const hands = this.handsDetector.detect(video, timestamp);
      const pose = this.poseDetector.detect(video, timestamp);
      const face = this.faceDetector.detect(video, timestamp);

      const frameResult: DetectionFrameResult = {
        timestamp,
        hands,
        pose,
        face,
      };

      this.frameListeners.forEach((listener) => listener(frameResult));
    }

    this.animFrameId = requestAnimationFrame(this.processFrame);
  };

  private setStatus(newStatus: VisionStatus, error?: Error): void {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(newStatus, error));
  }
}
