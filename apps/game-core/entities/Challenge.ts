import type { ChallengeType } from '../types/ChallengeType';

/**
 * Challenge
 *
 * Representa un desafío o minijuego individual o versus dentro del juego.
 * Mantiene únicamente el estado del dominio sin lógica de presentación.
 */
export interface ChallengeData {
  id: string;
  name: string;
  type: ChallengeType;
  timeLimit: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  completed: boolean;
}

export class Challenge implements ChallengeData {
  public readonly id: string;
  public readonly name: string;
  public readonly type: ChallengeType;
  public readonly timeLimit: number;
  public readonly difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  public completed: boolean;

  constructor(data: ChallengeData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.timeLimit = data.timeLimit;
    this.difficulty = data.difficulty;
    this.completed = data.completed ?? false;
  }
}
