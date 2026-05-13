export type TransactionStatus = 'locked' | 'released' | 'disputed' | 'pendingSettlement';

export interface Transaction {
  id: string;
  vertical: string;
  amount: {
    value: number;
    currency: string;
  };
  status: TransactionStatus;
  buyer: string;
  seller: string;
  updatedAt: string;
}

export interface SwarmStatus {
  activeAgents: number;
  regions: string[];
  tps: number;
  fraudScore: number;
  lastSync: string;
}

export interface AgentLog {
  id: string;
  agent: string;
  verdict: 'CLEAR' | 'ALERT' | 'EXECUTE' | 'QUARANTINE';
  score?: number;
  timestamp: string;
  message: string;
}
