import type { DetectionFrameResult, GameEventType, VisionEvent } from '../types/Vision.types';
import type { GestureRecognitionResult } from './Gesture.types';

export class GestureMapper {
  private eventIdCounter = 0;

  public mapGestureToEvent(result: GestureRecognitionResult, frame?: DetectionFrameResult): VisionEvent | null {
    if (result.gesture === 'NONE') {
      return null;
    }

    let eventType: GameEventType = 'GESTURE_TRIGGERED';

    if (result.gesture === 'FACE_CENTERED' || result.gesture === 'SMILE') {
      eventType = 'FACE_STATE_CHANGED';
    } else if (result.gesture === 'HAND_UP' || result.gesture === 'HAND_DOWN') {
      eventType = 'POSE_STATE_CHANGED';
    }

    this.eventIdCounter += 1;

    return {
      id: `evt_${Date.now()}_${this.eventIdCounter}`,
      type: eventType,
      gesture: result.gesture,
      timestamp: result.timestamp,
      payload: {
        confidence: result.confidence,
        hasHands: Boolean(frame?.hands),
        hasPose: Boolean(frame?.pose),
        hasFace: Boolean(frame?.face),
      },
    };
  }
}
