import { SandwichMenu } from './SandwichMenu';

export function TwoPlayersView() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Header Bar */}
      <header className="relative z-10 w-full px-8 py-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Empty left spacer to maintain centered title */}
        <div className="w-12 h-12" aria-hidden="true" />

        {/* Centered Large Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-center uppercase drop-shadow-md">
          Campus Rush
        </h1>

        {/* Top Right Sandwich Menu */}
        <SandwichMenu />
      </header>

      {/* Main Game Container Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* 
          TODO: Integración futura con el motor de juego Phaser 3.
          Aquí se montará el canvas del juego (GameContainer / Phaser.Game instance)
          para soportar el gameplay en tiempo real de 2 jugadores.
        */}
        <div
          id="phaser-game-container"
          className="w-full max-w-5xl aspect-video bg-slate-900/80 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto text-2xl font-bold">
              🎮
            </div>
            <h2 className="text-2xl font-bold text-slate-200">Zona de Juego (Phaser 3 Canvas)</h2>
            <p className="text-sm text-slate-400">
              Área reservada para el renderizado del videojuego Campus Rush: 7:00 A.M.
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Campus Rush: 7:00 A.M. &bull; Modo 2 Jugadores
      </footer>
    </div>
  );
}

export default TwoPlayersView;
