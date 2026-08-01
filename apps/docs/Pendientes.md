# Pendientes del Proyecto: Campus Rush: 7:00 A.M.

Este documento constituye la **hoja de ruta y backlog técnico definitivo** para completar el MVP (Minimum Viable Product) de *Campus Rush: 7:00 A.M.*

Cada pendiente técnico representa un **incremento funcional completo del videojuego** y está organizado por características de gameplay y arquitectura, omitiendo tareas ya implementadas.

---

# Estado Actual del Proyecto (Auditoría Técnica)

### 1. Visión Computacional (`apps/frontend/src/vision/`)
- **Estado**: **COMPLETADO & AUDITADO**
- **Implementado**:
  - `CameraManager`: Gestión de stream de la webcam y vinculación a elemento HTMLVideoElement.
  - `VisionEngine`: Inicialización de detectores MediaPipe, bucle de fotogramas (`requestAnimationFrame`), medición de FPS reales y tiempo de ciclo por fotograma (ms).
  - Detectores MediaPipe: `HandsDetector`, `PoseDetector`, `FaceDetector`.
  - `GestureRecognizer` & `GestureMapper`: Clasificación heurística de gestos (`ONE`, `TWO`, `THREE`, `OPEN_HAND`, `CLOSED_HAND`, `HAND_UP`, `HAND_DOWN`, `FACE_CENTERED`, `SMILE`), cálculo dinámico de nivel de confianza y soporte de reconocimiento multimano simultáneo.
  - `useVision()` hook: Manejo del ciclo de vida, reactividad de banderas `VisionConfig` (`enableLandmarks`, `enableFPSCounter`, etc.) y limpieza de estado al detener la cámara.
  - Panel de Diagnóstico (`TestingPage`): Subcomponentes modulares `BriefMetrics`, `ObjectsDetected`, `HandRecognitionDetails` y `DiagnosticHistory`.

### 2. Game Core (`apps/game-core/`)
- **Estado**: **COMPLETADO & AUDITADO**
- **Implementado**:
  - **Types** (`types/`): `GameStatus`, `PlayerStatus`, `GestureType`, `BuildingType`, `ChallengeType`, `WaveType`, `WinnerType`, `DirectionType`, `GameEventType`, `LifeState`.
  - **Entities** (`entities/`): `Game`, `Player`, `Wave`, `Building`, `Challenge`, `Score`, `Timer`, `ProgressBar`.
  - **Events & EventBus** (`events/`): `GameEvents`, `PlayerEvents`, `VisionEvents`, y `EventBus` pub-sub fuertemente tipado.
  - **State Stores** (`state/`): Stores Zustand independientes (`gameStateStore`, `playerStateStore`, `waveStateStore`, `visionStateStore`).
  - **Systems** (`systems/`): Funciones puras con reglas de negocio (`MovementSystem`, `SelectionSystem`, `LifeSystem`, `ProgressSystem`, `VictorySystem`, `ChallengeSystem`).
  - **Managers** (`managers/`): Coordinadores de flujo (`GameManager`, `PlayerManager`, `WaveManager`, `GestureManager`, `ChallengeManager`, `TimerManager`, `ScoreManager`).
  - **Configuración de Compilación**: `tsconfig.json` ajustado a `"outDir": "./dist"`, aislando archivos generados `.js` y `.d.ts`.

### 3. Frontend Shell (`apps/frontend/`)
- **Estado**: **PARCIALMENTE IMPLEMENTADO**
- **Implementado**: React + Vite + TypeScript + TailwindCSS, React Router (`AppRouter`), contenedor `TwoPlayersView.tsx`, vista de menú lateral `SandwichMenu.tsx`, página de pruebas `TestingPage.tsx`.
- **Pendiente**: Integración del motor gráfico Phaser 3, HUD y canvas interactivo del videojuego.

### 4. Backend (`apps/backend/`)
- **Estado**: **INICIAL / PENDIENTE**
- **Implementado**: Servidor base Express con TypeScript en `apps/backend/src/index.ts`.
- **Pendiente**: Arquitectura por capas (Controllers, Services, Repositories), REST API para guardado de puntajes y sistema de Ranking.

---

# Análisis de Escalabilidad del Sistema de Minijuegos

### Evaluación Arquitectónica
1. **¿Existe un contrato común para todos los minijuegos?**
   - *Actualmente No.* Existe únicamente la entidad de datos `Challenge` y el coordinador `ChallengeManager`.
2. **¿Existe una interfaz que defina el ciclo de vida de un minijuego?**
   - *Actualmente No.* No se cuenta con una interfaz `IMinigame` que estandarice los métodos `init()`, `start()`, `update()`, `onGesture()`, `finish()`, `destroy()`.
