import { Connection, ConnectionConfig } from '@solana/web3.js';
import { SOLANA_CONFIG } from '../constants/solana';

let connection: Connection | null = null;

export function createConnection(config?: Partial<ConnectionConfig>): Connection {
  const connectionConfig: ConnectionConfig = {
    commitment: 'confirmed',
    ...config
  };

  return new Connection(SOLANA_CONFIG.RPC_ENDPOINT, connectionConfig);
}

export function getConnection(): Connection {
  if (!connection) {
    connection = createConnection();
  }
  return connection;
}