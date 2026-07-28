# CORRE (**C**arrera para **O**btener el **R**egistro y **R**endir el **E**xamen o Campus Rush: 7:00 A.M.)

**CORRE (Campus Rush: 7:00 A.M.)** es un videojuego web competitivo para dos jugadores en local, donde ambos compiten por llegar al salón de clases antes de las 7:00 A.M. (hora del examen final). La interacción principal se realiza exclusivamente mediante **Visión por Computadora** utilizando la cámara web (sin controles tradicionales). Los jugadores avanzan, eligen rutas, superan minijuegos mediante gestos y registran sus puntajes en un ranking global.

---

## 🛠️ Stack Tecnológico y Especificaciones Técnicas

El proyecto se estructura como un **Monorepo** administrado con `pnpm` workspaces.

### 🏢 Monorepo
- **Gestor de Paquetes:** `pnpm` (Workspaces)
- **Estructura del Proyecto:**
  - `apps/frontend`: Aplicación web, interfaz de usuario, motor de juego y procesamiento de visión.
  - `apps/backend`: Servidor de API REST, lógica de negocio y persistencia.
  - `packages/shared`: Tipos, interfaces y utilidades compartidas entre frontend y backend.
  - `apps/docs`: Documentación técnica, backlog y contexto para LLM / desarrollo.

### 🌐 Frontend (`apps/frontend`)
- **Core UI & Render:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Navegación:** React Router (v7)
- **Gestión de Estado UI:** Zustand
- **Estilizado & Layout:** TailwindCSS (v4)
- **Motor de Videojuego:** Phaser 3
- **Animaciones UI:** Framer Motion
- **Visión por Computadora:** MediaPipe Tasks Vision (`@mediapipe/tasks-vision` - Hands, Pose, Face Landmarker)

### ⚙️ Backend (`apps/backend`)
- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express (v5) + TypeScript
- **Ejecución en Desarrollo:** `tsx` (Hot reloading y ejecución directa de TypeScript)
- **Base de Datos & ORM:** PostgreSQL (ORM Prisma o equivalente a definir en fase de persistencia)
- **Comunicación en Tiempo Real (Futuro):** Socket.IO (fuera del alcance del MVP inicial)

---

## 🏛️ Responsabilidad y Aporte por Módulo

### 🎨 Módulo Frontend (`apps/frontend`)
El Frontend divide estrictamente la interfaz gráfica de usuario, el motor del videojuego y el procesamiento de visión por computadora:

1. **React 19 & UI (`src/components`, `src/pages`, `src/router`, `src/store`)**:
   - **Responsabilidad:** Administra la navegación global entre pantallas (Inicio, Tutorial, Permiso de Cámara, Calibración, Pantalla de Resultados y Ranking), los layouts visuales, modales, formularios y el estado de interfaz con Zustand.
   - **Regla de Arquitectura:** React **nunca** maneja física, renderizado de canvas 2D o lógica interna del videojuego.

2. **Phaser 3 (`src/game/`)**:
   - **Responsabilidad:** Contiene la lógica completa del juego (`config/`, `scenes/`, `objects/`, `managers/`). Maneja la física 2D, el movimiento de los personajes, el ciclo de oleadas, temporizadores de partida, sistema de vidas y minijuegos (individuales y VS).
   - **Regla de Arquitectura:** Phaser opera de forma desacoplada dentro de su propio Canvas 2D sin intervenir en el DOM de React.

3. **MediaPipe Tasks Vision (`src/services/` o hooks de visión)**:
   - **Responsabilidad:** Funciona únicamente como **Proveedor de Entrada (Input Provider)**. Captura y procesa los frames de la cámara web para detectar manos, poses corporales y expresiones faciales, emitiendo eventos puros (ej. `GESTURE_ONE`, `GESTURE_TWO`, `HAND_UP`, `SMILE`).
   - **Regla de Arquitectura:** MediaPipe **nunca** almacena lógica de juego ni modifica directamente el estado del videojuego.

---

### 🔧 Módulo Backend (`apps/backend`)
El Backend sigue una **Arquitectura por Capas** con separación única de responsabilidades:

1. **Rutas & Controladores (`src/routes/`, `src/controllers/`)**:
   - **Responsabilidad:** Exponen los endpoints de la API REST (ej. `/api/health`, `/api/ranking`), gestionan el ciclo de petición/respuesta HTTP, validaciones iniciales de entrada y formateo de respuestas.

2. **Servicios (`src/services/`)**:
   - **Responsabilidad:** Implementan las **reglas de negocio** desacopladas del protocolo HTTP (cálculo de puntuaciones, ordenamiento del ranking, validaciones de partidas).

3. **Repositorios & Modelos (`src/repositories/`, `src/models/`)**:
   - **Responsabilidad:** Abstraen el acceso y la persistencia de datos en PostgreSQL mediante el ORM elegido.

4. **Regla de Arquitectura General del Backend:**
   - El backend administra exclusivamente **Persistencia, Ranking, Puntajes y API REST**. No administra lógica del gameplay durante la partida.

---

## 🚀 Comandos de Instalación y Funcionamiento

### 📋 Prerrequisitos
- **Node.js**: v18.0.0 o superior
- **pnpm**: v10.0.0 o superior (`npm install -g pnpm`)

---

### 📦 1. Instalación de Dependencias
Ejecuta la instalación desde la raíz del monorepo para instalar las dependencias de todos los módulos del proyecto:

```bash
pnpm install
```

---

### ⚡ 2. Funcionamiento y Ejecución Global (Monorepo)

Desde la raíz del proyecto puedes controlar ambos módulos simultáneamente mediante los scripts configurados:

| Acción | Comando | Descripción |
| :--- | :--- | :--- |
| **Desarrollo Simultáneo** | `pnpm dev` | Inicia `apps/frontend` y `apps/backend` en modo desarrollo en paralelo. |
| **Inicio Simultáneo** | `pnpm start` | Ejecuta el comando `start` en ambos módulos. |
| **Compilación General** | `pnpm build` | Compila TypeScript y genera los bundles de producción. |
| **Verificación de Tipos** | `pnpm typecheck` | Ejecuta el chequeo de tipos estáticos con TypeScript en todo el monorepo. |

---

### 💻 3. Funcionamiento de Módulos Individuales

#### 🔹 Módulo Backend (`apps/backend`)

**Desde la raíz del monorepo:**
```bash
# Iniciar backend en modo desarrollo (watch con tsx)
pnpm dev:backend

# Iniciar servidor backend
pnpm start:backend

# Compilar proyecto a JavaScript (tsc)
pnpm build:backend

# Chequear tipos de TypeScript sin emitir archivos
pnpm typecheck:backend
```

**Desde la carpeta del módulo (`cd apps/backend`):**
```bash
# Servidor de desarrollo
pnpm dev

# Compilar proyecto
pnpm build

# Chequear tipos
pnpm typecheck
```

---

#### 🎨 Módulo Frontend (`apps/frontend`)

**Desde la raíz del monorepo:**
```bash
# Iniciar servidor de desarrollo (Vite)
pnpm dev:frontend

# Iniciar frontend
pnpm start:frontend

# Compilar frontend para producción (tsc -b && vite build)
pnpm build:frontend

# Chequear tipos de TypeScript
pnpm typecheck:frontend
```

**Desde la carpeta del módulo (`cd apps/frontend`):**
```bash
# Servidor de desarrollo Vite
pnpm dev

# Compilar para producción
pnpm build

# Previsualizar el build de producción localmente
pnpm preview

# Chequear tipos
pnpm typecheck
```
