import React, { useEffect, useState, useCallback } from 'react';
import { TokenMonitor } from '../../lib/solana/monitors/tokenMonitor';
import { TokenEventItem } from './TokenEventItem';
import type { TokenEvent } from '../../lib/types/solana';
import { AlertCircle, Loader2 } from 'lucide-react';

export const TokenMonitorList: React.FC = () => {
  const [events, setEvents] = useState<TokenEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewEvent = useCallback((event: TokenEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    let monitor: TokenMonitor | null = null;
    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    const initializeMonitor = async () => {
      try {
        monitor = new TokenMonitor();
        if (mounted) {
          setIsConnected(true);
          setError(null);
        }

        unsubscribe = monitor.subscribe(handleNewEvent);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Solana network';
        if (mounted) {
          setError(errorMessage);
          setIsConnected(false);
        }
      }
    };

    initializeMonitor();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
      setIsConnected(false);
    };
  }, [handleNewEvent]);

  if (error) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Live Token Activity</h2>
        {isConnected && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Monitoring
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          Waiting for token activity...
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <TokenEventItem key={event.signature} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};