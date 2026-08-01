# Guía para Desarrolladores y Contribuidores: Creación de Minijuegos

Esta guía detalla los pasos para crear e integrar un nuevo minijuego o desafío dentro de **Campus Rush: 7:00 A.M.** utilizando el **Framework de Minijuegos** desacoplado de `apps/game-core`.

---

## 📌 Principio Fundamental (Open / Closed Principle)

> **Agregar un nuevo minijuego o edificio NUNCA debe requerir modificar `GameManager`, `ChallengeManager` ni código existente dentro de `game-core`.**
> 
> Todo nuevo minijuego debe implementarse como una clase independiente y registrarse dinámicamente mediante `minigameRegistry`.

---

## 📋 Responsabilidades del Minijuego

### Lo que DEBE hacer un minijuego:
- Extender de `BaseMinigame` o implementar el contrato `IMinigame`.
- Procesar tiempo y estado propio durante el método `update(deltaTime)`.
- Reaccionar a gestos de entrada mediante `handleGesture(gesture, playerId)`.
- Finalizar retornando un `MinigameResult` válido vía `this.finish(success)`.
- Liberar cualquier temporizador o recurso en `onDestroy()`.

### Lo que NO DEBE hacer un minijuego:
- **NO renderizar UI ni gráficos directos**. (El renderizado pertenece a Phaser o React).
- **NO llamar directamente a MediaPipe o acceder a la webcam**. (Recibe los gestos a través de `onGesture`).
- **NO modificar directamente el estado global de vidas o jugadores**. (Retorna un `MinigameResult` para que el `ChallengeManager` aplique las consecuencias).

---

## 🛠️ Plantilla de Implementación (Template)

Crea tu archivo en `apps/game-core/minigames/implementations/MiNuevoMinijuego.ts`:

```typescript
import { BaseMinigame } from './BaseMinigame';
import type { MinigameConfig } from '../contracts/MinigameConfig';
import type { GestureType } from '../../types/GestureType';

/**
 * MiNuevoMinijuego
 * 
 * Descripción del objetivo y mecánica del minijuego.
 */
export class MiNuevoMinijuego extends BaseMinigame {
  private targetGesture: GestureType = 'HAND_UP';
  private successCount: number = 0;
  private requiredSuccesses: number = 3;

  protected override onInit(config: MinigameConfig): void {
    // Inicialización de variables personalizadas según config
    if (config.customOptions?.targetGesture) {
      this.targetGesture = config.customOptions.targetGesture as GestureType;
    }
  }

  protected override onStart(): void {
    this.successCount = 0;
  }

  protected override handleGesture(gesture: GestureType, playerId?: string): void {
    if (gesture === this.targetGesture) {
      this.successCount++;
      if (this.successCount >= this.requiredSuccesses) {
        // Finaliza con éxito
        this.finish(true);
      }
    }
  }

  protected override onDestroy(): void {
    // Limpieza de recursos locales si existieran
  }
}
```

---

## 🚀 Registro del Minijuego en `MinigameRegistry`

Registra tu nuevo minijuego asociado a un `BuildingType` o ID único sin modificar el núcleo del juego:

```typescript
import { minigameRegistry } from 'game-core';
import { MiNuevoMinijuego } from './implementations/MiNuevoMinijuego';

// Registro para el edificio LIBRARY
minigameRegistry.register('LIBRARY', MiNuevoMinijuego);
```

---

## 🔄 Reutilización de Variantes Mediante Configuración

Puedes reutilizar la misma clase de minijuego para distintos edificios pasando `customOptions` en la configuración:

```typescript
import { MinigameFactory } from 'game-core';

// Variante Fácil para Admission
const minigameFacil = MinigameFactory.create('ADMISSION', {
  difficulty: 'EASY',
  timeLimit: 20,
  customOptions: { targetGesture: 'HAND_UP' }
});

// Variante Difícil para Engineering
const minigameDificil = MinigameFactory.create('ENGINEERING', {
  difficulty: 'HARD',
  timeLimit: 10,
  customOptions: { targetGesture: 'CLOSED_HAND' }
});
```

---

## 💡 Flujo de Ejecución por la Fábrica

1. El `ChallengeManager` o el controlador invoca `MinigameFactory.create(buildingType)`.
2. La fábrica busca la clase registrada en `minigameRegistry`.
3. Si existe, la instancia. Si no existe, genera una instancia de respaldo (`DummyMinigame`).
4. El minijuego ejecuta su ciclo de vida (`init` -> `start` -> `update` / `onGesture` -> `finish` -> `destroy`).
