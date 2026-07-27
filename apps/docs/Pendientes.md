# Pendientes del Proyecto

Este documento representa el backlog técnico del proyecto.

Cada tarea debe ser autocontenida.

Cada desarrollador o agente puede tomar una tarea.

Antes de iniciar una implementación debe verificarse que ninguna otra tarea entre en conflicto.

---

# Estado del Proyecto

Backend

- Express configurado
- TypeScript configurado
- Servidor funcionando

Frontend

- React pendiente de configuración

Gameplay

- No iniciado

MediaPipe

- No iniciado

Backend API

- No iniciada

Ranking

- No iniciado

---

# Tareas

---

[apps/frontend] [Crear]

Objetivo

Inicializar la aplicación React utilizando Vite y TypeScript.

Resultado esperado

Proyecto React ejecutándose correctamente.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear proyecto mediante Vite.
2. Configurar TypeScript.
3. Configurar estructura base.
4. Verificar compilación.

---

[apps/frontend/src/router] [Crear]

Objetivo

Crear el sistema de navegación.

Resultado esperado

React Router funcionando.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Instalar React Router.
2. Configurar BrowserRouter.
3. Crear rutas principales.
4. Preparar GamePage.

---

[apps/frontend/src/store] [Crear]

Objetivo

Implementar Zustand.

Resultado esperado

Estado global inicial.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear store principal.
2. Configurar GameState.
3. Exportar hooks.

---

[apps/backend/src/routes] [Refactorizar]

Objetivo

Separar rutas del archivo principal.

Resultado esperado

index.ts únicamente inicializa la aplicación.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear router principal.
2. Registrar rutas.
3. Mantener separación por módulos.

---

[apps/backend/src/controllers] [Crear]

Objetivo

Implementar controlador Health.

Resultado esperado

GET /api/health

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear controller.
2. Registrar endpoint.
3. Verificar respuesta.

---

[apps/backend/src/services] [Crear]

Objetivo

Crear servicios del backend.

Resultado esperado

Lógica desacoplada de HTTP.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear carpeta.
2. Crear HealthService.
3. Utilizar desde controller.

---

[apps/frontend/src/game] [Diseñar]

Objetivo

Preparar el módulo del videojuego.

Resultado esperado

Estructura vacía lista para Phaser.

Estado actual

Pendiente.

Instrucciones Técnicas

1. Crear config.
2. Crear scenes.
3. Crear objects.
4. Crear managers.

---

# Decisiones Técnicas

## 2026-07-27

- Se adopta Monorepo con pnpm.
- Backend mediante Express + TypeScript.
- Frontend mediante React + Vite.
- Phaser administrará exclusivamente el videojuego.
- React administrará la interfaz.
- MediaPipe será un proveedor de entrada desacoplado de la lógica del juego.

---

# Convenciones para nuevas tareas

Toda nueva tarea debe incluir:

- Objetivo.
- Resultado esperado.
- Estado actual.
- Instrucciones Técnicas.
- Archivos involucrados.
- Dependencias con otras tareas (si existen).