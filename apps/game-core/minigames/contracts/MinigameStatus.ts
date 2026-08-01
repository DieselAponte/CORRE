/**
 * MinigameStatus
 *
 * Estados posibles en el ciclo de vida de un minijuego.
 */
export type MinigameStatus =
  | 'UNINITIALIZED'
  | 'INITIALIZED'
  | 'RUNNING'
  | 'PAUSED'
  | 'FINISHED'
  | 'DESTROYED';
