import type { GameStatus } from '../types/GameStatus';
import type { WinnerType } from '../types/WinnerType';
import type { Wave } from '../entities/Wave';
import type { Building } from '../entities/Building';

/**
 * GameEvents
 *
 * Taxonomía de eventos fuertemente tipados relacionados con el ciclo de vida del juego.
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

export interface WaveReachedEventPayload {
  waveNumber: number;
  timestamp: number;
}

export interface MovementStoppedEventPayload {
  reason: string;
  timestamp: number;
}

export interface ProgressUpdatedEventPayload {
  playerId: string;
  currentProgress: number;
  percentage: number;
  timestamp: number;
}

export interface BuildingSelectedEventPayload {
  playerId: string;
  building: Building;
  timestamp: number;
}

export interface MinigameStartedEventPayload {
  building: Building;
  waveNumber: number;
  timestamp: number;
}

export interface MinigameFinishedEventPayload {
  buildingId: string;
  success: boolean;
  timestamp: number;
}

export interface GameFinishedEventPayload {
  winner: WinnerType;
  isVictory: boolean;
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
  WAVE_REACHED: WaveReachedEventPayload;
  MOVEMENT_STOPPED: MovementStoppedEventPayload;
  PROGRESS_UPDATED: ProgressUpdatedEventPayload;
  BUILDING_SELECTED: BuildingSelectedEventPayload;
  MINIGAME_STARTED: MinigameStartedEventPayload;
  MINIGAME_FINISHED: MinigameFinishedEventPayload;
  GAME_FINISHED: GameFinishedEventPayload;
  GAME_OVER: GameOverEventPayload;
}

export type GameEventName = keyof GameEventsMap;
