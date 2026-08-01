import { eventBus } from '../events/EventBus';
import { gameStateStore } from '../state/GameState';
import { playerStateStore } from '../state/PlayerState';
import type { GameStatus } from '../types/GameStatus';
import { VictorySystem } from '../systems/VictorySystem';

/**
 * GameManager
 *
 * Coordinador principal de la partida.
 * Escucha eventos del ciclo de vida, coordina los stores globales e invoca VictorySystem para determinar ganadores.
 */
export class GameManager {
  private static instance: GameManager | null = null;
  private unsubscribers: Array<() => void> = [];

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public initialize(): void {
    this.cleanUp();

    this.unsubscribers.push(
      eventBus.subscribe('GAME_BOOT', () => {
        this.setGameStatus('BOOT');
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('GAME_STARTED', () => {
        this.setGameStatus('PLAYING_CHALLENGE');
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('GAME_PAUSED', () => {
        this.setGameStatus('WAITING_SELECTION');
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('GAME_OVER', () => {
        this.evaluateWinnerAndEnd();
      })
    );
  }

  public setGameStatus(status: GameStatus): void {
    gameStateStore.getState().setGameStatus(status);
  }

  public evaluateWinnerAndEnd(): void {
    const players = playerStateStore.getState().players;
    const playerList = Object.values(players);
    const winner = VictorySystem.evaluateMatchWinner(playerList[0], playerList[1]);

    gameStateStore.getState().setWinner(winner);
    gameStateStore.getState().setGameStatus('GAME_OVER');
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const gameManager = GameManager.getInstance();
