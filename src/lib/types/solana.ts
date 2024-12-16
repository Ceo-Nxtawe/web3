import { type PublicKey } from '@solana/web3.js';

export interface TokenTransaction {
  signature: string;
  blockTime: number;
  amount: number;
  tokenSymbol: string;
  type: 'send' | 'receive';
  from: string;
  to: string;
}

export interface TransactionError {
  code: string;
  message: string;
}

export interface SolanaConnectionConfig {
  endpoint: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

export type TokenEventType = 'mint' | 'burn';

export interface TokenEvent {
  type: TokenEventType;
  signature: string;
  timestamp: Date;
  amount: number;
}