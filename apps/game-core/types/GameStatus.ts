/**
 * GameStatus
 *
 * Representa los distintos estados del ciclo de vida de una partida en Campus Rush: 7:00 A.M.
 */
export type GameStatus =
  | 'IDLE'
  | 'STARTING'
  | 'RUNNING'
  | 'WAITING_BUILDING_SELECTION'
  | 'MINIGAME'
  | 'FINISHED'
  | 'BOOT'
  | 'MENU'
  | 'CALIBRATION'
  | 'PLAYING_CHALLENGE'
  | 'NEXT_WAVE'
  | 'RESULTS'
  | 'GAME_OVER';
