import { eventBus } from '../events/EventBus';
import { gameStateStore } from '../state/GameState';
import { waveStateStore } from '../state/WaveState';
import type { GameStatus } from '../types/GameStatus';
import type { Building } from '../entities/Building';
import { playerManager } from './PlayerManager';
import { waveManager } from './WaveManager';
import { gestureManager } from './GestureManager';
import { timerManager } from './TimerManager';

/**
 * GameManager
 *
 * Orquestador principal del ciclo de vida y estado de la partida en Campus Rush.
 * Flujo oficial: IDLE -> STARTING -> RUNNING -> WAITING_BUILDING_SELECTION -> MINIGAME -> RUNNING -> ... -> FINISHED.
 */
export class GameManager {
  private static instance: GameManager | null = null;
  private unsubscribers: Array<() => void> = [];
  private isMovementActive: boolean = false;
  private tickIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastTickTime: number = 0;

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public initialize(): void {
    this.cleanUp();
    this.setGameStatus('IDLE');

    // Subscribe to EventBus transitions
    this.unsubscribers.push(
      eventBus.subscribe('WAVE_REACHED', ({ waveNumber }) => {
        console.log(`[GameManager] Wave ${waveNumber} reached. Stopping movement for building selection.`);
        this.stopMovement(`Wave ${waveNumber} reached`);
        this.setGameStatus('WAITING_BUILDING_SELECTION');
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('BUILDING_SELECTED', ({ building }) => {
        console.log(`[EventBus] BUILDING_SELECTED received: ${building.name}`);
        this.onBuildingSelected(building);
      })
    );

    this.unsubscribers.push(
      eventBus.subscribe('PLAYER_ELIMINATED', () => {
        console.log('[GameManager] Player eliminated. Transitioning to Defeat state.');
        this.handleDefeat('Player lost all lives');
      })
    );
  }

  public startNewMatch(playerName: string = 'Jugador 1'): void {
    console.log('[GameManager] Starting new match...');
    this.stopLoop();
    this.initialize();

    // 1. Set status to STARTING
    this.setGameStatus('STARTING');

    // 2. Initialize Managers
    playerManager.initialize();
    waveManager.initialize();
    gestureManager.initialize();
    timerManager.startTimer();

    // 3. Register Player
    const player = playerManager.registerPlayer('player-1', playerName);

    // 4. Set status to RUNNING and activate movement
    this.setGameStatus('RUNNING');
    this.isMovementActive = true;
    eventBus.publish('PLAYER_STARTED_RUNNING', { playerId: player.id, timestamp: Date.now() });
    eventBus.publish('GAME_STARTED', { gameId: `game-${Date.now()}`, timestamp: Date.now() });

    // 5. Start Single Clock Tick Loop
    this.startLoop();
  }

  /**
   * Único reloj del juego: avanza Timer, Movimiento y Progreso en cada tick.
   */
  public tick(deltaTime: number): void {
    const status = gameStateStore.getState().status;
    if (status !== 'RUNNING' || !this.isMovementActive) return;

    // 1. Advance Timer using single deltaTime clock
    timerManager.tick(deltaTime);

    // 2. Advance Player Progress (5 m/s runner speed)
    const player = playerManager.getActivePlayer();
    if (player) {
      playerManager.updatePlayerProgress(player.id, deltaTime, 5);

      // Check for 100% progress and Wave 5 completion for Victory
      if (player.progress.percentage >= 100 && waveManager.getCurrentWaveNumber() >= 5) {
        this.handleVictory();
      }
    }
  }

  public onBuildingSelected(building: Building): void {
    if (gameStateStore.getState().status !== 'WAITING_BUILDING_SELECTION') return;

    console.log(`[GameManager] Building selected: ${building.name}. Transitioning GameStatus -> MINIGAME.`);
    waveStateStore.getState().setSelectedBuilding(building);
    this.setGameStatus('MINIGAME');

    eventBus.publish('MINIGAME_STARTED', {
      building,
      waveNumber: waveManager.getCurrentWaveNumber(),
      timestamp: Date.now(),
    });
  }

  public finishMinigame(success: boolean = true): void {
    if (gameStateStore.getState().status !== 'MINIGAME') return;

    const currentBuilding = waveStateStore.getState().selectedBuilding;
    const buildingId = currentBuilding?.id ?? 'building-completed';

    console.log(`[GameManager] Minigame finished for ${buildingId}. Emitting MINIGAME_FINISHED.`);
    eventBus.publish('MINIGAME_FINISHED', {
      buildingId,
      success,
      timestamp: Date.now(),
    });

    waveStateStore.getState().setSelectedBuilding(null);

    // Check if game is finished at 100% or resume running to next wave
    const currentWaveNum = waveManager.getCurrentWaveNumber();
    const currentProgress = playerManager.getActivePlayer()?.progress.percentage ?? 0;

    if (currentWaveNum >= 5 && currentProgress >= 100) {
      this.handleVictory();
    } else {
      console.log('[GameManager] Resuming runner movement to next wave.');
      this.resumeMovement();
    }
  }

  public resumeMovement(): void {
    this.setGameStatus('RUNNING');
    this.isMovementActive = true;
    const player = playerManager.getActivePlayer();
    if (player) {
      eventBus.publish('PLAYER_STARTED_RUNNING', { playerId: player.id, timestamp: Date.now() });
    }
  }

  public stopMovement(reason: string = 'User action'): void {
    this.isMovementActive = false;
    eventBus.publish('MOVEMENT_STOPPED', { reason, timestamp: Date.now() });
  }

  public handleVictory(): void {
    console.log('[GameManager] Victory achieved! GameStatus -> FINISHED.');
    this.stopLoop();
    this.isMovementActive = false;
    this.setGameStatus('FINISHED');
    gameStateStore.getState().setWinner('PLAYER_ONE');
    eventBus.publish('GAME_FINISHED', { winner: 'PLAYER_ONE', isVictory: true, timestamp: Date.now() });
  }

  public handleDefeat(reason: string): void {
    console.log(`[GameManager] Defeat! Reason: ${reason}. GameStatus -> FINISHED.`);
    this.stopLoop();
    this.isMovementActive = false;
    this.setGameStatus('FINISHED');
    gameStateStore.getState().setWinner('NONE');
    eventBus.publish('GAME_FINISHED', { winner: 'NONE', isVictory: false, timestamp: Date.now() });
    eventBus.publish('GAME_OVER', { reason, timestamp: Date.now() });
  }

  public isMovementRunning(): boolean {
    return this.isMovementActive;
  }

  public getSelectedBuilding(): Building | null {
    return waveStateStore.getState().selectedBuilding;
  }

  public setGameStatus(status: GameStatus): void {
    console.log(`[GameManager] GameStatus -> ${status}`);
    gameStateStore.getState().setGameStatus(status);
  }

  public resetMatch(): void {
    console.log('[GameManager] Resetting match state.');
    this.stopLoop();
    this.isMovementActive = false;
    playerManager.cleanUp();
    waveManager.reset();
    gestureManager.cleanUp();
    timerManager.reset();
    gameStateStore.getState().resetGameState();
    waveStateStore.getState().resetWaveState();
    this.setGameStatus('IDLE');
  }

  private startLoop(): void {
    this.lastTickTime = Date.now();
    this.tickIntervalId = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - this.lastTickTime) / 1000;
      this.lastTickTime = now;
      this.tick(deltaTime);
    }, 100);
  }

  private stopLoop(): void {
    if (this.tickIntervalId !== null) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  public cleanUp(): void {
    this.stopLoop();
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const gameManager = GameManager.getInstance();
