# Campus Rush: 7:00 A.M.

## Objetivo del Proyecto

Campus Rush: 7:00 A.M. es un videojuego web competitivo para dos jugadores donde ambos intentan llegar al salón antes de las 7:00 A.M. utilizando únicamente interacción mediante visión por computadora.

No existen controles tradicionales.

Los jugadores interactúan mediante:

- Gestos de manos
- Posturas corporales
- Expresiones faciales
- Movimientos detectados por la cámara

El proyecto está siendo desarrollado inicialmente como un MVP para validar la mecánica principal del videojuego.

---

# Objetivos del MVP

El MVP debe demostrar únicamente el gameplay principal.

Debe implementar:

- Dos jugadores.
- Movimiento automático durante el trayecto de inicio -hasta-> meta .
- Selección de edificios (opciones) mediante gestos.
- Sistema de vidas.
- Temporizador.
- Al menos una oleada funcional.
- Un minijuego individual.
- Un minijuego VS.
- Pantalla de resultados.
- Ranking.

No deben implementarse características adicionales antes de completar el gameplay principal.

---

# Stack Tecnológico

## Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand
- TailwindCSS
- Phaser 3
- Framer Motion (UI)
- MediaPipe Tasks Vision

## Backend

- Node.js
- Express
- TypeScript

## Base de Datos

- PostgreSQL

## ORM

Pendiente de implementación.

La decisión entre Prisma u otro ORM se tomará cuando se implemente persistencia.

## Tiempo Real

Socket.IO

(No implementar durante el MVP.)

---

# Arquitectura General

React administra toda la aplicación.

Phaser administra únicamente el videojuego.

MediaPipe funciona como proveedor de entrada (Input Provider).

Nunca debe existir lógica del juego dentro de MediaPipe.

El backend únicamente administra:

- Ranking
- Puntajes
- Persistencia
- API

Nunca administra lógica del videojuego.

---

# Arquitectura del Monorepo

/
apps
    backend
    frontend

packages
    shared

docs

---

# Arquitectura Backend

src

config/
middlewares/
routes/
controllers/
services/
repositories/
models/
types/
utils/

index.ts

Cada capa tiene una responsabilidad única.

controllers

- HTTP
- Request
- Response

services

- Reglas de negocio

repositories

- Acceso a datos

utils

- Funciones reutilizables

---

# Arquitectura Frontend

src

assets/
components/
hooks/
layouts/
pages/
router/
services/
store/

game/

game/config/
game/scenes/
game/objects/
game/managers/

App.tsx

main.tsx

React nunca debe contener lógica del videojuego.

Todo el gameplay pertenece al módulo game/.

---

# Arquitectura del Juego

El flujo general será:

Inicio

↓

Tutorial

↓

Permiso de Cámara

↓

Calibración

↓

Juego

↓

Resultados

↓

Ranking

---

# Flujo del Gameplay

Inicio

↓

Oleada

↓

Selección mediante gestos

↓

Evento

↓

Actualizar vidas

↓

Siguiente oleada

↓

Meta

↓

Resultados

---

# Visión por Computadora

MediaPipe será utilizado para detectar:

- Hands
- Pose
- Face Landmarker

MediaPipe únicamente devuelve eventos.

Ejemplo:

GESTURE_ONE

GESTURE_TWO

GESTURE_THREE

HAND_UP

FACE_CENTERED

SMILE

La lógica del juego interpreta dichos eventos.

---

# Principios de Desarrollo

Todo el código debe escribirse en TypeScript.

No utilizar JavaScript.

Evitar duplicación de código.

Evitar componentes monolíticos.

Toda funcionalidad reutilizable debe abstraerse.

Preferir composición sobre herencia.

Mantener separación estricta de responsabilidades.

---

# Convenciones

Componentes React

PascalCase

PlayerCard.tsx

Hooks

camelCase

useCamera.ts

Servicios

camelCase

ranking.service.ts

Escenas Phaser

PascalCase

GameScene.ts

---

# Gestión del Estado

Estado global

Zustand

Estado local

React Hooks

Nunca utilizar Context API para estado global del videojuego.

---

# Comunicación Backend

REST API.

Toda comunicación debe realizarse mediante servicios.

Nunca utilizar fetch directamente dentro de componentes visuales.

---

# Debugging

Nunca ignorar errores silenciosamente.

Todo error debe:

- registrarse
- documentarse
- corregirse

No utilizar:

console.log()

Como solución permanente.

Utilizar logging estructurado cuando se implemente.

---

# Calidad del Código

Funciones pequeñas.

Una responsabilidad por función.

Una responsabilidad por componente.

Código autoexplicativo.

Evitar comentarios innecesarios.

Preferir nombres descriptivos.

---

# Ruta de Implementación

Fase 1

Infraestructura

- Monorepo
- Backend
- Frontend

Fase 2

Aplicación React

- Router
- Navegación
- Layout

Fase 3

Backend

- Ranking
- API

Fase 4

Motor del Juego

- Phaser
- HUD
- Escenas

Fase 5

Visión Computacional

- Cámara
- MediaPipe

Fase 6

Gameplay

- Oleadas
- Eventos
- Vidas

Fase 7

Primer Minijuego

Fase 8

Resultados

Fase 9

Deploy