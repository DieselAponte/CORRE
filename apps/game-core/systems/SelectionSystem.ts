import type { Building } from '../entities/Building';
import type { GestureType } from '../types/GestureType';

/**
 * SelectionSystem
 *
 * Sistema puro responsable de validar la selección de edificios por parte de los jugadores.
 */
export class SelectionSystem {
  /**
   * Mapea un gesto numérico u ordinal a un índice de edificio disponible.
   */
  public static mapGestureToOptionIndex(gesture: GestureType): number | null {
    switch (gesture) {
      case 'ONE':
        return 0;
      case 'TWO':
        return 1;
      case 'THREE':
        return 2;
      default:
        return null;
    }
  }

  /**
   * Valida si un edificio seleccionado existe y está disponible en la lista dada.
   */
  public static isValidSelection(selectedBuildingId: string, availableBuildings: Building[]): boolean {
    return availableBuildings.some((b) => b.id === selectedBuildingId);
  }
}
