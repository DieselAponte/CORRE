import { SandwichMenu } from '../components/SandwichMenu';

export function CreditsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col">
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-purple-400">Créditos</h1>
        <SandwichMenu />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
          <div className="text-4xl">🏆</div>
          <h2 className="text-2xl font-bold text-slate-200">Campus Rush: 7:00 A.M.</h2>
          <p className="text-slate-400 text-sm">
            Desarrollado para interacción 100% visión por computadora.
          </p>
        </div>
      </main>
    </div>
  );
}

export default CreditsPage;
