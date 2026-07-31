import type { WaveType } from '../types/WaveType';
import type { Building } from './Building';

/**
 * Wave
 *
 * Representa una oleada del recorrido dentro del mapa del campus.
 */
export interface WaveData {
  number: number;
  type: WaveType;
  buildings: Building[];
  completed: boolean;
}

export class Wave implements WaveData {
  public readonly number: number;
  public readonly type: WaveType;
  public buildings: Building[];
  public completed: boolean;

  constructor(data: WaveData) {
    this.number = data.number;
    this.type = data.type;
    this.buildings = data.buildings ?? [];
    this.completed = data.completed ?? false;
  }
}
