import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_CONFIG } from '../constants/solana';
import type { TokenTransaction, TransactionError } from '../types/solana';

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_CONFIG.RPC_ENDPOINT, 'confirmed');
  }
  return connection;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getTokenTransactions(address: string): Promise<TokenTransaction[]> {
  if (!isValidSolanaAddress(address)) {
    console.error('Invalid Solana address provided');
    return [];
  }

  try {
    const publicKey = new PublicKey(address);
    const conn = getConnection();
    
    const signatures = await conn.getSignaturesForAddress(
      publicKey,
      { limit: SOLANA_CONFIG.FETCH_LIMIT }
    );
    
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await conn.getTransaction(sig.signature);
          if (!tx) return null;

          return {
            signature: sig.signature,
            blockTime: tx.blockTime || 0,
            amount: 0,
            tokenSymbol: 'SOL',
            type: 'receive',
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
    console.error('Error fetching token transactions:', error);
    return [];
  }
}