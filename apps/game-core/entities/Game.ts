import type { GameStatus } from '../types/GameStatus';
import type { WinnerType } from '../types/WinnerType';
import type { Wave } from './Wave';
import type { Player } from './Player';

/**
 * Game
 *
 * Entidad principal que representa el estado completo de una partida en Campus Rush: 7:00 A.M.
 */
export interface GameData {
  id: string;
  status: GameStatus;
  players?: Player[];
  currentWave?: Wave | null;
  remainingTime?: number;
  winner?: WinnerType;
  startedAt?: number | null;
  finishedAt?: number | null;
}

export class Game implements GameData {
  public readonly id: string;
  public status: GameStatus;
  public players: Player[];
  public currentWave: Wave | null;
  public remainingTime: number;
  public winner: WinnerType;
  public startedAt: number | null;
  public finishedAt: number | null;

  constructor(data: GameData) {
    this.id = data.id;
    this.status = data.status ?? 'BOOT';
    this.players = data.players ?? [];
    this.currentWave = data.currentWave ?? null;
    this.remainingTime = data.remainingTime ?? 0;
    this.winner = data.winner ?? 'NONE';
    this.startedAt = data.startedAt ?? null;
    this.finishedAt = data.finishedAt ?? null;
  }
}
