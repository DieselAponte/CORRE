import type { BuildingType } from '../types/BuildingType';
import type { Challenge } from './Challenge';

/**
 * Building
 *
 * Representa un edificio disponible para selección dentro de una oleada del campus.
 */
export interface BuildingData {
  id: string;
  name: string;
  type: BuildingType;
  availableChallenges: Challenge[];
}

export class Building implements BuildingData {
  public readonly id: string;
  public readonly name: string;
  public readonly type: BuildingType;
  public availableChallenges: Challenge[];

  constructor(data: BuildingData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.availableChallenges = data.availableChallenges ?? [];
  }
}
