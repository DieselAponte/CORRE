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
import type { RecognitionDetails } from '../gestures/Gesture.types';
import { CameraManager } from '../camera/CameraManager';
import { VisionEngine } from '../mediapipe/VisionEngine';
import { DEFAULT_VISION_CONFIG, type MediaPipeConfig } from '../mediapipe/VisionConfig';
import { GestureRecognizer } from '../gestures/GestureRecognizer';
import { GestureMapper } from '../gestures/GestureMapper';

export interface UseVisionReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraState: CameraState;
  visionStatus: VisionStatus;
  config: MediaPipeConfig;
  updateConfig: (newConfig: Partial<MediaPipeConfig>) => void;
  lastGesture: GestureType;
  confidence: number | null;
  fps: number | null;
  frameTime: number | null;
  recognitionDetails: RecognitionDetails | null;
  lastFace: FaceLandmarks | null;
  lastPose: PoseLandmarks | null;
  lastHand: HandLandmarks | null;
  lastEvent: VisionEvent | null;
  eventsHistory: VisionEvent[];
  errorMessage: string | null;
  startVision: () => Promise<void>;
  stopVision: () => void;
}

export function useVision(): UseVisionReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>('OFF');
  const [visionStatus, setVisionStatus] = useState<VisionStatus>('UNINITIALIZED');
  const [config, setConfigState] = useState<MediaPipeConfig>(DEFAULT_VISION_CONFIG);
  const [lastGesture, setLastGesture] = useState<GestureType>('NONE');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [fps, setFps] = useState<number | null>(null);
  const [frameTime, setFrameTime] = useState<number | null>(null);
  const [recognitionDetails, setRecognitionDetails] = useState<RecognitionDetails | null>(null);
  const [lastFace, setLastFace] = useState<FaceLandmarks | null>(null);
  const [lastPose, setLastPose] = useState<PoseLandmarks | null>(null);
  const [lastHand, setLastHand] = useState<HandLandmarks | null>(null);
  const [lastEvent, setLastEvent] = useState<VisionEvent | null>(null);
  const [eventsHistory, setEventsHistory] = useState<VisionEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cameraManagerRef = useRef<CameraManager | null>(null);
  const visionEngineRef = useRef<VisionEngine | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const mapperRef = useRef<GestureMapper | null>(null);

  if (!cameraManagerRef.current) {
    cameraManagerRef.current = new CameraManager();
  }
  if (!visionEngineRef.current) {
    visionEngineRef.current = new VisionEngine(config);
  }
  if (!recognizerRef.current) {
    recognizerRef.current = new GestureRecognizer();
  }
  if (!mapperRef.current) {
    mapperRef.current = new GestureMapper();
  }

  const updateConfig = useCallback((newConfig: Partial<MediaPipeConfig>) => {
    setConfigState((prev) => {
      const updated = { ...prev, ...newConfig };
      if (visionEngineRef.current) {
        visionEngineRef.current.updateConfig(updated);
      }
      return updated;
    });
  }, []);

  const stopVision = useCallback(() => {
    if (visionEngineRef.current) {
      visionEngineRef.current.stopLoop();
    }
    if (cameraManagerRef.current) {
      cameraManagerRef.current.stop();
    }
    // Clear active landmark states and telemetry metrics on stop
    setLastHand(null);
    setLastFace(null);
    setLastPose(null);
    setLastGesture('NONE');
    setConfidence(null);
    setFps(null);
    setFrameTime(null);
    setRecognitionDetails(null);
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
      setFps(frame.fps ?? null);
      setFrameTime(frame.frameTime ?? null);

      const recogResult = recognizer.recognize(frame);
      setLastGesture(recogResult.gesture);
      setConfidence(recogResult.gesture !== 'NONE' ? recogResult.confidence : null);
      setRecognitionDetails(recogResult.details ?? null);

      const event = mapper.mapGestureToEvent(recogResult, frame);
      if (event) {
        setLastEvent(event);
        setEventsHistory((prev) => [event, ...prev].slice(0, 20));
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
    config,
    updateConfig,
    lastGesture,
    confidence,
    fps,
    frameTime,
    recognitionDetails,
    lastFace,
    lastPose,
    lastHand,
    lastEvent,
    eventsHistory,
    errorMessage,
    startVision,
    stopVision,
  };
}
