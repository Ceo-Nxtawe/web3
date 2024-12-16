import { TokenEvent } from '../../types/solana';
import { BaseMonitor } from './baseMonitor';

export class TokenMonitor extends BaseMonitor<TokenEvent> {
  private ws: WebSocket | null = null;

  constructor() {
    super();
    this.connect();
  }

  private connect() {
    const wsUrl = import.meta.env.VITE_BACKEND_WS_URL || 'wss://your-railway-app.railway.app';
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const tokenEvent = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(tokenEvent));
      } catch (error) {
        console.error('Error processing websocket message:', error);
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
    };
  }

  protected startMonitoring(): void {
    // Monitoring is handled by WebSocket connection
  }

  protected stopMonitoring(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}