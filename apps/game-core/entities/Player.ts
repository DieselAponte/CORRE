import type { PlayerStatus } from '../types/PlayerStatus';
import type { GestureType } from '../types/GestureType';
import type { Building } from './Building';
import type { Challenge } from './Challenge';
import { ProgressBar } from './ProgressBar';

export interface Position2D {
  x: number;
  y: number;
}

export interface PlayerData {
  id: string;
  name: string;
  status: PlayerStatus;
  lives: number;
  score: number;
  currentBuilding?: Building | null;
  progress?: ProgressBar;
  position?: Position2D;
  selectedGesture?: GestureType;
  currentChallenge?: Challenge | null;
}

export class Player implements PlayerData {
  public readonly id: string;
  public name: string;
  public status: PlayerStatus;
  public lives: number;
  public score: number;
  public currentBuilding: Building | null;
  public progress: ProgressBar;
  public position: Position2D;
  public selectedGesture: GestureType;
  public currentChallenge: Challenge | null;

  constructor(data: PlayerData) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status ?? 'IDLE';
    this.lives = data.lives ?? 3;
    this.score = data.score ?? 0;
    this.currentBuilding = data.currentBuilding ?? null;
    this.progress = data.progress ?? new ProgressBar({ playerId: data.id, currentProgress: 0, maximumProgress: 100, currentCheckpoint: 0 });
    this.position = data.position ?? { x: 0, y: 0 };
    this.selectedGesture = data.selectedGesture ?? 'NONE';
    this.currentChallenge = data.currentChallenge ?? null;
  }
}
