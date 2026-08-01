import type { ChallengeType } from '../../types/ChallengeType';
import type { BuildingType } from '../../types/BuildingType';

/**
 * MinigameConfig
 *
 * Configuración requerida para la inicialización de cualquier minijuego.
 */
export interface MinigameConfig {
  id: string;
  name: string;
  type: ChallengeType;
  timeLimit: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  buildingType?: BuildingType;
  customOptions?: Record<string, unknown>;
}
