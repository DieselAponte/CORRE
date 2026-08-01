import type { BuildingType } from '../../types/BuildingType';
import type { MinigameConstructor } from '../contracts/IMinigame';

/**
 * MinigameRegistry
 *
 * Registro centralizado que asocia tipos de edificio o identificadores con constructores de minijuegos.
 * Permite registrar nuevos minijuegos sin modificar el núcleo del GameCore (Principio Open/Closed).
 */
export class MinigameRegistry {
  private static instance: MinigameRegistry | null = null;
  private registry: Map<string, MinigameConstructor> = new Map();

  public static getInstance(): MinigameRegistry {
    if (!MinigameRegistry.instance) {
      MinigameRegistry.instance = new MinigameRegistry();
    }
    return MinigameRegistry.instance;
  }

  /**
   * Registra un constructor de minijuego asociado a un edificio o ID único.
   */
  public register(key: BuildingType | string, minigameConstructor: MinigameConstructor): void {
    this.registry.set(key, minigameConstructor);
  }

  /**
   * Obtiene el constructor del minijuego registrado para una clave.
   */
  public get(key: BuildingType | string): MinigameConstructor | undefined {
    return this.registry.get(key);
  }

  /**
   * Verifica si existe un minijuego registrado para la clave recibida.
   */
  public has(key: BuildingType | string): boolean {
    return this.registry.has(key);
  }

  /**
   * Elimina un registro específico.
   */
  public unregister(key: BuildingType | string): void {
    this.registry.delete(key);
  }

  /**
   * Limpia todos los registros.
   */
  public clear(): void {
    this.registry.clear();
  }
}

export const minigameRegistry = MinigameRegistry.getInstance();
