/**
 * GameEventType
 *
 * Representa la taxonomía de eventos del dominio del juego.
 */
export type GameEventType =
  | 'GAME_START'
  | 'GAME_PAUSE'
  | 'WAVE_START'
  | 'WAVE_COMPLETE'
  | 'SELECTION_MADE'
  | 'CHALLENGE_START'
  | 'CHALLENGE_END'
  | 'LIFE_LOST'
  | 'GAME_OVER';
