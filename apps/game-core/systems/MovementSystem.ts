import type { Position2D } from '../entities/Player';
import type { DirectionType } from '../types/DirectionType';

/**
 * MovementSystem
 *
 * Sistema puro responsable de calcular el movimiento automático y desplazamiento de los jugadores.
 * No almacena estado ni realiza renderizado.
 */
export interface MovementOptions {
  speed: number;
  deltaTime: number;
  minBounds?: Position2D;
  maxBounds?: Position2D;
}

export class MovementSystem {
  /**
   * Calcula el incremento lineal de distancia recorrida por unidad de tiempo (deltaTime).
   */
  public static calculateDistanceIncrement(speed: number, deltaTime: number): number {
    return Math.max(0, speed * deltaTime);
  }

  /**
   * Calcula la nueva posición de un objeto en base a una dirección y velocidad.
   */
  public static calculateNewPosition(
    currentPos: Position2D,
    direction: DirectionType,
    options: MovementOptions
  ): Position2D {
    const distance = options.speed * options.deltaTime;
    let newX = currentPos.x;
    let newY = currentPos.y;

    switch (direction) {
      case 'LEFT':
        newX -= distance;
        break;
      case 'RIGHT':
        newX += distance;
        break;
      case 'UP':
        newY -= distance;
        break;
      case 'DOWN':
        newY += distance;
        break;
      case 'NONE':
      default:
        break;
    }

    if (options.minBounds) {
      newX = Math.max(options.minBounds.x, newX);
      newY = Math.max(options.minBounds.y, newY);
    }

    if (options.maxBounds) {
      newX = Math.min(options.maxBounds.x, newX);
      newY = Math.min(options.maxBounds.y, newY);
    }

    return { x: Math.round(newX * 100) / 100, y: Math.round(newY * 100) / 100 };
  }
}
