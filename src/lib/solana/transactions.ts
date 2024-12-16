import { PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from '../constants/solana';
import { getConnection } from './connection';
import type { TokenTransaction } from '../types/solana';

export async function getTokenTransactions(address: string): Promise<TokenTransaction[]> {
  if (!isValidSolanaAddress(address)) {
    throw new Error('Invalid Solana address provided');
  }

  const publicKey = new PublicKey(address);
  const conn = getConnection();
  
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < SOLANA_CONFIG.RETRY_ATTEMPTS) {
    try {
      const signatures = await conn.getSignaturesForAddress(
        publicKey,
        { limit: SOLANA_CONFIG.FETCH_LIMIT }
      );
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await conn.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });
            
            if (!tx) return null;

            // Parse transaction details
            const isReceive = tx.transaction.message.accountKeys[1].equals(publicKey);
            
            return {
              signature: sig.signature,
              blockTime: tx.blockTime || 0,
              amount: 0, // Would need token amount parsing logic
              tokenSymbol: 'SOL',
              type: isReceive ? 'receive' : 'send',
              from: tx.transaction.message.accountKeys[0].toString(),
              to: tx.transaction.message.accountKeys[1].toString(),
            };
          } catch (err) {
            console.warn(`Failed to fetch transaction ${sig.signature}:`, err);
            return null;
          }
        })
      );

      return transactions.filter((tx): tx is TokenTransaction => tx !== null);
    } catch (error) {
      lastError = error as Error;
      attempt++;
      if (attempt < SOLANA_CONFIG.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, SOLANA_CONFIG.RETRY_DELAY));
      }
    }
  }

  throw lastError || new Error('Failed to fetch transactions after multiple attempts');
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}