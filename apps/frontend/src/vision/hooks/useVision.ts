import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  CameraState,
  FaceLandmarks,
  GestureType,
  HandLandmarks,
  PoseLandmarks,
  VisionEvent,
  VisionStatus,
} from '../types/Vision.types';
import { CameraManager } from '../camera/CameraManager';
import { VisionEngine } from '../mediapipe/VisionEngine';
import { GestureRecognizer } from '../gestures/GestureRecognizer';
import { GestureMapper } from '../gestures/GestureMapper';

export interface UseVisionReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraState: CameraState;
  visionStatus: VisionStatus;
  lastGesture: GestureType;
  lastFace: FaceLandmarks | null;
  lastPose: PoseLandmarks | null;
  lastHand: HandLandmarks | null;
  lastEvent: VisionEvent | null;
  errorMessage: string | null;
  startVision: () => Promise<void>;
  stopVision: () => void;
}

export function useVision(): UseVisionReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>('OFF');
  const [visionStatus, setVisionStatus] = useState<VisionStatus>('UNINITIALIZED');
  const [lastGesture, setLastGesture] = useState<GestureType>('NONE');
  const [lastFace, setLastFace] = useState<FaceLandmarks | null>(null);
  const [lastPose, setLastPose] = useState<PoseLandmarks | null>(null);
  const [lastHand, setLastHand] = useState<HandLandmarks | null>(null);
  const [lastEvent, setLastEvent] = useState<VisionEvent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cameraManagerRef = useRef<CameraManager | null>(null);
  const visionEngineRef = useRef<VisionEngine | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const mapperRef = useRef<GestureMapper | null>(null);

  if (!cameraManagerRef.current) {
    cameraManagerRef.current = new CameraManager();
  }
  if (!visionEngineRef.current) {
    visionEngineRef.current = new VisionEngine();
  }
  if (!recognizerRef.current) {
    recognizerRef.current = new GestureRecognizer();
  }
  if (!mapperRef.current) {
    mapperRef.current = new GestureMapper();
  }

  const stopVision = useCallback(() => {
    if (visionEngineRef.current) {
      visionEngineRef.current.stopLoop();
    }
    if (cameraManagerRef.current) {
      cameraManagerRef.current.stop();
    }
  }, []);

  const startVision = useCallback(async () => {
    setErrorMessage(null);

    const cameraManager = cameraManagerRef.current;
    const visionEngine = visionEngineRef.current;
    const recognizer = recognizerRef.current;
    const mapper = mapperRef.current;

    if (!cameraManager || !visionEngine || !recognizer || !mapper) return;

    try {
      // 1. Start camera
      const videoEl = videoRef.current ?? undefined;
      await cameraManager.start(videoEl);

      // 2. Initialize engine if needed
      if (visionEngine.getStatus() === 'UNINITIALIZED') {
        await visionEngine.initialize();
      }

      // 3. Start detection loop if video element is ready
      if (videoRef.current) {
        visionEngine.startLoop(videoRef.current);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start vision system.';
      setErrorMessage(msg);
    }
  }, []);

  useEffect(() => {
    const cameraManager = cameraManagerRef.current;
    const visionEngine = visionEngineRef.current;
    const recognizer = recognizerRef.current;
    const mapper = mapperRef.current;

    if (!cameraManager || !visionEngine || !recognizer || !mapper) return;

    const unsubscribeCamera = cameraManager.onStateChange((state, error) => {
      setCameraState(state);
      if (error) {
        setErrorMessage(error.message);
      }
    });

    const unsubscribeStatus = visionEngine.onStatusChange((status, error) => {
      setVisionStatus(status);
      if (error) {
        setErrorMessage(error.message);
      }
    });

    const unsubscribeFrame = visionEngine.onFrameResult((frame) => {
      setLastHand(frame.hands);
      setLastPose(frame.pose);
      setLastFace(frame.face);

      const recogResult = recognizer.recognize(frame);
      setLastGesture(recogResult.gesture);

      const event = mapper.mapGestureToEvent(recogResult, frame);
      if (event) {
        setLastEvent(event);
      }
    });

    return () => {
      unsubscribeCamera();
      unsubscribeStatus();
      unsubscribeFrame();
      stopVision();
    };
  }, [stopVision]);

  return {
    videoRef,
    cameraState,
    visionStatus,
    lastGesture,
    lastFace,
    lastPose,
    lastHand,
    lastEvent,
    errorMessage,
    startVision,
    stopVision,
  };
}
