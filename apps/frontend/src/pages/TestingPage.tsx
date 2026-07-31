import { SandwichMenu } from '../components/SandwichMenu';
import { useVision } from '../vision';
import { OutputVisionModule } from '../components/TestingPage/OutputVisionModule';
import { LandmarksOverlay } from '../components/TestingPage/LandmarksOverlay';

export function TestingPage() {
  const {
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
    lastHand,
    lastFace,
    lastPose,
    eventsHistory,
    errorMessage,
    startVision,
    stopVision,
  } = useVision();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">Página de Prueba y Auditoría</h1>
          <p className="text-sm text-slate-400">
            Diagnóstico completo en tiempo real del módulo de visión computacional
          </p>
        </div>
        <SandwichMenu />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full space-y-6">
        {/* Main Controls & Debug Flags Toggles */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={startVision}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
              >
                Iniciar Cámara &amp; Visión
              </button>
              <button
                type="button"
                onClick={stopVision}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
              >
                Detener Visión
              </button>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/60 border border-purple-800/50 px-3 py-1 rounded-full">
              VisionConfig Debug Controls
            </span>
          </div>

          {/* Interactive Checkbox Grid for VisionConfig Debug Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableLandmarks ?? true}
                onChange={(e) => updateConfig({ enableLandmarks: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableLandmarks</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableFPSCounter ?? true}
                onChange={(e) => updateConfig({ enableFPSCounter: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableFPSCounter</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableBriefMetrics ?? true}
                onChange={(e) => updateConfig({ enableBriefMetrics: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableBriefMetrics</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableObjectsDetected ?? true}
                onChange={(e) => updateConfig({ enableObjectsDetected: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableObjectsDetected</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableHandRecognitionDetails ?? true}
                onChange={(e) => updateConfig({ enableHandRecognitionDetails: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableHandDetails</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableDiagnosticHistory ?? true}
                onChange={(e) => updateConfig({ enableDiagnosticHistory: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableHistory</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableDebugOverlay ?? true}
                onChange={(e) => updateConfig({ enableDebugOverlay: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableDebugOverlay</span>
            </label>

            <label className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.enableLogs ?? true}
                onChange={(e) => updateConfig({ enableLogs: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-300">enableLogs</span>
            </label>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-sm">
            <strong>Error de Visión:</strong> {errorMessage}
          </div>
        )}

        {/* 1. Video Container with Canvas Landmarks Overlay */}
        <div className="relative aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
          {/* Functional Landmarks Canvas Overlay bound to config.enableLandmarks and visionStatus */}
          <LandmarksOverlay
            hands={lastHand}
            pose={lastPose}
            face={lastFace}
            enableLandmarks={visionStatus === 'RUNNING' && (config.enableLandmarks ?? true) && (config.enableDebugOverlay ?? true)}
          />
        </div>

        {/* 2. OutputVisionModule positioned directly below the video */}
        <OutputVisionModule
          cameraState={cameraState}
          visionStatus={visionStatus}
          config={config}
          lastGesture={lastGesture}
          confidence={confidence}
          fps={fps}
          frameTime={frameTime}
          recognitionDetails={recognitionDetails}
          lastHand={lastHand}
          lastFace={lastFace}
          lastPose={lastPose}
          eventsHistory={eventsHistory}
        />
      </main>
    </div>
  );
}

export default TestingPage;
