import { gameStateStore } from '../state/GameState';
import { Timer } from '../entities/Timer';

/**
 * TimerManager
 *
 * Administra el tiempo restante de la partida y cuenta regresiva de desafíos.
 */
export class TimerManager {
  private static instance: TimerManager | null = null;
  private timer: Timer | null = null;

  public static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  public startTimer(seconds: number): void {
    this.timer = new Timer({ initialTime: seconds, isRunning: true });
    gameStateStore.getState().setRemainingTime(seconds);
  }

  public tick(secondsPassed: number): void {
    if (!this.timer || !this.timer.isRunning) return;

    this.timer.remainingTime = Math.max(0, this.timer.remainingTime - secondsPassed);
    gameStateStore.getState().setRemainingTime(this.timer.remainingTime);

    if (this.timer.remainingTime <= 0) {
      this.timer.isRunning = false;
    }
  }

  public stopTimer(): void {
    if (this.timer) {
      this.timer.isRunning = false;
    }
  }
}

export const timerManager = TimerManager.getInstance();
