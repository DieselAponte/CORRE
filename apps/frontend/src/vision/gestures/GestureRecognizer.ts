import type { DetectionFrameResult, GestureType, Point3D } from '../types/Vision.types';
import type { GestureConfig, GestureRecognitionResult, HandAnalysisResult } from './Gesture.types';

export class GestureRecognizer {
  private config: Required<GestureConfig>;

  constructor(config: GestureConfig = {}) {
    this.config = {
      handUpThresholdY: config.handUpThresholdY ?? 0.35,
      handDownThresholdY: config.handDownThresholdY ?? 0.65,
      faceCenterToleranceX: config.faceCenterToleranceX ?? 0.12,
      smileThresholdRatio: config.smileThresholdRatio ?? 0.05,
    };
  }

  public recognize(frame: DetectionFrameResult): GestureRecognitionResult {
    const timestamp = frame.timestamp;

    // 1. Analyze All Hand Gestures (Support Multi-Hand)
    if (frame.hands && frame.hands.landmarks.length > 0) {
      const handResults: HandAnalysisResult[] = [];
      let primaryGesture: GestureType = 'NONE';
      let maxConfidence = 0;

      frame.hands.landmarks.forEach((handPoints, index) => {
        const handednessLabel = frame.hands?.handedness[index]?.displayName || (index === 0 ? 'Hand 1' : 'Hand 2');
        const analysis = this.analyzeSingleHand(handPoints, index, handednessLabel);
        handResults.push(analysis);

        if (analysis.gesture !== 'NONE' && analysis.confidence > maxConfidence) {
          primaryGesture = analysis.gesture;
          maxConfidence = analysis.confidence;
        }
      });

      // Combine extended/folded fingers & rules across all hands
      const allExtendedFingers = handResults.flatMap((h) => h.extendedFingers.map((f) => `${h.handedness}: ${f}`));
      const allFoldedFingers = handResults.flatMap((h) => h.foldedFingers.map((f) => `${h.handedness}: ${f}`));
      const allRulesMatched = handResults.flatMap((h) => h.rulesMatched.map((r) => `[${h.handedness}] ${r}`));
      const allRulesFailed = handResults.flatMap((h) => h.rulesFailed.map((r) => `[${h.handedness}] ${r}`));

      if (primaryGesture !== 'NONE') {
        return {
          gesture: primaryGesture,
          confidence: maxConfidence,
          timestamp,
          details: {
            hands: handResults,
            extendedFingers: allExtendedFingers,
            foldedFingers: allFoldedFingers,
            rulesMatched: allRulesMatched,
            rulesFailed: allRulesFailed,
            rulesMatchedCount: allRulesMatched.length,
            totalRulesCount: allRulesMatched.length + allRulesFailed.length,
          },
        };
      }
    }

    // 2. Pose Gestures
    if (frame.pose && frame.pose.landmarks.length > 0) {
      const poseLandmarks = frame.pose.landmarks[0];
      const poseResult = this.evaluatePoseGesture(poseLandmarks, timestamp);
      if (poseResult.gesture !== 'NONE') {
        return poseResult;
      }
    }

    // 3. Face Gestures
    if (frame.face && frame.face.landmarks.length > 0) {
      const faceLandmarks = frame.face.landmarks[0];
      const faceResult = this.evaluateFaceGesture(faceLandmarks, timestamp);
      if (faceResult.gesture !== 'NONE') {
        return faceResult;
      }
    }

    return {
      gesture: 'NONE',
      confidence: 1.0,
      timestamp,
      details: {
        hands: [],
        extendedFingers: [],
        foldedFingers: [],
        rulesMatched: ['No active gesture conditions met'],
        rulesFailed: [],
        rulesMatchedCount: 0,
        totalRulesCount: 1,
      },
    };
  }

  private analyzeSingleHand(landmarks: Point3D[], handIndex: number, handedness: string): HandAnalysisResult {
    if (landmarks.length < 21) {
      return {
        handIndex,
        handedness,
        gesture: 'NONE',
        confidence: 0,
        extendedFingers: [],
        foldedFingers: [],
        rulesMatched: [],
        rulesFailed: ['Insufficient landmarks'],
      };
    }

    const wrist = landmarks[0];

    // Position check
    if (wrist.y < this.config.handUpThresholdY) {
      return {
        handIndex,
        handedness,
        gesture: 'HAND_UP',
        confidence: Math.min(0.98, Math.max(0.7, (this.config.handUpThresholdY - wrist.y) / 0.2 + 0.7)),
        extendedFingers: [],
        foldedFingers: [],
        rulesMatched: [`Wrist Y (${wrist.y.toFixed(2)}) is above UP threshold`],
        rulesFailed: [],
      };
    }

    if (wrist.y > this.config.handDownThresholdY) {
      return {
        handIndex,
        handedness,
        gesture: 'HAND_DOWN',
        confidence: Math.min(0.98, Math.max(0.7, (wrist.y - this.config.handDownThresholdY) / 0.2 + 0.7)),
        extendedFingers: [],
        foldedFingers: [],
        rulesMatched: [`Wrist Y (${wrist.y.toFixed(2)}) is below DOWN threshold`],
        rulesFailed: [],
      };
    }

    // Finger extension analysis
    const thumbExtended = Math.abs(landmarks[4].x - landmarks[2].x) > 0.04 || landmarks[4].y < landmarks[3].y;
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;

    const extendedFingers: string[] = [];
    const foldedFingers: string[] = [];

    if (thumbExtended) extendedFingers.push('Thumb'); else foldedFingers.push('Thumb');
    if (indexExtended) extendedFingers.push('Index'); else foldedFingers.push('Index');
    if (middleExtended) extendedFingers.push('Middle'); else foldedFingers.push('Middle');
    if (ringExtended) extendedFingers.push('Ring'); else foldedFingers.push('Ring');
    if (pinkyExtended) extendedFingers.push('Pinky'); else foldedFingers.push('Pinky');

    const extendedMainCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

    // GESTURE_ONE
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      const rulesMatched = ['Index extended', 'Middle folded', 'Ring and Pinky folded'];
      const rulesFailed: string[] = [];
      if (thumbExtended) rulesFailed.push('Thumb not fully folded');
      return {
        handIndex,
        handedness,
        gesture: 'GESTURE_ONE',
        confidence: thumbExtended ? 0.85 : 0.95,
        extendedFingers,
        foldedFingers,
        rulesMatched,
        rulesFailed,
      };
    }

