import type { BuildingType } from 'game-core';

export interface MinigameContainerProps {
  buildingName: string;
  buildingType: BuildingType;
  currentWave: number;
  onContinue: () => void;
}

export function MinigameContainer({
  buildingName,
  buildingType,
  currentWave,
  onContinue,
}: MinigameContainerProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-center transform animate-in fade-in zoom-in-95 duration-200">
        {/* Header Badges */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs">
          <span className="bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
            Oleada {currentWave} / 5
          </span>
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
            {buildingType}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-purple-400 tracking-wide">{buildingName}</h2>
          <p className="text-sm text-slate-400">Contenedor Temporal de Minijuego (MinigameContainer)</p>
        </div>

        {/* Minigame Content Placeholder Box */}
        <div className="bg-slate-950 border-2 border-dashed border-purple-800/80 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <span className="text-4xl">🎮</span>
          <p className="text-base font-bold text-slate-200 tracking-wide">
            Aquí debe ir tu minijuego
          </p>
          <p className="text-xs text-slate-400 text-center max-w-xs font-mono">
            Este contenedor recibirá las instancias de IMinigame en futuros sprints sin modificar la arquitectura del juego.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold rounded-xl text-base tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-950"
          >
            [ Continuar Carrera ]
          </button>
        </div>
      </div>
    </div>
  );
}

export default MinigameContainer;
