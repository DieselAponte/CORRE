/**
 * Score
 *
 * Representa la puntuación final y métricas de desempeño de un jugador en la partida.
 */
export interface ScoreData {
  playerId: string;
  remainingLives: number;
  completionTime: number;
  points: number;
}

export class Score implements ScoreData {
  public readonly playerId: string;
  public remainingLives: number;
  public completionTime: number;
  public points: number;

  constructor(data: ScoreData) {
    this.playerId = data.playerId;
    this.remainingLives = data.remainingLives ?? 0;
    this.completionTime = data.completionTime ?? 0;
    this.points = data.points ?? 0;
  }
}
