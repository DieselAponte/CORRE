import type { VisionEvent } from '../../vision/types/Vision.types';

export interface DiagnosticHistoryProps {
  eventsHistory: VisionEvent[];
}

export function DiagnosticHistory({ eventsHistory }: DiagnosticHistoryProps) {
  return (
    <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
          <span>📜 Diagnostic History Log</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Last {eventsHistory.length} / 20 Events</span>
      </div>

      {eventsHistory.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg divide-y divide-slate-800/60 overflow-hidden max-h-60 overflow-y-auto">
          {eventsHistory.map((evt) => (
            <div key={evt.id} className="p-3 text-xs flex items-center justify-between font-mono hover:bg-slate-800/40">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-semibold border border-purple-800/60 text-[11px]">
                  {evt.gesture}
                </span>
                <span className="text-slate-300">{evt.type}</span>
                {evt.payload?.confidence !== undefined && (
                  <span className="text-slate-400 text-[11px]">
                    Conf: {Math.round(Number(evt.payload.confidence) * 100)}%
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-[11px]">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-500 text-center font-mono">
          Esperando la emisión de eventos del motor de visión...
        </div>
      )}
    </div>
  );
}

export default DiagnosticHistory;
