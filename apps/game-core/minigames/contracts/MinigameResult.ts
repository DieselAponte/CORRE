/**
 * MinigameResult
 *
 * Resultado y métricas de desempeño generadas tras la finalización de un minijuego.
 */
export interface MinigameResult {
  minigameId: string;
  success: boolean;
  scoreBonus: number;
  timeSpent: number;
  timeRemaining: number;
  details?: Record<string, unknown>;
}
