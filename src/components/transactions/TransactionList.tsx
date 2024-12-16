import React, { useEffect, useState } from 'react';
import { TokenTransaction } from '../../lib/types/solana';
import { getTokenTransactions } from '../../lib/solana/transactions';
import { TransactionError } from './TransactionError';
import { TransactionItem } from './TransactionItem';
import { TransactionListSkeleton } from './TransactionListSkeleton';

interface TransactionListProps {
  address: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ address }) => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const txs = await getTokenTransactions(address);
        if (mounted) {
          setTransactions(txs);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      mounted = false;
    };
  }, [address]);

  if (loading) {
    return <TransactionListSkeleton />;
  }

  if (error) {
    return <TransactionError message={error} />;
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="flex items-center justify-center h-32 text-gray-400">
          No transactions found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <TransactionItem key={tx.signature} transaction={tx} />
        ))}
      </div>
    </div>
  );
};