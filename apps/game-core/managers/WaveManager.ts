import { eventBus } from '../events/EventBus';
import { waveStateStore } from '../state/WaveState';
import { Wave } from '../entities/Wave';
import { Building } from '../entities/Building';

/**
 * WaveManager
 *
 * Coordinador de oleadas y edificios disponibles dentro de cada oleada del campus.
 */
export class WaveManager {
  private static instance: WaveManager | null = null;
  private unsubscribers: Array<() => void> = [];
  private currentWaveNumber: number = 0;
  private waveThresholds: Record<number, number> = {
    1: 20, // Wave 1 at 20%
    2: 40, // Wave 2 at 40%
    3: 60, // Wave 3 at 60%
    4: 80, // Wave 4 at 80%
    5: 100, // Wave 5 / Meta at 100%
  };

  public static getInstance(): WaveManager {
    if (!WaveManager.instance) {
      WaveManager.instance = new WaveManager();
    }
    return WaveManager.instance;
  }

  public initialize(): void {
    this.cleanUp();
    this.currentWaveNumber = 0;

    this.unsubscribers.push(
      eventBus.subscribe('PROGRESS_UPDATED', ({ percentage }) => {
        this.evaluateProgressForWave(percentage);
      })
    );
  }

  public evaluateProgressForWave(percentage: number): void {
    const nextTargetWave = this.currentWaveNumber + 1;
    if (nextTargetWave > 5) return;

    const threshold = this.waveThresholds[nextTargetWave];
    if (threshold !== undefined && percentage >= threshold) {
      this.currentWaveNumber = nextTargetWave;
      const buildings = this.generateBuildingsForWave(this.currentWaveNumber);

      const wave = new Wave({
        number: this.currentWaveNumber,
        type:
          this.currentWaveNumber === 1
            ? 'WAVE_ONE'
            : this.currentWaveNumber === 2
            ? 'WAVE_TWO'
            : this.currentWaveNumber === 3
            ? 'WAVE_THREE'
            : this.currentWaveNumber === 4
            ? 'WAVE_FOUR'
            : 'WAVE_FIVE',
        buildings,
        completed: false,
      });

      waveStateStore.getState().setCurrentWave(wave);
      waveStateStore.getState().setAvailableBuildings(buildings);

      eventBus.publish('WAVE_REACHED', { waveNumber: this.currentWaveNumber, timestamp: Date.now() });
      eventBus.publish('NEXT_WAVE', { wave, timestamp: Date.now() });
    }
  }

  public generateBuildingsForWave(waveNumber: number): Building[] {
    return [
      new Building({
        id: `bld-adm-${waveNumber}`,
        name: `Edificio de Admisión (W${waveNumber})`,
        type: 'ADMISSION',
        availableChallenges: [],
      }),
      new Building({
        id: `bld-lib-${waveNumber}`,
        name: `Biblioteca Central (W${waveNumber})`,
        type: 'LIBRARY',
        availableChallenges: [],
      }),
      new Building({
        id: `bld-caf-${waveNumber}`,
        name: `Cafetería (W${waveNumber})`,
        type: 'CAFETERIA',
        availableChallenges: [],
      }),
    ];
  }

  public getCurrentWaveNumber(): number {
    return this.currentWaveNumber;
  }

  public reset(): void {
    this.currentWaveNumber = 0;
    waveStateStore.getState().resetWaveState();
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const waveManager = WaveManager.getInstance();
