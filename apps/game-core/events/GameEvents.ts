import type { GameStatus } from '../types/GameStatus';
import type { WinnerType } from '../types/WinnerType';
import type { Wave } from '../entities/Wave';

/**
 * GameEvents
 *
 * Taxonomía de eventos fuertemente tipados relacionados con el ciclo de vida del juego.
 * Los eventos comunican hechos ocurridos sin almacenar estado ni ejecutar lógica.
 */
export interface GameBootEventPayload {
  timestamp: number;
}

export interface GameStartedEventPayload {
  gameId: string;
  timestamp: number;
}

export interface GamePausedEventPayload {
  timestamp: number;
}

export interface GameResumedEventPayload {
  timestamp: number;
}

export interface NextWaveEventPayload {
  wave: Wave;
  timestamp: number;
}

export interface GameFinishedEventPayload {
  winner: WinnerType;
  finalScore: number;
  timestamp: number;
}

export interface GameOverEventPayload {
  reason: string;
  timestamp: number;
}

export interface GameEventsMap {
  GAME_BOOT: GameBootEventPayload;
  GAME_STARTED: GameStartedEventPayload;
  GAME_PAUSED: GamePausedEventPayload;
  GAME_RESUMED: GameResumedEventPayload;
  NEXT_WAVE: NextWaveEventPayload;
  GAME_FINISHED: GameFinishedEventPayload;
  GAME_OVER: GameOverEventPayload;
}

export type GameEventName = keyof GameEventsMap;
