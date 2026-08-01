// Domain Types
export * from './types/GameStatus';
export * from './types/PlayerStatus';
export * from './types/GestureType';
export * from './types/BuildingType';
export * from './types/ChallengeType';
export * from './types/WaveType';
export * from './types/WinnerType';
export * from './types/DirectionType';
export * from './types/GameEventType';
export * from './types/LifeState';

// Domain Entities
export * from './entities/Game';
export * from './entities/Player';
export * from './entities/Wave';
export * from './entities/Building';
export * from './entities/Challenge';
export * from './entities/Score';
export * from './entities/Timer';
export * from './entities/ProgressBar';

// Events & EventBus
export * from './events/GameEvents';
export * from './events/PlayerEvents';
export * from './events/VisionEvents';
export * from './events/EventBus';

// Global State Stores (Zustand)
export * from './state/GameState';
export * from './state/PlayerState';
export * from './state/WaveState';
export * from './state/VisionState';

// Game Rules (Systems)
export * from './systems/MovementSystem';
export * from './systems/SelectionSystem';
export * from './systems/LifeSystem';
export * from './systems/ProgressSystem';
export * from './systems/VictorySystem';
export * from './systems/ChallengeSystem';

// Flow Coordinators (Managers)
export * from './managers/GameManager';
export * from './managers/PlayerManager';
export * from './managers/WaveManager';
export * from './managers/GestureManager';
export * from './managers/ChallengeManager';
export * from './managers/TimerManager';
export * from './managers/ScoreManager';

// Framework de Minijuegos
export * from './minigames/contracts/IMinigame';
export * from './minigames/contracts/MinigameConfig';
export * from './minigames/contracts/MinigameResult';
export * from './minigames/contracts/MinigameStatus';
export * from './minigames/implementations/BaseMinigame';
export * from './minigames/implementations/DummyMinigame';
export * from './minigames/registry/MinigameRegistry';
export * from './minigames/factory/MinigameFactory';
