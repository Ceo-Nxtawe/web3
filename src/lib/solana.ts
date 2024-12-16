import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(SOLANA_RPC_ENDPOINT);

export interface TokenTransaction {
  signature: string;
  blockTime: number;
  amount: number;
  tokenSymbol: string;
  type: 'send' | 'receive';
  from: string;
  to: string;
}

export async function getTokenTransactions(address: string): Promise<TokenTransaction[]> {
  try {
    const publicKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey);
    
    const transactions = await Promise.all(
      signatures.slice(0, 10).map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature);
        if (!tx) return null;

        // This is a simplified version - in a real app you'd need more complex parsing
        return {
          signature: sig.signature,
          blockTime: tx.blockTime || 0,
          amount: 0, // You'd parse this from the transaction
          tokenSymbol: 'SOL', // You'd get this from token metadata
          type: 'receive',
          from: tx.transaction.message.accountKeys[0].toString(),
          to: tx.transaction.message.accountKeys[1].toString(),
        };
      })
    );

    return transactions.filter((tx): tx is TokenTransaction => tx !== null);
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    return [];
  }
}