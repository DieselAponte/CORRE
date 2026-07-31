import type { FaceLandmarks, HandLandmarks, PoseLandmarks, VisionStatus } from '../../vision/types/Vision.types';
import type { HandAnalysisResult } from '../../vision/gestures/Gesture.types';

export interface ObjectsDetectedProps {
  lastHand: HandLandmarks | null;
  lastFace: FaceLandmarks | null;
  lastPose: PoseLandmarks | null;
  visionStatus: VisionStatus;
  handAnalyses?: HandAnalysisResult[];
}

export function ObjectsDetected({
  lastHand,
  lastFace,
  lastPose,
  visionStatus,
  handAnalyses = [],
}: ObjectsDetectedProps) {
  const handsCount = lastHand?.landmarks?.length ?? 0;
  const facesCount = lastFace?.landmarks?.length ?? 0;
  const posesCount = lastPose?.landmarks?.length ?? 0;

  return (
    <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <span>👁️ Objects &amp; Modules Detected</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Multi-Sensor Tracking</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {/* Manos Detectadas */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
          <span className="text-slate-400 block text-[11px] mb-1">Manos Detectadas</span>
          <span className="text-lg font-bold text-purple-300">{handsCount} mano(s)</span>
          <span className="text-[10px] text-slate-500 mt-1">
            {handsCount > 0 ? `${handsCount * 21} landmarks` : 'Inactiva'}
          </span>
        </div>

        {/* Rostros Detectados */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
          <span className="text-slate-400 block text-[11px] mb-1">Rostros Detectados</span>
          <span className="text-lg font-bold text-amber-300">{facesCount} rostro(s)</span>
          <span className="text-[10px] text-slate-500 mt-1">
            {facesCount > 0 ? 'Landmarker activo' : 'Inactivo'}
          </span>
        </div>

        {/* Poses Detectadas */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
          <span className="text-slate-400 block text-[11px] mb-1">Poses Detectadas</span>
          <span className="text-lg font-bold text-emerald-300">{posesCount} pose(s)</span>
          <span className="text-[10px] text-slate-500 mt-1">
            {posesCount > 0 ? 'PoseLandmarker activo' : 'Inactiva'}
          </span>
        </div>

        {/* GestureRecognizer State */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
          <span className="text-slate-400 block text-[11px] mb-1">GestureRecognizer</span>
          <span className="text-base font-bold text-cyan-300">
            {visionStatus === 'RUNNING' ? 'Active' : 'Idle'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
            {visionStatus === 'RUNNING' ? 'Classifying frames' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Per-Hand Individual Breakdown (Multi-Hand Support) */}
      {handAnalyses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-300 font-mono block">
            Detección Individual por Mano ({handAnalyses.length} activas):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {handAnalyses.map((hand) => (
              <div key={hand.handIndex} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-400 block">{hand.handedness}:</span>
                  <span className="text-slate-300">Gesto: {hand.gesture}</span>
                </div>
                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[11px] font-bold">
                  {Math.round(hand.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ObjectsDetected;
