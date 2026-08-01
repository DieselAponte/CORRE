import type { IMinigame } from '../contracts/IMinigame';
import type { MinigameConfig } from '../contracts/MinigameConfig';
import type { MinigameResult } from '../contracts/MinigameResult';
import type { MinigameStatus } from '../contracts/MinigameStatus';
import type { ChallengeType } from '../../types/ChallengeType';
import type { GestureType } from '../../types/GestureType';

/**
 * BaseMinigame
 *
 * Clase base abstracta que proporciona una implementación por defecto del contrato IMinigame.
 * Maneja el estado de ciclo de vida y métricas de tiempo para facilitar el desarrollo de minijuegos concretos.
 */
export abstract class BaseMinigame implements IMinigame {
  public id: string;
  public name: string;
  public type: ChallengeType;
  public status: MinigameStatus = 'UNINITIALIZED';

  protected config!: MinigameConfig;
  protected elapsedTime: number = 0;
  protected remainingTime: number = 0;

  constructor(config: MinigameConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.init(config);
  }

  public init(config: MinigameConfig): void {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.remainingTime = config.timeLimit;
    this.elapsedTime = 0;
    this.status = 'INITIALIZED';
    this.onInit(config);
  }

  public start(): void {
    if (this.status === 'RUNNING') return;
    this.status = 'RUNNING';
    this.onStart();
  }

  public pause(): void {
    if (this.status !== 'RUNNING') return;
    this.status = 'PAUSED';
    this.onPause();
  }

  public resume(): void {
    if (this.status !== 'PAUSED') return;
    this.status = 'RUNNING';
    this.onResume();
  }

  public update(deltaTime: number): void {
    if (this.status !== 'RUNNING') return;

    this.elapsedTime += deltaTime;
    this.remainingTime = Math.max(0, this.remainingTime - deltaTime);

    this.onUpdate(deltaTime);

    if (this.remainingTime <= 0) {
      this.finish(false);
    }
  }

  public onGesture(gesture: GestureType, playerId?: string): void {
    if (this.status !== 'RUNNING') return;
    this.handleGesture(gesture, playerId);
  }

  public finish(success: boolean = true): MinigameResult {
    this.status = 'FINISHED';
    const bonus = success ? this.calculateScoreBonus() : 0;
    const result: MinigameResult = {
      minigameId: this.id,
      success,
      scoreBonus: bonus,
      timeSpent: Math.round(this.elapsedTime * 100) / 100,
      timeRemaining: Math.round(this.remainingTime * 100) / 100,
    };
    this.onFinish(result);
    return result;
  }

  public destroy(): void {
    this.status = 'DESTROYED';
    this.onDestroy();
  }

  protected calculateScoreBonus(): number {
    let base = 100;
    if (this.config.difficulty === 'MEDIUM') base = 200;
    if (this.config.difficulty === 'HARD') base = 350;
    return base + Math.round(this.remainingTime * 10);
  }

  // Template methods optional hooks for subclasses
  protected onInit(_config: MinigameConfig): void {}
  protected onStart(): void {}
  protected onPause(): void {}
  protected onResume(): void {}
  protected onUpdate(_deltaTime: number): void {}
  protected handleGesture(_gesture: GestureType, _playerId?: string): void {}
  protected onFinish(_result: MinigameResult): void {}
  protected onDestroy(): void {}
}
