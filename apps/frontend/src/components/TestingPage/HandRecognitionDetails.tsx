import type { RecognitionDetails } from '../../vision/gestures/Gesture.types';

export interface HandRecognitionDetailsProps {
  recognitionDetails: RecognitionDetails | null;
}

export function HandRecognitionDetails({ recognitionDetails }: HandRecognitionDetailsProps) {
  return (
    <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
          <span>🖐️ Hand Recognition Details &amp; Rules Audit</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Classification Rationale</span>
      </div>

      {recognitionDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Extended & Folded Fingers */}
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-emerald-400 font-semibold block mb-1.5">
                Extended Fingers ({recognitionDetails.extendedFingers.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recognitionDetails.extendedFingers.length > 0 ? (
                  recognitionDetails.extendedFingers.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[11px]">
                      {f}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Ninguno</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-rose-400 font-semibold block mb-1.5">
                Folded Fingers ({recognitionDetails.foldedFingers.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recognitionDetails.foldedFingers.length > 0 ? (
                  recognitionDetails.foldedFingers.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[11px]">
                      {f}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">Ninguno</span>
                )}
              </div>
            </div>
          </div>

          {/* Rules Performance */}
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 font-semibold">Rules Performance:</span>
              <span className="text-purple-400 font-bold">
                {recognitionDetails.rulesMatchedCount} / {recognitionDetails.totalRulesCount} Matched
              </span>
            </div>

            {recognitionDetails.rulesMatched.length > 0 && (
              <div>
                <span className="text-emerald-400 font-semibold block text-[11px] mb-1">
                  ✓ Rules Matched:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {recognitionDetails.rulesMatched.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {recognitionDetails.rulesFailed.length > 0 && (
              <div>
                <span className="text-amber-400 font-semibold block text-[11px] mb-1">
                  ⚠ Rules Failed / Warnings:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-amber-300">
                  {recognitionDetails.rulesFailed.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-mono">
          Esperando detección activa para desglosar reglas de reconocimiento de manos...
        </p>
      )}
    </div>
  );
}

export default HandRecognitionDetails;
