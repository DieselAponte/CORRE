import type { Challenge } from '../entities/Challenge';

/**
 * ChallengeSystem
 *
 * Sistema puro responsable de evaluar la resolución y éxito de los desafíos.
 */
export interface ChallengeResult {
  completed: boolean;
  scoreBonus: number;
  timeRemaining: number;
}

export class ChallengeSystem {
  /**
   * Evalúa la resolución de un desafío dado el tiempo utilizado.
   */
  public static evaluateChallenge(
    challenge: Challenge,
    timeSpent: number,
    performanceScore: number
  ): ChallengeResult {
    const timeRemaining = Math.max(0, challenge.timeLimit - timeSpent);
    const passed = timeRemaining > 0 && performanceScore >= 60;

    let baseBonus = 100;
    if (challenge.difficulty === 'MEDIUM') baseBonus = 200;
    if (challenge.difficulty === 'HARD') baseBonus = 350;

    const scoreBonus = passed ? baseBonus + Math.round(timeRemaining * 10) : 0;

    return {
      completed: passed,
      scoreBonus,
      timeRemaining,
    };
  }
}