3. **¿Es posible agregar un nuevo edificio sin modificar GameManager?**
   - *Actualmente No.* Agregar un edificio o minijuego requiere modificar la lógica imperativa en `ChallengeManager` o en el flujo principal del juego.
4. **¿Se cumple el principio Open/Closed (OCP)?**
   - *No se cumple actualmente.* El sistema está abierto a la modificación en lugar de abierto a la extensión.

### Propuesta Arquitectónica Escalable
Se propone estructurar los minijuegos bajo `apps/game-core/minigames/`:

```
apps/game-core/minigames/
  contracts/
    IMinigame.ts          # Contrato estándar de ciclo de vida
    MinigameConfig.ts     # Configuración inicial del minijuego
    MinigameResult.ts     # Resultado y métricas de desempeño
  registry/
    MinigameRegistry.ts   # Registro centralizado de minijuegos por BuildingType / ID
  factory/
    MinigameFactory.ts    # Instanciador dinámico de minijuegos
  implementations/
    BaseMinigame.ts       # Clase base abstracta reutilizable
```

---

# Backlog de Pendientes Técnicos para el MVP

---

### Pendiente Técnico 1: Arquitectura Escalable de Minijuegos (Contrato IMinigame, Registry, Factory y Template)

**Descripción técnica:**
Implementar la infraestructura que permita incorporar nuevos minijuegos y desafíos en cualquier edificio del campus sin modificar el código del `GameManager` ni de los Managers existentes. Se creará la interfaz `IMinigame`, el registro centralizado `MinigameRegistry`, la fábrica `MinigameFactory` y una guía con plantilla para colaboradores.

**Archivos involucrados:**
- `apps/game-core/minigames/contracts/IMinigame.ts`
- `apps/game-core/minigames/registry/MinigameRegistry.ts`
- `apps/game-core/minigames/factory/MinigameFactory.ts`
- `apps/game-core/minigames/implementations/BaseMinigame.ts`
- `apps/game-core/index.ts`
- `apps/docs/DEVELOPER_MINIGAME_GUIDE.md`

**Objetivos:**
1. Definir la interfaz `IMinigame` con los métodos de ciclo de vida: `id`, `name`, `type`, `init(config)`, `start()`, `update(deltaTime)`, `onGesture(gesture, playerId)`, `finish()`, `destroy()`.
2. Crear `MinigameRegistry` para registrar constructores de minijuegos asociados a un `BuildingType` o ID único.
3. Crear `MinigameFactory` para instanciar dinámicamente cualquier minijuego de forma desacoplada.
4. Documentar el contrato mediante una plantilla de comentarios para que cualquier desarrollador pueda extender minijuegos mediante configuración sin tocar el núcleo del `GameCore`.

**Resultado esperado:**
Compilación exitosa en TypeScript donde `MinigameFactory.create(BuildingType)` devuelva una instancia conforme a `IMinigame` lista para ejecutarse de forma transparente.

---

### Pendiente Técnico 2: Integración de Phaser 3 y Canvas de Juego en Frontend

**Descripción técnica:**
Instalar e integrar el motor de videojuegos Phaser 3 dentro del frontend de React. Se creará el componente montador de Phaser, la escena de carga `BootScene`, la escena principal `GameScene` y la escena de interfaz de usuario `HUDScene` dentro de `apps/frontend/src/game/`.

**Archivos involucrados:**
- `apps/frontend/package.json`
- `apps/frontend/src/components/TwoPlayersView.tsx`
- `apps/frontend/src/game/config/phaserConfig.ts`
- `apps/frontend/src/game/scenes/BootScene.ts`
- `apps/frontend/src/game/scenes/GameScene.ts`
- `apps/frontend/src/game/scenes/HUDScene.ts`

**Objetivos:**
1. Instalar `phaser` como dependencia en `apps/frontend`.
2. Montar de manera limpia y responsiva la instancia de Phaser dentro de `TwoPlayersView.tsx`.
3. Garantizar que Phaser no contenga reglas de negocio y se limite exclusivamente al renderizado de sprites, animaciones y escena.
4. Gestionar el desmontaje y destrucción limpia del canvas al cambiar de ruta en React Router.

**Resultado esperado:**
La vista `TwoPlayersView` renderiza un canvas interactivo de Phaser 3 que se inicializa y destruye sin fugas de memoria.

---

### Pendiente Técnico 3: Conexión EventBus ↔ Motor Phaser & Stores de Zustand

**Descripción técnica:**
Conectar los eventos emitidos por el `EventBus` de `game-core` y las lecturas de los Stores de Zustand (`gameStateStore`, `playerStateStore`, `waveStateStore`, `visionStateStore`) con las escenas y objetos visuales de Phaser 3 de forma desacoplada.

