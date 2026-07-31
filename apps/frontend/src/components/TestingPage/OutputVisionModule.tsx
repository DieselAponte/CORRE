import type {
  CameraState,
  FaceLandmarks,
  GestureType,
  HandLandmarks,
  PoseLandmarks,
  VisionEvent,
  VisionStatus,
} from '../../vision/types/Vision.types';
import type { RecognitionDetails } from '../../vision/gestures/Gesture.types';
import type { MediaPipeConfig } from '../../vision/mediapipe/VisionConfig';
import { BriefMetrics } from './BriefMetrics';
import { ObjectsDetected } from './ObjectsDetected';
import { HandRecognitionDetails } from './HandRecognitionDetails';
import { DiagnosticHistory } from './DiagnosticHistory';

export interface OutputVisionModuleProps {
  cameraState: CameraState;
  visionStatus: VisionStatus;
  config: MediaPipeConfig;
  lastGesture: GestureType;
  confidence: number | null;
  fps: number | null;
  frameTime: number | null;
  recognitionDetails: RecognitionDetails | null;
  lastHand: HandLandmarks | null;
  lastFace: FaceLandmarks | null;
  lastPose: PoseLandmarks | null;
  eventsHistory: VisionEvent[];
}

export function OutputVisionModule({
  cameraState,
  visionStatus,
  config,
  lastGesture,
  confidence,
  fps,
  frameTime,
  recognitionDetails,
  lastHand,
  lastFace,
  lastPose,
  eventsHistory,
}: OutputVisionModuleProps) {
  const totalHandLandmarks = (lastHand?.landmarks ?? []).reduce((acc, h) => acc + h.length, 0);
  const totalFaceLandmarks = (lastFace?.landmarks ?? []).reduce((acc, f) => acc + f.length, 0);
  const totalPoseLandmarks = (lastPose?.landmarks ?? []).reduce((acc, p) => acc + p.length, 0);
  const totalLandmarks = totalHandLandmarks + totalFaceLandmarks + totalPoseLandmarks;

  return (
    <section className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-purple-400 tracking-wide">
            Panel de Diagnóstico &amp; Auditoría de Visión
          </h2>
          <p className="text-xs text-slate-400">
            Modulo de diagnóstico modularizado y configurable mediante VisionConfig
          </p>
        </div>
        <span className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
          Diagnostic Suite
        </span>
      </div>

      {/* 1. BriefMetrics Section */}
      {(config.enableBriefMetrics ?? true) && (
        <BriefMetrics
          cameraState={cameraState}
          visionStatus={visionStatus}
          lastGesture={lastGesture}
          confidence={confidence}
          fps={fps}
          frameTime={frameTime}
          totalLandmarks={totalLandmarks}
          enableFPSCounter={config.enableFPSCounter ?? true}
        />
      )}

      {/* 2. ObjectsDetected Section */}
      {(config.enableObjectsDetected ?? true) && (
        <ObjectsDetected
          lastHand={lastHand}
          lastFace={lastFace}
          lastPose={lastPose}
          visionStatus={visionStatus}
          handAnalyses={recognitionDetails?.hands}
        />
      )}

      {/* 3. HandRecognitionDetails Section */}
      {(config.enableHandRecognitionDetails ?? true) && (
        <HandRecognitionDetails recognitionDetails={recognitionDetails} />
      )}

      {/* 4. DiagnosticHistory Section */}
      {(config.enableDiagnosticHistory ?? true) && (
        <DiagnosticHistory eventsHistory={eventsHistory} />
      )}
    </section>
  );
}

export default OutputVisionModule;
