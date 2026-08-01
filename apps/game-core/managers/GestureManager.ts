import { eventBus } from '../events/EventBus';
import { visionStateStore } from '../state/VisionState';
import { gameStateStore } from '../state/GameState';
import { waveStateStore } from '../state/WaveState';
import { SelectionSystem } from '../systems/SelectionSystem';
import type { GestureType } from '../types/GestureType';

/**
 * GestureManager
 *
 * Escucha eventos provenientes del módulo de visión (GESTURE_RECEIVED) y los transforma en selección de edificios durante la fase WAITING_BUILDING_SELECTION.
 */
export class GestureManager {
  private static instance: GestureManager | null = null;
  private unsubscribers: Array<() => void> = [];

  public static getInstance(): GestureManager {
    if (!GestureManager.instance) {
      GestureManager.instance = new GestureManager();
    }
    return GestureManager.instance;
  }

  public initialize(): void {
    this.cleanUp();

    this.unsubscribers.push(
      eventBus.subscribe('GESTURE_RECEIVED', ({ gesture, confidence, playerId }) => {
        this.processGesture(gesture, confidence, playerId);
      })
    );
  }

  public processGesture(gesture: GestureType, confidence: number, playerId: string = 'player-1'): void {
    visionStateStore.getState().setCurrentGesture(gesture);
    visionStateStore.getState().setConfidence(confidence);

    const currentStatus = gameStateStore.getState().status;
    if (currentStatus !== 'WAITING_BUILDING_SELECTION') {
      return;
    }

    const optionIndex = SelectionSystem.mapGestureToOptionIndex(gesture);
    if (optionIndex !== null) {
      const buildings = waveStateStore.getState().availableBuildings;
      const targetBuilding = buildings[optionIndex];

      if (targetBuilding && SelectionSystem.isValidSelection(targetBuilding.id, buildings)) {
        eventBus.publish('BUILDING_SELECTED', {
          playerId,
          building: targetBuilding,
          timestamp: Date.now(),
        });
      }
    }
  }

  public cleanUp(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }
}

export const gestureManager = GestureManager.getInstance();
