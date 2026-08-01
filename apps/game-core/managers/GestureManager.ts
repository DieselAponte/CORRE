import { eventBus } from '../events/EventBus';
import { visionStateStore } from '../state/VisionState';
import { SelectionSystem } from '../systems/SelectionSystem';
import { waveStateStore } from '../state/WaveState';
import type { GestureType } from '../types/GestureType';

/**
 * GestureManager
 *
 * Escucha eventos provenientes del módulo de visión (GESTURE_RECEIVED) y los transforma en acciones del juego.
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

  public processGesture(gesture: GestureType, confidence: number, playerId?: string): void {
    visionStateStore.getState().setCurrentGesture(gesture);
    visionStateStore.getState().setConfidence(confidence);

    const optionIndex = SelectionSystem.mapGestureToOptionIndex(gesture);
    if (optionIndex !== null && playerId) {
      const buildings = waveStateStore.getState().availableBuildings;
      const targetBuilding = buildings[optionIndex];

      if (targetBuilding && SelectionSystem.isValidSelection(targetBuilding.id, buildings)) {
        eventBus.publish('PLAYER_SELECTED_BUILDING', {
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
