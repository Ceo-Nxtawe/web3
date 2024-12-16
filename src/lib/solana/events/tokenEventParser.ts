import { ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import { TOKEN_CONSTANTS } from '../../constants/tokens';
import type { TokenEvent, TokenEventType } from '../../types/solana';

export function parseTokenEvent(
  txDetails: ParsedTransactionWithMeta,
  instruction: any
): TokenEvent | null {
  try {
    if (instruction.programId.toBase58() !== TOKEN_CONSTANTS.PROGRAM_ID) {
      return null;
    }

    const data = Buffer.from(instruction.data, 'base64').toString('hex');
    let type: TokenEventType | null = null;

    if (data.startsWith(TOKEN_CONSTANTS.INSTRUCTION_TYPES.MINT_TO)) {
      type = 'mint';
    } else if (data.startsWith(TOKEN_CONSTANTS.INSTRUCTION_TYPES.BURN)) {
      type = 'burn';
    }

    if (!type) {
      return null;
    }

    return {
      type,
      signature: txDetails.transaction.signatures[0],
      timestamp: txDetails.blockTime ? new Date(txDetails.blockTime * 1000) : new Date(),
      amount: 0, // Would need parsing logic for actual amount
    };
  } catch (error) {
    console.error('Error parsing token event:', error);
    return null;
  }
}