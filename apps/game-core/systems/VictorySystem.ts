import type { Player } from '../entities/Player';
import type { WinnerType } from '../types/WinnerType';

/**
 * VictorySystem
 *
 * Sistema puro responsable de evaluar las condiciones de victoria y determinar el ganador.
 */
export class VictorySystem {
  /**
   * Evalúa el ganador de la partida entre dos jugadores según vidas y puntaje.
   */
  public static evaluateMatchWinner(player1: Player | undefined, player2: Player | undefined): WinnerType {
    if (!player1 && !player2) return 'NONE';
    if (player1 && !player2) return 'PLAYER_ONE';
    if (!player1 && player2) return 'PLAYER_TWO';

    const p1 = player1!;
    const p2 = player2!;

    // 1. Eliminated check
    if (p1.lives <= 0 && p2.lives > 0) return 'PLAYER_TWO';
    if (p2.lives <= 0 && p1.lives > 0) return 'PLAYER_ONE';
    if (p1.lives <= 0 && p2.lives <= 0) return 'DRAW';

    // 2. Score comparison
    if (p1.score > p2.score) return 'PLAYER_ONE';
    if (p2.score > p1.score) return 'PLAYER_TWO';

    return 'DRAW';
  }
}
