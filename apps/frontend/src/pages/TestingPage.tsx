import { useEffect, useRef, useState } from 'react';
import { SandwichMenu } from '../components/SandwichMenu';

export function TestingPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraConnected, setCameraConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraConnected(false);
        setErrorMessage('La API de cámara (getUserMedia) no está disponible en este navegador.');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraConnected(true);
        setErrorMessage(null);
      } catch (err: unknown) {
        setCameraConnected(false);
        const errorMsg = err instanceof Error ? err.message : 'Error al acceder a la cámara.';
        setErrorMessage(errorMsg);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">Página de Prueba</h1>
          <p className="text-sm text-slate-400">Pruebas de desarrollo y verificación de webcam</p>
        </div>
        <SandwichMenu />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full space-y-6">
        {/* Status Indicator */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between shadow-md">
          <span className="text-base font-medium text-slate-300">Estado de la Cámara:</span>
          <div className="flex items-center space-x-2">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                cameraConnected === true
                  ? 'bg-emerald-500 animate-pulse'
                  : cameraConnected === false
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />
            <span
              className={`text-lg font-bold ${
                cameraConnected === true
                  ? 'text-emerald-400'
                  : cameraConnected === false
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {cameraConnected === true
                ? 'Cámara conectada'
                : cameraConnected === false
                ? 'No se pudo acceder a la cámara'
                : 'Solicitando acceso a la cámara...'}
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Webcam Video Container */}
        <div className="relative aspect-video bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
          {/*
            TODO: Área preparada para integrar posteriormente la vista overlay
            y eventos del módulo de visión computacional (MediaPipe Tasks Vision).
          */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        </div>
      </main>
    </div>
  );
}

export default TestingPage;
