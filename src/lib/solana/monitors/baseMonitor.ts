import { Connection, PublicKey } from '@solana/web3.js';
import { createConnection } from '../connection';

export abstract class BaseMonitor<T> {
  protected connection: Connection;
  protected listeners: ((event: T) => void)[] = [];
  protected subscriptionId: number | null = null;

  constructor(connection?: Connection) {
    this.connection = connection || createConnection();
  }

  public subscribe(callback: (event: T) => void): () => void {
    this.listeners.push(callback);
    
    if (this.listeners.length === 1) {
      this.startMonitoring();
    }

    return () => this.unsubscribe(callback);
  }

  protected unsubscribe(callback: (event: T) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
    if (this.listeners.length === 0) {
      this.stopMonitoring();
    }
  }

  protected abstract startMonitoring(): void;
  protected abstract stopMonitoring(): void;
}