import { eventBus } from '../events/EventBus';
import { playerStateStore } from '../state/PlayerState';
import { Player } from '../entities/Player';
import { LifeSystem } from '../systems/LifeSystem';
import { MovementSystem } from '../systems/MovementSystem';
import type { DirectionType } from '../types/DirectionType';

/**
 * PlayerManager
 *
 * Coordinador de jugadores. Administra ambos jugadores y sus actualizaciones de vida y movimiento.
 */
export class PlayerManager {
  private static instance: PlayerManager | null = null;
  private unsubscribers: Array<() => void> = [];

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

  public registerPlayer(id: string, name: string): Player {
    const player = new Player({ id, name, status: 'IDLE', lives: 3, score: 0 });
    playerStateStore.getState().setPlayer(player);
    return player;
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

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const playerManager = PlayerManager.getInstance();
