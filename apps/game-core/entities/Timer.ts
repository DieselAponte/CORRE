/**
 * Timer
 *
 * Representa el cronómetro de tiempo del juego o de un minijuego.
 */
export interface TimerData {
  initialTime: number;
  remainingTime?: number;
  isRunning?: boolean;
}

export class Timer implements TimerData {
  public initialTime: number;
  public remainingTime: number;
  public isRunning: boolean;

  constructor(data: TimerData) {
    this.initialTime = data.initialTime;
    this.remainingTime = data.remainingTime ?? data.initialTime;
    this.isRunning = data.isRunning ?? false;
  }
}
