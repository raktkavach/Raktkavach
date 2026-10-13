export type EventType =
  | "EMERGENCY_REQUEST"
  | "NATIONAL_VALIDATE"
  | "WHO_APPROVE"
  | "EMERGENCY_BROADCAST"
  | "NODE_REGISTERED"
  | "BLOOD_TRANSFERRED"
  | "INTEGRITY_LOG"
  | "BIOMETRIC_VERIFIED";

export interface RaktEvent {
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: string;
  nodeId: string;
}

type Listener = (event: RaktEvent) => void;

class EventBus {
  private listeners: Map<string, Listener[]> = new Map();
  private eventLog: RaktEvent[] = [];

  publish(event: Omit<RaktEvent, "timestamp">): void {
    const full: RaktEvent = { ...event, timestamp: new Date().toISOString() };
    this.eventLog = [...this.eventLog.slice(-199), full];
    (this.listeners.get(event.type) ?? []).forEach(fn => fn(full));
    (this.listeners.get("*") ?? []).forEach(fn => fn(full));
  }

  subscribe(type: EventType | "*", fn: Listener): () => void {
    const prev = this.listeners.get(type) ?? [];
    this.listeners.set(type, [...prev, fn]);
    return () => {
      const cur = this.listeners.get(type) ?? [];
      this.listeners.set(type, cur.filter(l => l !== fn));
    };
  }

  getLog(): RaktEvent[] {
    return [...this.eventLog];
  }
}

export const eventBus = new EventBus();
