import { eventBus } from '../events/EventBus';
import { playerStateStore } from '../state/PlayerState';

/**
 * ScoreManager
 *
 * Administra el cálculo del puntaje final y acumulación de puntos por eventos.
 */
export class ScoreManager {
  private static instance: ScoreManager | null = null;
  private unsubscribers: Array<() => void> = [];

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public initialize(): void {
    this.cleanUp();

    this.unsubscribers.push(
      eventBus.subscribe('PLAYER_FINISHED_CHALLENGE', ({ playerId, scoreGained }) => {
        this.addScore(playerId, scoreGained);
      })
    );
  }

  public addScore(playerId: string, points: number): void {
    const player = playerStateStore.getState().players[playerId];
    if (!player) return;

    const newScore = player.score + points;
    playerStateStore.getState().updatePlayerScore(playerId, newScore);

    eventBus.publish('PLAYER_GAINED_SCORE', {
      playerId,
      pointsAdded: points,
      totalScore: newScore,
      timestamp: Date.now(),
    });
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const scoreManager = ScoreManager.getInstance();