**Archivos involucrados:**
- `apps/frontend/src/game/scenes/GameScene.ts`
- `apps/frontend/src/game/scenes/HUDScene.ts`
- `apps/frontend/src/game/objects/PlayerSprite.ts`
- `apps/frontend/src/game/objects/BuildingSprite.ts`

**Objetivos:**
1. Suscribir `GameScene` y `HUDScene` a los eventos del `EventBus` (`PLAYER_STARTED_RUNNING`, `PLAYER_SELECTED_BUILDING`, `PLAYER_LOST_LIFE`, `NEXT_WAVE`, etc.).
2. Actualizar las posiciones y animaciones de los sprites de los 2 jugadores cuando cambien los Stores de `PlayerState`.
3. Actualizar elementos visuales del HUD (vidas, tiempo restante, barra de avance `ProgressBar`) en tiempo real.

**Resultado esperado:**
Cualquier cambio de estado en `game-core` o evento en `EventBus` se refleja visualmente e ininterrumpidamente en la pantalla del videojuego en Phaser 3.

---

### Pendiente Técnico 4: Flujo de Gameplay Principal (Oleadas, Recorrido Automático y Selección de Edificios)

**Descripción técnica:**
Implementar el ciclo continuo de gameplay: inicio del recorrido automático de los 2 jugadores hacia la meta antes de las 7:00 A.M., detención en bifurcaciones de edificios, selección de opción mediante gestos (`GESTURE_ONE`, `GESTURE_TWO`, `GESTURE_THREE`), transición entre las 5 oleadas (`WAVE_ONE` a `WAVE_FIVE`) y avance continuo de `ProgressBar`.

**Archivos involucrados:**
- `apps/game-core/managers/GameManager.ts`
- `apps/game-core/managers/WaveManager.ts`
- `apps/game-core/managers/GestureManager.ts`
- `apps/game-core/systems/MovementSystem.ts`
- `apps/game-core/systems/ProgressSystem.ts`
- `apps/frontend/src/game/scenes/GameScene.ts`

**Objetivos:**
1. Iniciar la carrera de los jugadores automáticamente desde el punto de inicio.
2. Presentar 2 a 3 edificios por oleada en el mapa cuando los jugadores alcancen la bifurcación.
3. Interpretar el gesto detectado por el módulo de visión para realizar la selección del edificio de destino.
4. Transicionar exitosamente a través de las oleadas hasta la llegada a la meta o eliminación.

**Resultado esperado:**
Los jugadores avanzan automáticamente en el mapa, seleccionan un edificio mediante el gesto correspondiente en la cámara y avanzan a través de las oleadas de la carrera.

---

### Pendiente Técnico 5: Primer Minijuego Individual (Desafío en Edificio)

**Descripción técnica:**
Implementar el primer minijuego individual del MVP (por ejemplo, en el edificio *Library* o *Admission*), construyéndolo como una clase que implemente `IMinigame` y registrándola en el `MinigameRegistry`.

**Archivos involucrados:**
- `apps/game-core/minigames/implementations/IndividualQuickReactionMinigame.ts`
- `apps/game-core/minigames/registry/MinigameRegistry.ts`
- `apps/game-core/managers/ChallengeManager.ts`
- `apps/frontend/src/game/scenes/GameScene.ts`

**Objetivos:**
1. Crear la clase del minijuego heredando de `BaseMinigame` o implementando `IMinigame`.
2. Reaccionar a gestos específicos de entrada del jugador (`HAND_UP`, `CLOSED_HAND`, etc.) dentro de un límite de tiempo.
3. Evaluar el desempeño mediante `ChallengeSystem` y otorgar la puntuación o pérdida de vida correspondiente.

**Resultado esperado:**
Al ingresar al edificio individual, se inicia el minijuego, se presenta la indicación en pantalla, se procesa el gesto del jugador y se evalúa el resultado otorgando la recompensa o sanción correspondiente.

---

### Pendiente Técnico 6: Primer Minijuego Versus (Desafío Competitivo 2 Jugadores)

**Descripción técnica:**
Implementar el primer minijuego versus (competitivo en pantalla dividida o por turnos rápidos) para los 2 jugadores (por ejemplo, en el edificio *Coliseum* o *Engineering*), respetando la arquitectura de `IMinigame`.

**Archivos involucrados:**
- `apps/game-core/minigames/implementations/VersusSpeedGestureMinigame.ts`
- `apps/game-core/minigames/registry/MinigameRegistry.ts`
- `apps/game-core/managers/ChallengeManager.ts`
- `apps/frontend/src/game/scenes/GameScene.ts`

