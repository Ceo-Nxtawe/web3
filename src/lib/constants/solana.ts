export const SOLANA_CONFIG = {
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  WS_ENDPOINT: 'wss://api.mainnet-beta.solana.com', // Changed back to WSS for WebSocket support
  DEFAULT_ADDRESS: '7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2',
  FETCH_LIMIT: 10,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;