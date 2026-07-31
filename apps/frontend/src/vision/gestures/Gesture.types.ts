import type { GestureType } from '../types/Vision.types';

export interface HandAnalysisResult {
  handIndex: number;
  handedness: string;
  gesture: GestureType;
  confidence: number;
  extendedFingers: string[];
  foldedFingers: string[];
  rulesMatched: string[];
  rulesFailed: string[];
}

export interface RecognitionDetails {
  hands: HandAnalysisResult[];
  extendedFingers: string[];
  foldedFingers: string[];
  rulesMatched: string[];
  rulesFailed: string[];
  rulesMatchedCount: number;
  totalRulesCount: number;
}

export interface GestureRecognitionResult {
  gesture: GestureType;
  confidence: number;
  timestamp: number;
  details?: RecognitionDetails;
  metadata?: Record<string, unknown>;
}

export interface GestureConfig {
  handUpThresholdY?: number;
  handDownThresholdY?: number;
  faceCenterToleranceX?: number;
  smileThresholdRatio?: number;
}
