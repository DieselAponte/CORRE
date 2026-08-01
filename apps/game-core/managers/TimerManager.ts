import { gameStateStore } from '../state/GameState';

/**
 * TimerManager
 *
 * Administra el tiempo transcurrido del juego dependiendo exclusivamente del deltaTime recibido en cada tick.
 * No utiliza setInterval ni setTimeout internos (Único Reloj del Juego).
 */
export class TimerManager {
  private static instance: TimerManager | null = null;
  private elapsedTime: number = 0;
  private isRunning: boolean = false;

  public static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  public startTimer(): void {
    this.elapsedTime = 0;
    this.isRunning = true;
    gameStateStore.getState().setElapsedTime(0, '00:00');
  }

  /**
   * Avanza el tiempo transcurrido mediante el deltaTime global del bucle.
   * @param deltaTime Tiempo en segundos transcurrido desde el último tick.
   */
  public tick(deltaTime: number): void {
    if (!this.isRunning) return;

    this.elapsedTime += deltaTime;
    const formatted = this.getFormattedElapsedTime();
    gameStateStore.getState().setElapsedTime(this.elapsedTime, formatted);
  }

  public getElapsedTime(): number {
    return Math.round(this.elapsedTime * 100) / 100;
  }

  public getFormattedElapsedTime(): string {
    const totalSeconds = Math.floor(this.elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  public pauseTimer(): void {
    this.isRunning = false;
  }

  public resumeTimer(): void {
    this.isRunning = true;
  }

  public reset(): void {
    this.elapsedTime = 0;
    this.isRunning = false;
    gameStateStore.getState().setElapsedTime(0, '00:00');
  }
}

export const timerManager = TimerManager.getInstance();
