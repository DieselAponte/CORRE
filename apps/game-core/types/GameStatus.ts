/**
 * GameStatus
 *
 * Representa los distintos estados del ciclo de vida general de una partida en Campus Rush: 7:00 A.M.
 */
export type GameStatus =
  | 'BOOT'
  | 'MENU'
  | 'CALIBRATION'
  | 'WAITING_SELECTION'
  | 'PLAYING_CHALLENGE'
  | 'NEXT_WAVE'
  | 'RESULTS'
  | 'GAME_OVER';
