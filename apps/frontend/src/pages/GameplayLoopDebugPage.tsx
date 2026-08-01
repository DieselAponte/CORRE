import { useEffect, useState } from 'react';
import { SandwichMenu } from '../components/SandwichMenu';
import { MinigameContainer } from '../components/game/MinigameContainer';
import { LandmarksOverlay } from '../components/TestingPage/LandmarksOverlay';
import { useVision } from '../vision';
import { useGameState, usePlayerState, useWaveState } from '../hooks/useGameCoreStores';
import { gameManager, eventBus, type Building } from 'game-core';

export function GameplayLoopDebugPage() {
  // 1. Vision Hook Integration
  const {
    videoRef,
    cameraState,
    visionStatus,
    lastGesture,
    confidence,
    lastHand,
    lastFace,
    lastPose,
    startVision,
    stopVision,
  } = useVision();

  // 2. Reactive Game Core Store Subscriptions (No state duplication)
  const gameState = useGameState();
  const playerState = usePlayerState();
  const waveState = useWaveState();

  const gameStatus = gameState.status;
  const elapsedTimeStr = gameState.formattedTime;
  const currentWaveNumber = waveState.currentWave?.number ?? 0;
  const availableBuildings = waveState.availableBuildings;
  const selectedBuilding = waveState.selectedBuilding;

  const activePlayer = Object.values(playerState.players)[0];
  const progressPercentage = activePlayer?.progress?.percentage ?? 0;
  const currentProgressDist = Math.round(activePlayer?.progress?.currentProgress ?? 0);
  const playerLives = activePlayer?.lives ?? 3;
  const playerStatus = activePlayer?.status ?? 'IDLE';
  const isMovementActive = gameManager.isMovementRunning();

  // 3. Real-Time Audit Log
  const [eventsLog, setEventsLog] = useState<Array<{ id: string; text: string; time: string }>>([]);

  useEffect(() => {
    let lastLoggedPct = -1;

    const unsubStarted = eventBus.subscribe('GAME_STARTED', (payload) => {
      logEvent(`🚀 Partida iniciada (ID: ${payload.gameId.substring(0, 12)}).`);
    });

    const unsubPlayerRunning = eventBus.subscribe('PLAYER_STARTED_RUNNING', ({ playerId }) => {
      logEvent(`🏃 Jugador (${playerId}) comenzó a correr.`);
    });

    const unsubProgress = eventBus.subscribe('PROGRESS_UPDATED', ({ percentage, currentProgress }) => {
      const pctFloor = Math.floor(percentage / 5) * 5;
      if (pctFloor > lastLoggedPct && pctFloor > 0) {
        lastLoggedPct = pctFloor;
        logEvent(`📈 Progreso: ${percentage}% (${Math.round(currentProgress)}m / 250m)`);
      }
    });

    const unsubWave = eventBus.subscribe('WAVE_REACHED', (payload) => {
      logEvent(`🎯 Oleada ${payload.waveNumber} alcanzada. Selecciona un edificio mediante gestos (GESTURE_ONE, TWO ó THREE).`);
    });

    const unsubStopped = eventBus.subscribe('MOVEMENT_STOPPED', (payload) => {
      logEvent(`⏹️ Movimiento detenido: ${payload.reason}`);
    });

    const unsubSelected = eventBus.subscribe('BUILDING_SELECTED', (payload) => {
      logEvent(`🏢 Edificio seleccionado: ${payload.building.name}`);
    });

    const unsubMinigameStart = eventBus.subscribe('MINIGAME_STARTED', (payload) => {
      logEvent(`🎮 [React] Rendering MinigameContainer: ${payload.building.name}`);
    });

    const unsubMinigameFinish = eventBus.subscribe('MINIGAME_FINISHED', () => {
      logEvent('✅ Minijuego completado. Reanudando carrera a la siguiente oleada.');
    });

    const unsubGameFinished = eventBus.subscribe('GAME_FINISHED', (payload) => {
      logEvent(
        payload.isVictory
          ? '🏆 ¡VICTORIA! Haz llegado a la meta antes de las 7:00 A.M.'
          : '💀 ¡DERROTA! Te has quedado sin vidas.'
      );
    });

    function logEvent(text: string) {
      const item = {
        id: Math.random().toString(36).substring(2, 9),
        text,
        time: new Date().toLocaleTimeString(),
      };
      setEventsLog((prev) => [item, ...prev].slice(0, 20));
    }

    return () => {
      unsubStarted();
      unsubPlayerRunning();
      unsubProgress();
      unsubWave();
      unsubStopped();
      unsubSelected();
      unsubMinigameStart();
      unsubMinigameFinish();
      unsubGameFinished();
    };
  }, []);

  // 4. Camera Gesture Recognition Integration for WAITING_BUILDING_SELECTION
  useEffect(() => {
    if (gameStatus === 'WAITING_BUILDING_SELECTION' && lastGesture !== 'NONE') {
      if (lastGesture === 'GESTURE_ONE' || lastGesture === 'GESTURE_TWO' || lastGesture === 'GESTURE_THREE') {
        const optionIndex = lastGesture === 'GESTURE_ONE' ? 0 : lastGesture === 'GESTURE_TWO' ? 1 : 2;
        const targetBuilding = availableBuildings[optionIndex];
        if (targetBuilding) {
          console.log(`[React] Gesture ${lastGesture} detected. Selecting ${targetBuilding.name}.`);
          gameManager.onBuildingSelected(targetBuilding);
        }
      }
    }
  }, [gameStatus, lastGesture, availableBuildings]);

  const handleStartMatch = async () => {
    await startVision();
    gameManager.startNewMatch('Jugador 1');
  };

  const handleResetMatch = () => {
    gameManager.resetMatch();
    stopVision();
    setEventsLog([]);
  };

  const handleSelectBuildingManual = (building: Building) => {
    console.log(`[React] Manual click selecting ${building.name}`);
    gameManager.onBuildingSelected(building);
  };

  const handleContinueMinigame = () => {
    console.log('[React] Clicking [ Continuar ] in MinigameContainer');
    gameManager.finishMinigame(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col font-sans relative">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">Gameplay Loop Completo (Sprint 4.1)</h1>
          <p className="text-sm text-slate-400">
            Estabilización del Gameplay Loop y Corrección de Integración (Timer, MinigameContainer, Recorrido)
          </p>
        </div>
        <SandwichMenu />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full space-y-6">
        {/* Match Controls & Camera Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleStartMatch}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-emerald-950 flex items-center space-x-2"
            >
              <span>▶ Iniciar Partida &amp; Cámara</span>
            </button>
            <button
              type="button"
              onClick={handleResetMatch}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-rose-950 flex items-center space-x-2"
            >
              <span>↺ Reiniciar Partida</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                cameraState === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300">Cámara: {cameraState}</span>
            <span className="text-slate-500">|</span>
            <span className="text-purple-400 font-bold">Gesto: {lastGesture}</span>
          </div>
        </div>

        {/* Live Camera Stream Container with Canvas Overlay */}
        <div className="relative aspect-video max-h-64 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center mx-auto w-full">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <LandmarksOverlay
            hands={lastHand}
            pose={lastPose}
            face={lastFace}
            enableLandmarks={visionStatus === 'RUNNING'}
          />
          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-slate-300">
            Detección Visión Activa ({confidence !== null ? `${Math.round(confidence * 100)}%` : '--'})
          </div>
        </div>

        {/* Victory / Defeat Overlay Screen */}
        {gameStatus === 'FINISHED' && (
          <div className="p-8 bg-slate-900 border-2 border-purple-500 rounded-3xl text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            {progressPercentage >= 100 ? (
              <>
                <span className="text-6xl block">🏆</span>
                <h2 className="text-4xl font-black text-emerald-400 tracking-wider">¡GANASTE!</h2>
                <p className="text-sm text-slate-300">
                  Haz completado las 5 oleadas y llegado al salón antes de las 7:00 A.M.
                </p>
              </>
            ) : (
              <>
                <span className="text-6xl block">💀</span>
                <h2 className="text-4xl font-black text-rose-500 tracking-wider">¡PERDISTE!</h2>
                <p className="text-sm text-slate-300">
                  Te has quedado sin vidas durante el recorrido hacia el salón.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={handleStartMatch}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-sm cursor-pointer shadow-lg"
            >
              Jugar de Nuevo
            </button>
          </div>
        )}

        {/* Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Estado del Juego (GameStatus)
            </span>
            <span
              className={`text-xl font-extrabold tracking-wide ${
                gameStatus === 'RUNNING'
                  ? 'text-emerald-400'
                  : gameStatus === 'WAITING_BUILDING_SELECTION'
                  ? 'text-amber-400'
                  : gameStatus === 'MINIGAME'
                  ? 'text-purple-400'
                  : 'text-slate-400'
              }`}
            >
              {gameStatus}
            </span>
            <span className="text-xs text-slate-500 font-mono mt-2">
              {gameStatus === 'WAITING_BUILDING_SELECTION'
                ? '⚡ Realiza gesto GESTURE_ONE (1), TWO (2) ó THREE (3)'
                : gameStatus === 'MINIGAME'
                ? '🎮 Pop-up de MinigameContainer activo'
                : 'Bucle en ejecución'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Movimiento del Jugador
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isMovementActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span
                className={`text-xl font-extrabold ${
                  isMovementActive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isMovementActive ? 'ACTIVO (Avanzando)' : 'DETENIDO'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-2">
              Velocidad: {isMovementActive ? '5 m/s' : '0 m/s'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Cronómetro &amp; Oleada
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-cyan-400">{elapsedTimeStr}</span>
              <span className="text-lg font-bold font-mono text-purple-300">
                Oleada: {currentWaveNumber} / 5
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-2">Tiempo Transcurrido (MM:SS)</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between font-mono">
            <span className="text-sm font-bold text-slate-300">
              Progreso del Recorrido (ProgressBar Lógica)
            </span>
            <span className="text-lg font-extrabold text-emerald-400">
              {progressPercentage}% ({currentProgressDist} / 250m)
            </span>
          </div>

          {/* Visual Progress Bar with 5 Wave Markers */}
          <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" style={{ left: '20%' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" style={{ left: '40%' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" style={{ left: '60%' }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" style={{ left: '80%' }} />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2">
            <span>Vidas Jugador 1: ❤️ {playerLives}</span>
            <span>Estado Jugador: {playerStatus}</span>
          </div>
        </div>

        {/* WAITING_BUILDING_SELECTION: Display 3 Available Buildings */}
        {gameStatus === 'WAITING_BUILDING_SELECTION' && (
          <div className="bg-slate-900 border-2 border-amber-500/80 p-6 rounded-2xl space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-400 uppercase tracking-wider">
                ⚡ Selecciona un Edificio para la Oleada {currentWaveNumber}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Usa el gesto GESTURE_ONE (1), GESTURE_TWO (2) ó GESTURE_THREE (3) frente a la cámara
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableBuildings.map((bld, idx) => (
                <button
                  key={bld.id}
                  type="button"
                  onClick={() => handleSelectBuildingManual(bld)}
                  className="bg-slate-950 border border-slate-800 hover:border-purple-500 p-4 rounded-xl text-left transition-all hover:bg-purple-950/30 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-mono text-purple-400 font-bold block mb-1">
                      Opción {idx + 1} (Gesto GESTURE_{idx === 0 ? 'ONE' : idx === 1 ? 'TWO' : 'THREE'})
                    </span>
                    <h4 className="text-base font-bold text-slate-100 group-hover:text-purple-300">
                      {bld.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono mt-3">Tipo: {bld.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-Time Event Audit Log */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Historial de Eventos del Loop
            </h3>
            <span className="text-xs text-slate-500 font-mono">EventBus Log</span>
          </div>

          {eventsLog.length > 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden max-h-48 overflow-y-auto">
              {eventsLog.map((evt) => (
                <div key={evt.id} className="p-2.5 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-300">{evt.text}</span>
                  <span className="text-slate-500 text-[11px]">{evt.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-500 text-center font-mono">
              Haz clic en "Iniciar Partida &amp; Cámara" para arrancar la prueba completa...
            </div>
          )}
        </div>
      </main>

      {/* MinigameContainer Popup Overlay during MINIGAME status */}
      {gameStatus === 'MINIGAME' && selectedBuilding && (
        <MinigameContainer
          buildingName={selectedBuilding.name}
          buildingType={selectedBuilding.type}
          currentWave={currentWaveNumber}
          onContinue={handleContinueMinigame}
        />
      )}
    </div>
  );
}

export default GameplayLoopDebugPage;
