import type { GameEventsMap } from './GameEvents';
import type { PlayerEventsMap } from './PlayerEvents';
import type { VisionEventsMap } from './VisionEvents';

/**
 * AllEventsMap
 *
 * Mapa maestro que agrupa todos los eventos fuertemente tipados del dominio del juego.
 */
export type AllEventsMap = GameEventsMap & PlayerEventsMap & VisionEventsMap;

export type EventKey = keyof AllEventsMap;
export type EventHandler<K extends EventKey> = (payload: AllEventsMap[K]) => void;

/**
 * EventBus
 *
 * Bus de eventos en memoria completamente desacoplado para la comunicación interna entre módulos.
 * Soporta publicación, suscripción fuertemente tipada y limpieza de manejadores.
 */
export class EventBus {
  private static instance: EventBus | null = null;
  private listeners: Map<string, Set<(payload: unknown) => void>> = new Map();

  /**
   * Obtiene la instancia singleton del EventBus.
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Publica un evento fuertemente tipado a todos los suscriptores registrados.
   */
  public publish<K extends EventKey>(eventName: K, payload: AllEventsMap[K]): void {
    const handlers = this.listeners.get(eventName as string);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[EventBus] Error handling event '${String(eventName)}':`, error);
        }
      });
    }
  }

  /**
   * Suscribe una función manejadora a un evento específico.
   * Retorna una función de desuscripción para facilitar la limpieza.
   */
  public subscribe<K extends EventKey>(eventName: K, handler: EventHandler<K>): () => void {
    const eventStr = eventName as string;
    if (!this.listeners.has(eventStr)) {
      this.listeners.set(eventStr, new Set());
    }

    const handlers = this.listeners.get(eventStr)!;
    const castedHandler = handler as (payload: unknown) => void;
    handlers.add(castedHandler);

    return () => {
      this.unsubscribe(eventName, handler);
    };
  }

  /**
   * Remueve una suscripción específica de un evento.
   */
  public unsubscribe<K extends EventKey>(eventName: K, handler: EventHandler<K>): void {
    const eventStr = eventName as string;
    const handlers = this.listeners.get(eventStr);
    if (handlers) {
      handlers.delete(handler as (payload: unknown) => void);
      if (handlers.size === 0) {
        this.listeners.delete(eventStr);
      }
    }
  }

  /**
   * Elimina todas las suscripciones registradas.
   */
  public clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = EventBus.getInstance();
