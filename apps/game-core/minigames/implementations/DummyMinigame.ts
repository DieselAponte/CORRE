import { BaseMinigame } from './BaseMinigame';
import type { GestureType } from '../../types/GestureType';

/**
 * DummyMinigame
 *
 * Minijuego de prueba por defecto que demuestra la implementación del contrato IMinigame.
 * Completa el desafío exitosamente al recibir un gesto de OPEN_HAND o HAND_UP.
 */
export class DummyMinigame extends BaseMinigame {
  protected override handleGesture(gesture: GestureType, _playerId?: string): void {
    if (gesture === 'OPEN_HAND' || gesture === 'HAND_UP' || gesture === 'ONE') {
      this.finish(true);
    }
  }
}
