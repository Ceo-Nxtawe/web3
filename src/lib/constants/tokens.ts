import { PublicKey } from '@solana/web3.js';

export const TOKEN_CONSTANTS = {
  PROGRAM_ID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  MINT_ADDRESS: 'v8kp27iQox1vsuo7wCuPiYGh3ZFQDAy8hB4qwn5Abpump',
  INSTRUCTION_TYPES: {
    MINT_TO: 'c1',
    BURN: '44',
  },
} as const;