    // GESTURE_TWO
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      const rulesMatched = ['Index extended', 'Middle extended', 'Ring and Pinky folded'];
      const rulesFailed: string[] = [];
      if (thumbExtended) rulesFailed.push('Thumb not fully folded');
      return {
        handIndex,
        handedness,
        gesture: 'GESTURE_TWO',
        confidence: thumbExtended ? 0.88 : 0.96,
        extendedFingers,
        foldedFingers,
        rulesMatched,
        rulesFailed,
      };
    }

    // GESTURE_THREE
    if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
      const rulesMatched = ['Index extended', 'Middle extended', 'Ring extended', 'Pinky folded'];
      const rulesFailed: string[] = [];
      if (thumbExtended) rulesFailed.push('Thumb not fully folded');
      return {
        handIndex,
        handedness,
        gesture: 'GESTURE_THREE',
        confidence: thumbExtended ? 0.86 : 0.94,
        extendedFingers,
        foldedFingers,
        rulesMatched,
        rulesFailed,
      };
    }

    // OPEN_HAND
    if (extendedMainCount >= 4) {
      const rulesMatched = ['4 main fingers extended'];
      const rulesFailed: string[] = [];
      if (!thumbExtended) rulesFailed.push('Thumb not extended');
      return {
        handIndex,
        handedness,
        gesture: 'OPEN_HAND',
        confidence: thumbExtended ? 0.98 : 0.90,
        extendedFingers,
        foldedFingers,
        rulesMatched,
        rulesFailed,
      };
    }

    // CLOSED_HAND
    if (extendedMainCount === 0) {
      const rulesMatched = ['All main fingers folded'];
      const rulesFailed: string[] = [];
      if (thumbExtended) rulesFailed.push('Thumb not tucked in');
      return {
        handIndex,
        handedness,
        gesture: 'CLOSED_HAND',
        confidence: 0.94,
        extendedFingers,
        foldedFingers,
        rulesMatched,
        rulesFailed,
      };
    }

    return {
      handIndex,
      handedness,
      gesture: 'NONE',
      confidence: 0.5,
      extendedFingers,
      foldedFingers,
      rulesMatched: [`${extendedFingers.length} extended fingers`],
      rulesFailed: ['No gesture pattern matched'],
    };
  }

  private evaluatePoseGesture(landmarks: Point3D[], timestamp: number): GestureRecognitionResult {
    if (landmarks.length < 17) {
      return { gesture: 'NONE', confidence: 0, timestamp };
    }

    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const nose = landmarks[0];

    if ((leftWrist && leftWrist.y < nose.y) || (rightWrist && rightWrist.y < nose.y)) {
      return {
        gesture: 'HAND_UP',
        confidence: 0.91,
        timestamp,
        details: {
          hands: [],
          extendedFingers: [],
          foldedFingers: [],
          rulesMatched: ['Wrist position above nose level in Pose landmarks'],
          rulesFailed: [],
          rulesMatchedCount: 1,
          totalRulesCount: 1,
        },
      };
    }

    return { gesture: 'NONE', confidence: 0, timestamp };
  }

  private evaluateFaceGesture(landmarks: Point3D[], timestamp: number): GestureRecognitionResult {
    if (landmarks.length < 10) {
      return { gesture: 'NONE', confidence: 0, timestamp };
    }

    const nose = landmarks[1];
    if (nose) {
      const distFromCenter = Math.abs(nose.x - 0.5);
      if (distFromCenter <= this.config.faceCenterToleranceX) {
        const confidence = Math.min(0.98, Math.max(0.75, 1 - distFromCenter * 2));
        return {
          gesture: 'FACE_CENTERED',
          confidence: Math.round(confidence * 100) / 100,
          timestamp,
          details: {
            hands: [],
            extendedFingers: [],
            foldedFingers: [],
            rulesMatched: [`Face nose X (${nose.x.toFixed(2)}) within center tolerance (0.5 ± ${this.config.faceCenterToleranceX})`],
            rulesFailed: [],
            rulesMatchedCount: 1,
            totalRulesCount: 1,
          },
        };
      }
    }

    return { gesture: 'NONE', confidence: 0, timestamp };
  }
}
