import { eventBus } from '../events/EventBus';
import { playerStateStore } from '../state/PlayerState';
import { Player } from '../entities/Player';
import { LifeSystem } from '../systems/LifeSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { ProgressSystem } from '../systems/ProgressSystem';
import type { DirectionType } from '../types/DirectionType';

/**
 * PlayerManager
 *
 * Administra el estado del jugador, vidas, progreso y actualización de posición lógica.
 */
export class PlayerManager {
  private static instance: PlayerManager | null = null;
  private unsubscribers: Array<() => void> = [];
  private activePlayerId: string | null = null;

  public static getInstance(): PlayerManager {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager();
    }
    return PlayerManager.instance;
  }

  public initialize(): void {
    this.cleanUp();

    this.unsubscribers.push(
      eventBus.subscribe('PLAYER_LOST_LIFE', ({ playerId }) => {
        this.handlePlayerLostLife(playerId);
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('PLAYER_STARTED_RUNNING', ({ playerId }) => {
        playerStateStore.getState().updatePlayerStatus(playerId, 'RUNNING');
      })
    );
  }

  public registerPlayer(id: string = 'player-1', name: string = 'Jugador 1'): Player {
    this.activePlayerId = id;
    const player = new Player({
      id,
      name,
      status: 'IDLE',
      lives: 3,
      score: 0,
      position: { x: 0, y: 0 },
    });
    player.progress.maximumProgress = 250;
    playerStateStore.getState().setPlayer(player);
    return player;
  }

  public updatePlayerProgress(playerId: string, deltaTime: number, speed: number = 5): void {
    const player = playerStateStore.getState().players[playerId];
    if (!player) return;

    const increment = MovementSystem.calculateDistanceIncrement(speed, deltaTime);
    const progressResult = ProgressSystem.calculateProgress(player.progress, increment);

    player.progress.currentProgress = progressResult.newProgress;
    player.progress.currentCheckpoint = progressResult.newCheckpoint;

    playerStateStore.getState().setPlayer(player);

    eventBus.publish('PROGRESS_UPDATED', {
      playerId,
      currentProgress: progressResult.newProgress,
      percentage: progressResult.percentage,
      timestamp: Date.now(),
    });
  }

  public movePlayer(playerId: string, direction: DirectionType, speed: number, deltaTime: number): void {
    const player = playerStateStore.getState().players[playerId];
    if (!player) return;

    const newPos = MovementSystem.calculateNewPosition(player.position, direction, { speed, deltaTime });
    player.position = newPos;
    playerStateStore.getState().setPlayer(player);
  }

  public handlePlayerLostLife(playerId: string): void {
    const player = playerStateStore.getState().players[playerId];
    if (!player) return;

    const result = LifeSystem.deductLives(player.lives, 1);
    playerStateStore.getState().updatePlayerLives(playerId, result.newLives);

    if (result.isEliminated) {
      playerStateStore.getState().updatePlayerStatus(playerId, 'ELIMINATED');
      eventBus.publish('PLAYER_ELIMINATED', { playerId, timestamp: Date.now() });
    }
  }

  public getActivePlayer(): Player | null {
    if (!this.activePlayerId) return null;
    return playerStateStore.getState().players[this.activePlayerId] ?? null;
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const playerManager = PlayerManager.getInstance();
