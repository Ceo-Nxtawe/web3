import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { TokenTransaction } from '../../lib/types/solana';

interface TransactionItemProps {
  transaction: TokenTransaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction: tx }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${tx.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        {tx.type === 'receive' ? (
          <ArrowDownRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">
          {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount} {tx.tokenSymbol}
        </p>
        <p className="text-xs text-gray-400">
          {formatDistanceToNow(tx.blockTime * 1000, { addSuffix: true })}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-gray-400">
        {tx.type === 'receive' ? 'From' : 'To'}:
      </p>
      <p className="text-sm font-mono">
        {(tx.type === 'receive' ? tx.from : tx.to).slice(0, 8)}...
      </p>
    </div>
  </div>
);