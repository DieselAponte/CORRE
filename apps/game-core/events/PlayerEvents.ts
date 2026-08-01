import type { Building } from '../entities/Building';
import type { Challenge } from '../entities/Challenge';

/**
 * PlayerEvents
 *
 * Eventos fuertemente tipados relacionados con las acciones y estados de los jugadores.
 */
export interface PlayerStartedRunningEventPayload {
  playerId: string;
  timestamp: number;
}

export interface PlayerSelectedBuildingEventPayload {
  playerId: string;
  building: Building;
  timestamp: number;
}

export interface PlayerEnteredBuildingEventPayload {
  playerId: string;
  building: Building;
  timestamp: number;
}

export interface PlayerFinishedChallengeEventPayload {
  playerId: string;
  challenge: Challenge;
  success: boolean;
  scoreGained: number;
  timestamp: number;
}

export interface PlayerLostLifeEventPayload {
  playerId: string;
  remainingLives: number;
  timestamp: number;
}

export interface PlayerGainedScoreEventPayload {
  playerId: string;
  pointsAdded: number;
  totalScore: number;
  timestamp: number;
}

export interface PlayerEliminatedEventPayload {
  playerId: string;
  timestamp: number;
}

export interface PlayerReachedGoalEventPayload {
  playerId: string;
  completionTime: number;
  timestamp: number;
}

export interface PlayerEventsMap {
  PLAYER_STARTED_RUNNING: PlayerStartedRunningEventPayload;
  PLAYER_SELECTED_BUILDING: PlayerSelectedBuildingEventPayload;
  PLAYER_ENTERED_BUILDING: PlayerEnteredBuildingEventPayload;
  PLAYER_FINISHED_CHALLENGE: PlayerFinishedChallengeEventPayload;
  PLAYER_LOST_LIFE: PlayerLostLifeEventPayload;
  PLAYER_GAINED_SCORE: PlayerGainedScoreEventPayload;
  PLAYER_ELIMINATED: PlayerEliminatedEventPayload;
  PLAYER_REACHED_GOAL: PlayerReachedGoalEventPayload;
}

export type PlayerEventName = keyof PlayerEventsMap;
