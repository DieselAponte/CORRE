import type { CameraConfig, CameraError, CameraStateListener } from './Camera.types';
import type { CameraState } from '../types/Vision.types';

export class CameraManager {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private state: CameraState = 'OFF';
  private config: CameraConfig;
  private listeners: Set<CameraStateListener> = new Set();

  constructor(config: CameraConfig = {}) {
    this.config = {
      width: config.width ?? 1280,
      height: config.height ?? 720,
      facingMode: config.facingMode ?? 'user',
      frameRate: config.frameRate ?? 30,
    };
  }

  public getState(): CameraState {
    return this.state;
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  public onStateChange(listener: CameraStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async start(videoElement?: HTMLVideoElement): Promise<MediaStream> {
    if (this.state === 'ACTIVE' && this.stream) {
      if (videoElement && this.videoElement !== videoElement) {
        this.bindVideoElement(videoElement);
      }
      return this.stream;
    }

    this.setState('STARTING');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const error: CameraError = {
        code: 'NOT_FOUND',
        message: 'Camera API (getUserMedia) is not supported in this browser environment.',
      };
      this.setState('ERROR', error);
      throw new Error(error.message);
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: this.config.width },
          height: { ideal: this.config.height },
          facingMode: this.config.facingMode,
          frameRate: { ideal: this.config.frameRate },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = mediaStream;

      if (videoElement) {
        this.bindVideoElement(videoElement);
      }

      this.setState('ACTIVE');
      return mediaStream;
    } catch (err: unknown) {
      const error = this.parseError(err);
      this.setState('ERROR', error);
      throw err;
    }
  }

  public bindVideoElement(videoElement: HTMLVideoElement): void {
    this.videoElement = videoElement;
    if (this.stream && this.videoElement) {
      this.videoElement.srcObject = this.stream;
      this.videoElement.play().catch((playErr: unknown) => {
        const error: CameraError = {
          code: 'NOT_READABLE',
          message: 'Failed to play video stream element.',
          originalError: playErr,
        };
        this.setState('ERROR', error);
      });
    }
  }

  public stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }

    this.setState('STOPPED');
  }

  private setState(newState: CameraState, error?: CameraError): void {
    this.state = newState;
    this.listeners.forEach((listener) => listener(newState, error));
  }

  private parseError(err: unknown): CameraError {
    const DOMExceptionErr = err as DOMException;
    if (DOMExceptionErr?.name === 'NotAllowedError' || DOMExceptionErr?.name === 'PermissionDeniedError') {
      return {
        code: 'PERMISSION_DENIED',
        message: 'Camera permission denied by user.',
        originalError: err,
      };
    }
    if (DOMExceptionErr?.name === 'NotFoundError' || DOMExceptionErr?.name === 'DevicesNotFoundError') {
      return {
        code: 'NOT_FOUND',
        message: 'No video input devices found.',
        originalError: err,
      };
    }
    if (DOMExceptionErr?.name === 'NotReadableError' || DOMExceptionErr?.name === 'TrackStartError') {
      return {
        code: 'NOT_READABLE',
        message: 'Camera device is already in use or hardware error occurred.',
        originalError: err,
      };
    }
    return {
      code: 'UNKNOWN',
      message: (err as Error)?.message || 'An unknown error occurred accessing the camera.',
      originalError: err,
    };
  }
}
