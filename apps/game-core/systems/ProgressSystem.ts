import type { ProgressBar } from '../entities/ProgressBar';

/**
 * ProgressSystem
 *
 * Sistema puro responsable de calcular y actualizar el progreso del recorrido del jugador.
 */
export interface ProgressUpdateResult {
  newProgress: number;
  percentage: number;
  checkpointReached: boolean;
  newCheckpoint: number;
}

export class ProgressSystem {
  /**
   * Calcula el porcentaje de avance (0 a 100).
   */
  public static computePercentage(currentDistance: number, maxDistance: number): number {
    if (maxDistance <= 0) return 0;
    const calc = (currentDistance / maxDistance) * 100;
    return Math.min(100, Math.max(0, Math.round(calc * 100) / 100));
  }

  /**
   * Calcula el incremento de progreso e identifica si se superó un checkpoint.
   */
  public static calculateProgress(
    currentBar: ProgressBar,
    increment: number,
    checkpointInterval: number = 25
  ): ProgressUpdateResult {
    const newProgress = Math.min(currentBar.maximumProgress, currentBar.currentProgress + increment);
    const percentage = this.computePercentage(newProgress, currentBar.maximumProgress);
    const newCheckpoint = Math.floor(percentage / checkpointInterval);
    const checkpointReached = newCheckpoint > currentBar.currentCheckpoint;

    return {
      newProgress,
      percentage,
      checkpointReached,
      newCheckpoint,
    };
  }
}
