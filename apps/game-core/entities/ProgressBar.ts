/**
 * ProgressBar
 *
 * Representa el estado del avance lógico del jugador a través del recorrido hacia el salón.
 * No contiene ninguna dependencia o lógica de renderizado visual.
 */
export interface ProgressBarData {
  playerId: string;
  currentProgress: number;
  maximumProgress: number;
  currentCheckpoint: number;
}

export class ProgressBar {
  public readonly playerId: string;
  public currentProgress: number;
  public maximumProgress: number;
  public currentCheckpoint: number;

  constructor(data: ProgressBarData) {
    this.playerId = data.playerId;
    this.currentProgress = data.currentProgress ?? 0;
    this.maximumProgress = data.maximumProgress ?? 100;
    this.currentCheckpoint = data.currentCheckpoint ?? 0;
  }

  public get percentage(): number {
    if (this.maximumProgress <= 0) return 0;
    const calc = (this.currentProgress / this.maximumProgress) * 100;
    return Math.min(100, Math.max(0, Math.round(calc * 100) / 100));
  }
}
