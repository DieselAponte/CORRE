import type { BuildingType } from '../../types/BuildingType';
import type { IMinigame } from '../contracts/IMinigame';
import type { MinigameConfig } from '../contracts/MinigameConfig';
import { minigameRegistry } from '../registry/MinigameRegistry';
import { DummyMinigame } from '../implementations/DummyMinigame';

/**
 * MinigameFactory
 *
 * Fábrica encargada de instanciar dinámicamente minijuegos basados en registros previos sin acoplamiento.
 */
export class MinigameFactory {
  /**
   * Crea una instancia de minijuego para un edificio específico.
   * Si no se encuentra un minijuego registrado, genera una instancia de respaldo (DummyMinigame).
   */
  public static create(
    buildingType: BuildingType,
    configOverrides: Partial<MinigameConfig> = {}
  ): IMinigame {
    const Constructor = minigameRegistry.get(buildingType) ?? DummyMinigame;

    const defaultConfig: MinigameConfig = {
      id: `minigame-${buildingType.toLowerCase()}-${Date.now()}`,
      name: `Desafío ${buildingType}`,
      type: 'INDIVIDUAL',
      timeLimit: 15,
      difficulty: 'MEDIUM',
      buildingType,
      ...configOverrides,
    };

    return new Constructor(defaultConfig);
  }

  /**
   * Crea una instancia de minijuego directamente por su ID de registro.
   */
  public static createById(minigameId: string, config: MinigameConfig): IMinigame {
    const Constructor = minigameRegistry.get(minigameId) ?? DummyMinigame;
    return new Constructor(config);
  }
}
