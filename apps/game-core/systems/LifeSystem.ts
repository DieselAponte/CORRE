import type { LifeState } from '../types/LifeState';

/**
 * LifeSystem
 *
 * Sistema puro responsable de las reglas de cálculo de vidas y estados vitales de los jugadores.
 */
export interface LifeDeductionResult {
  newLives: number;
  lifeState: LifeState;
  isEliminated: boolean;
}

export class LifeSystem {
  /**
   * Deduce vidas y calcula el nuevo estado vital.
   */
  public static deductLives(currentLives: number, amount: number = 1): LifeDeductionResult {
    const newLives = Math.max(0, currentLives - amount);
    const lifeState: LifeState = newLives > 0 ? 'ALIVE' : 'DEAD';
    return {
      newLives,
      lifeState,
      isEliminated: newLives <= 0,
    };
  }

  /**
   * Evalúa si el jugador ha alcanzado la eliminación por falta de vidas.
   */
  public static isPlayerEliminated(lives: number): boolean {
    return lives <= 0;
  }
}
