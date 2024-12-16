import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { TokenEvent } from '../../lib/types/solana';

interface TokenEventItemProps {
  event: TokenEvent;
}

export const TokenEventItem: React.FC<TokenEventItemProps> = ({ event }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${
        event.type === 'mint' ? 'bg-green-500/20' : 'bg-red-500/20'
      }`}>
        {event.type === 'mint' ? (
          <ArrowDownRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">
          {event.type === 'mint' ? 'Token Minted' : 'Token Burned'}
        </p>
        <p className="text-xs text-gray-400">
          {event.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-mono text-gray-400">
        {event.signature.slice(0, 8)}...
      </p>
    </div>
  </div>
);