**Objetivos:**
1. Implementar la lógica del minijuego versus donde ambos jugadores compiten simultáneamente o por reacción rápida frente a la cámara.
2. Determinar el jugador ganador del desafío utilizando `ChallengeSystem` y `VictorySystem`.
3. Otorgar bonificación de puntaje al ganador del desafío y deducir vida al jugador perdedor.

**Resultado esperado:**
Ambos jugadores compiten simultáneamente ante la cámara en el minijuego versus y el sistema determina correctamente al ganador del desafío.

---

### Pendiente Técnico 7: Sistema de Vidas, Temporizador Global (7:00 A.M.) y Pantalla de Resultados

**Descripción técnica:**
Completar la lógica de juego asociando la pérdida visual de vidas en el HUD, el cronómetro de cuenta regresiva hacia las 7:00 A.M., la activación del estado `GAME_OVER` o `RESULTS` y el despliegue de la interfaz de resultados.

**Archivos involucrados:**
- `apps/game-core/managers/TimerManager.ts`
- `apps/game-core/managers/PlayerManager.ts`
- `apps/game-core/managers/GameManager.ts`
- `apps/frontend/src/pages/ResultsPage.tsx`
- `apps/frontend/src/components/PlayerCard.tsx`

**Objetivos:**
1. Reducir el tiempo restante global en tiempo real mediante `TimerManager`.
2. Finalizar la partida automáticamente si el tiempo llega a 0 (reloj marca las 7:00 A.M.) o si un jugador pierde sus 3 vidas.
3. Desplegar la vista de resultados (`ResultsPage.tsx`) mostrando al ganador (`PLAYER_ONE`, `PLAYER_TWO` o `DRAW`), estadísticas del recorrido, tiempo total y puntaje obtenido.

**Resultado esperado:**
La partida concluye al agotarse las vidas o el tiempo, navegando a la pantalla de resultados con el desglose del ganador y estadísticas del juego.

---

### Pendiente Técnico 8: Backend REST API, Persistencia de Puntajes y Sistema de Ranking

**Descripción técnica:**
Implementar la arquitectura en capas del backend (`apps/backend/src/`) estructurando controladores, servicios y repositorios REST para la gestión y consulta del Ranking de los mejores puntajes.

**Archivos involucrados:**
- `apps/backend/src/routes/ranking.routes.ts`
- `apps/backend/src/controllers/ranking.controller.ts`
- `apps/backend/src/services/ranking.service.ts`
- `apps/backend/src/repositories/ranking.repository.ts`
- `apps/frontend/src/services/ranking.service.ts`
- `apps/frontend/src/pages/RankingPage.tsx`

**Objetivos:**
1. Exponer los endpoints REST:
   - `GET /api/health`: Estado del servidor.
   - `GET /api/ranking`: Obtención de los mejores puntajes guardados.
   - `POST /api/ranking`: Guardado del puntaje del ganador al finalizar una partida.
2. Implementar almacenamiento de puntajes (en memoria para el MVP o repositorio persistente).
3. Conectar la pantalla de resultados en React con el servicio del backend para registrar el puntaje y consultar el Leaderboard.

**Resultado esperado:**
Endpoints del backend respondiendo correctamente y pantalla de Ranking en el frontend consumiendo y mostrando los mejores tiempos y puntajes registrados.

---

### Pendiente Técnico 9: Flujo UX Completo (Tutorial, Permisos de Cámara y Calibración)

**Descripción técnica:**
Construir el flujo completo de experiencia de usuario antes de iniciar la partida: pantalla de bienvenida/tutorial, modal de autorización de cámara web, fase de calibración de postura/gestos e inicio fluido del videojuego.

**Archivos involucrados:**
- `apps/frontend/src/pages/HomePage.tsx`
- `apps/frontend/src/pages/TutorialPage.tsx`
- `apps/frontend/src/pages/CalibrationPage.tsx`
- `apps/frontend/src/components/CameraPermissionModal.tsx`
- `apps/frontend/src/router/AppRouter.tsx`

**Objetivos:**
1. Crear e integrar la ruta del tutorial guiado donde se expliquen los gestos básicos (`GESTURE_ONE`, `GESTURE_TWO`, `HAND_UP`, etc.).
2. Implementar la pantalla de calibración de cámara previa al juego para verificar la detección de rostro y manos del jugador.
3. Asegurar transiciones de navegación fluidas entre Inicio → Tutorial → Calibración → Juego → Resultados → Ranking.

**Resultado esperado:**
Un usuario puede ingresar al sitio, revisar las instrucciones, otorgar permisos de cámara, calibrar sus gestos e iniciar la partida de forma continua y sin interrupciones.