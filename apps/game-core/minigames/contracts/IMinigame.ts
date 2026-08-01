import type { ChallengeType } from '../../types/ChallengeType';
import type { GestureType } from '../../types/GestureType';
import type { MinigameConfig } from './MinigameConfig';
import type { MinigameResult } from './MinigameResult';
import type { MinigameStatus } from './MinigameStatus';

/**
 * IMinigame
 *
 * Contrato común e interfaz fundamental para todos los minijuegos de Campus Rush: 7:00 A.M.
 * Define el ciclo de vida esperado para cualquier minijuego o desafío individual o versus.
 */
export interface IMinigame {
  readonly id: string;
  readonly name: string;
  readonly type: ChallengeType;
  readonly status: MinigameStatus;

  /**
   * Inicializa el minijuego con la configuración recibida.
   */
  init(config: MinigameConfig): void;

  /**
   * Arranca la ejecución activa del minijuego.
   */
  start(): void;

  /**
   * Pausa temporalmente la ejecución del minijuego.
   */
  pause(): void;

  /**
   * Reanuda la ejecución del minijuego.
   */
  resume(): void;

  /**
   * Actualización por cada ciclo/frame de tiempo.
   * @param deltaTime Tiempo transcurrido en segundos desde el último frame.
   */
  update(deltaTime: number): void;

  /**
   * Callback invocado al recibir una entrada gestual desde el módulo de visión.
   * @param gesture Gesto detectado por visión por computadora.
   * @param playerId Identificador opcional del jugador que realizó el gesto.
   */
  onGesture(gesture: GestureType, playerId?: string): void;

  /**
   * Concluye la ejecución del minijuego y genera el resultado final.
   * @param success Indica si el minijuego fue completado con éxito.
   */
  finish(success?: boolean): MinigameResult;

  /**
   * Destruye la instancia y libera recursos o suscriptores.
   */
  destroy(): void;
}

export type MinigameConstructor = new (config: MinigameConfig) => IMinigame;
