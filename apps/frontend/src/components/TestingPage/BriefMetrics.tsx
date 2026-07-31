import type { CameraState, GestureType, VisionStatus } from '../../vision/types/Vision.types';

export interface BriefMetricsProps {
  cameraState: CameraState;
  visionStatus: VisionStatus;
  lastGesture: GestureType;
  confidence: number | null;
  fps: number | null;
  frameTime: number | null;
  totalLandmarks: number;
  enableFPSCounter?: boolean;
}

export function BriefMetrics({
  cameraState,
  visionStatus,
  lastGesture,
  confidence,
  fps,
  frameTime,
  totalLandmarks,
  enableFPSCounter = true,
}: BriefMetricsProps) {
  const isCameraConnected = cameraState === 'ACTIVE';

  return (
    <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-2">
          <span>⚡ Brief Metrics Dashboard</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Core Telemetry</span>
      </div>

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Camera Status */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Camera Status
          </span>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCameraConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span
              className={`text-base font-bold ${
                isCameraConnected ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isCameraConnected ? '● Connected' : '● Disconnected'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">State: {cameraState}</span>
        </div>

        {/* VisionEngine Status */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Vision Engine
          </span>
          <span
            className={`text-base font-bold ${
              visionStatus === 'RUNNING'
                ? 'text-emerald-400'
                : visionStatus === 'INITIALIZING'
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          >
            {visionStatus}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Loop: {visionStatus}</span>
        </div>

        {/* Current Gesture */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Current Gesture
          </span>
          <span
            className={`text-lg font-extrabold tracking-wide ${
              lastGesture !== 'NONE' ? 'text-purple-400' : 'text-slate-500'
            }`}
          >
            {lastGesture}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Classified Real-Time</span>
        </div>
      </div>

      {/* Numerical Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {/* FPS Counter (Controlled by enableFPSCounter flag) */}
        {enableFPSCounter ? (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-400 block text-[11px] mb-1">FPS Reales</span>
            <span className="text-xl font-extrabold text-emerald-400">
              {fps !== null ? `${fps} FPS` : '--'}
            </span>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/40 p-3 rounded-lg opacity-50">
            <span className="text-slate-500 block text-[11px] mb-1">FPS Reales</span>
            <span className="text-sm font-semibold text-slate-500">Disabled (Flag)</span>
          </div>
        )}

        {/* Frame Time (Controlled by enableFPSCounter flag) */}
        {enableFPSCounter ? (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-400 block text-[11px] mb-1">Frame Time</span>
            <span className="text-xl font-extrabold text-cyan-400">
              {frameTime !== null ? `${frameTime} ms` : '--'}
            </span>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/40 p-3 rounded-lg opacity-50">
            <span className="text-slate-500 block text-[11px] mb-1">Frame Time</span>
            <span className="text-sm font-semibold text-slate-500">Disabled (Flag)</span>
          </div>
        )}

        {/* Confidence Score */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <span className="text-slate-400 block text-[11px] mb-1">Confidence Score</span>
          <span className="text-xl font-extrabold text-purple-400">
            {confidence !== null ? `${Math.round(confidence * 100)}%` : 'N/A'}
          </span>
        </div>

        {/* Total Landmarks */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <span className="text-slate-400 block text-[11px] mb-1">Total Landmarks</span>
          <span className="text-xl font-extrabold text-amber-400">
            {totalLandmarks}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BriefMetrics;
