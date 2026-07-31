/**
 * PlayerStatus
 *
 * Representa el estado individual de un jugador durante el flujo de juego.
 */
export type PlayerStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'SELECTING'
  | 'PLAYING'
  | 'WAITING'
  | 'FINISHED'
  | 'ELIMINATED';
