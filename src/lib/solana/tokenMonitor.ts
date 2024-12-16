import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_CONSTANTS } from '../constants/tokens';
import { SOLANA_CONFIG } from '../constants/solana';
import type { TokenEvent, TokenEventType } from '../types/solana';

export class TokenMonitor {
  private connection: Connection;
  private mintAddress: PublicKey;
  private listeners: ((event: TokenEvent) => void)[] = [];
  private subscriptionId: number | null = null;

  constructor() {
    try {
      this.connection = new Connection(SOLANA_CONFIG.RPC_ENDPOINT, {
        commitment: 'confirmed',
        wsEndpoint: SOLANA_CONFIG.WS_ENDPOINT,
      });
      this.mintAddress = new PublicKey(TOKEN_CONSTANTS.MINT_ADDRESS);
    } catch (error) {
      console.error('Failed to initialize TokenMonitor:', error);
      throw error;
    }
  }

  public subscribe(callback: (event: TokenEvent) => void): () => void {
    this.listeners.push(callback);
    
    if (this.listeners.length === 1) {
      this.startMonitoring();
    }

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
      if (this.listeners.length === 0) {
        this.stopMonitoring();
      }
    };
  }

  private async startMonitoring() {
    try {
      this.subscriptionId = this.connection.onLogs(
        this.mintAddress,
        async (logs, context) => {
          try {
            const txDetails = await this.connection.getTransaction(context.signature, {
              commitment: 'confirmed',
              maxSupportedTransactionVersion: 0
            });

            if (!txDetails) return;

            const events = this.parseTransaction(txDetails);
            events.forEach(event => {
              this.listeners.forEach(listener => listener(event));
            });
          } catch (error) {
            console.error('Error processing transaction:', error);
          }
        },
        'confirmed'
      );
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  }

  private parseTransaction(txDetails: any): TokenEvent[] {
    const events: TokenEvent[] = [];
    
    try {
      txDetails.transaction.message.instructions.forEach((instruction: any) => {
        if (instruction.programId.toBase58() === TOKEN_CONSTANTS.PROGRAM_ID) {
          const data = Buffer.from(instruction.data, 'base64').toString('hex');
          
          let type: TokenEventType | null = null;
          if (data.startsWith(TOKEN_CONSTANTS.INSTRUCTION_TYPES.MINT_TO)) {
            type = 'mint';
          } else if (data.startsWith(TOKEN_CONSTANTS.INSTRUCTION_TYPES.BURN)) {
            type = 'burn';
          }

          if (type) {
            events.push({
              type,
              signature: txDetails.transaction.signatures[0],
              timestamp: txDetails.blockTime ? new Date(txDetails.blockTime * 1000) : new Date(),
              amount: 0, // Would need parsing logic for actual amount
            });
          }
        }
      });
    } catch (error) {
      console.error('Error parsing transaction:', error);
    }

    return events;
  }

  private stopMonitoring() {
    if (this.subscriptionId !== null) {
      try {
        this.connection.removeOnLogsListener(this.subscriptionId);
        this.subscriptionId = null;
      } catch (error) {
        console.error('Error stopping monitoring:', error);
      }
    }
  }
}