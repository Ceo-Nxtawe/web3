import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TransactionErrorProps {
  message: string;
}

export const TransactionError: React.FC<TransactionErrorProps> = ({ message }) => (
  <div className="flex items-center justify-center h-64">
    <div className="bg-red-500/10 p-4 rounded-lg flex items-center gap-3 text-red-400">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  </div>
);