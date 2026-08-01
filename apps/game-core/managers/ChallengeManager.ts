import { eventBus } from '../events/EventBus';
import { Challenge } from '../entities/Challenge';
import { ChallengeSystem } from '../systems/ChallengeSystem';

/**
 * ChallengeManager
 *
 * Coordinador de desafíos individuales y versus dentro de los edificios del campus.
 */
export class ChallengeManager {
  private static instance: ChallengeManager | null = null;
  private activeChallenge: Challenge | null = null;

  public static getInstance(): ChallengeManager {
    if (!ChallengeManager.instance) {
      ChallengeManager.instance = new ChallengeManager();
    }
    return ChallengeManager.instance;
  }

  public startChallenge(challenge: Challenge): void {
    this.activeChallenge = challenge;
  }

  public completeChallenge(playerId: string, timeSpent: number, performanceScore: number): void {
    if (!this.activeChallenge) return;

    const result = ChallengeSystem.evaluateChallenge(this.activeChallenge, timeSpent, performanceScore);
    this.activeChallenge.completed = result.completed;

    eventBus.publish('PLAYER_FINISHED_CHALLENGE', {
      playerId,
      challenge: this.activeChallenge,
      success: result.completed,
      scoreGained: result.scoreBonus,
      timestamp: Date.now(),
    });

    this.activeChallenge = null;
  }

  public getActiveChallenge(): Challenge | null {
    return this.activeChallenge;
  }
}

export const challengeManager = ChallengeManager.getInstance();
