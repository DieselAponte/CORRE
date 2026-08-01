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

  public static getInstance(): WaveManager {
    if (!WaveManager.instance) {
      WaveManager.instance = new WaveManager();
    }
    return WaveManager.instance;
  }

  public initialize(): void {
    this.cleanUp();

    this.unsubscribers.push(
      eventBus.subscribe('NEXT_WAVE', ({ wave }) => {
        waveStateStore.getState().setCurrentWave(wave);
        waveStateStore.getState().setAvailableBuildings(wave.buildings);
      })
    );
  }

  public startWave(waveNumber: number, buildings: Building[]): Wave {
    const wave = new Wave({
      number: waveNumber,
      type: waveNumber === 1 ? 'WAVE_ONE' : waveNumber === 2 ? 'WAVE_TWO' : 'WAVE_THREE',
      buildings,
      completed: false,
    });

    waveStateStore.getState().setCurrentWave(wave);
    waveStateStore.getState().setAvailableBuildings(buildings);
    eventBus.publish('NEXT_WAVE', { wave, timestamp: Date.now() });

    return wave;
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const waveManager = WaveManager.getInstance();
