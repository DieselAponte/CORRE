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
   * Calcula el incremento de progreso e identifica si se superó un checkpoint.
   */
  public static calculateProgress(
    currentBar: ProgressBar,
    increment: number,
    checkpointInterval: number = 25
  ): ProgressUpdateResult {
    const newProgress = Math.min(currentBar.maximumProgress, currentBar.currentProgress + increment);
    const percentage = Math.round((newProgress / currentBar.maximumProgress) * 100);
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
