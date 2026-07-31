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

  // Real FPS & Frame Time Telemetry
  private frameTimestamps: number[] = [];
  private frameTimeHistory: number[] = [];
  private currentFPS = 0;
  private avgFrameTime = 0;

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

  public getConfig(): MediaPipeConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<MediaPipeConfig>): void {
    this.config = { ...this.config, ...newConfig };
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
      if (this.config.enableLogs) {
        console.log('[VisionEngine] MediaPipe Task Landmarkers successfully initialized.');
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Failed to initialize VisionEngine');
      this.setStatus('ERROR', error);
      if (this.config.enableLogs) {
        console.error('[VisionEngine] Initialization Error:', error);
      }
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
    this.frameTimestamps = [];
    this.frameTimeHistory = [];
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
      const startTime = performance.now();

      // 1. Detect MediaPipe Landmarks across modules
      const hands = this.handsDetector.detect(video, startTime);
      const pose = this.poseDetector.detect(video, startTime);
      const face = this.faceDetector.detect(video, startTime);

      // 2. Measure Frame Processing Time (TAREA 2)
      const endTime = performance.now();
      const frameDuration = Math.round((endTime - startTime) * 100) / 100;

      // Update frameTime rolling average (last 20 frames)
      this.frameTimeHistory.push(frameDuration);
      if (this.frameTimeHistory.length > 20) {
        this.frameTimeHistory.shift();
      }
      const sumFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0);
      this.avgFrameTime = Math.round((sumFrameTime / this.frameTimeHistory.length) * 10) / 10;

      // 3. Measure Real FPS (TAREA 1)
      this.frameTimestamps.push(endTime);
      const oneSecondAgo = endTime - 1000;
      this.frameTimestamps = this.frameTimestamps.filter((ts) => ts >= oneSecondAgo);
      this.currentFPS = this.frameTimestamps.length;

      if (this.config.enableLogs && frameDuration > 33) {
        console.warn(`[VisionEngine] High Frame Time detected: ${frameDuration}ms (FPS: ${this.currentFPS})`);
      }

      const frameResult: DetectionFrameResult = {
        timestamp: startTime,
        hands,
        pose,
        face,
        fps: this.currentFPS,
        frameTime: this.avgFrameTime,
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
