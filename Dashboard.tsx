import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  FileText, 
  Globe, 
  Database, 
  Cpu, 
  Activity, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Workflow,
  Zap
} from 'lucide-react';
import { Transaction, SwarmStatus, AgentLog } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

export default function Dashboard() {
  const { user } = useFirebase();
  const [stats, setStats] = useState<SwarmStatus | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);

  const createDemoTx = async () => {
    if (!user) return;
    const id = `tx_${Math.random().toString(36).slice(2, 6)}`;
    const tx = {
      id,
      vertical: 'ecommerce',
      amount: 1250,
      currency: 'USD',
      status: 'locked',
      buyer: user.uid,
      seller: 'shop_fast',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'transactions', id), tx);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'transactions');
    }
  };

  useEffect(() => {
    fetch('/api/swarm/status').then(res => res.json()).then(setStats);
    
    // Listen to Transactions
    const txQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(10));
    const unsubTxs = onSnapshot(txQuery, (snapshot) => {
      const txs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          vertical: data.vertical,
          amount: { value: data.amount, currency: data.currency },
          status: data.status,
          buyer: data.buyer,
          seller: data.seller,
          updatedAt: data.createdAt
        } as Transaction;
      });
      setTransactions(txs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'transactions'));

    // Listen to Logs
    const logQuery = query(collection(db, 'agent_logs'), orderBy('timestamp', 'desc'), limit(50));
    const unsubLogs = onSnapshot(logQuery, (snapshot) => {
      const mappedLogs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          agent: data.agentId,
          verdict: data.verdict,
          score: data.score,
          timestamp: data.timestamp,
          message: data.message
        } as AgentLog;
      });
      setLogs(mappedLogs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'agent_logs'));

    return () => {
      unsubTxs();
      unsubLogs();
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-swarm-gradient">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Top Row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 agent-card overflow-hidden group relative">
             <div className="absolute top-6 right-6 flex gap-2">
                <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono rounded tracking-tighter uppercase">MAINNET_NODE_01</span>
             </div>
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Active Consensus Stream
             </h2>
             <div className="h-64 flex items-center justify-center relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-48 h-48 border border-cyan-500/20 rounded-full" 
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-32 h-32 border border-cyan-500/40 rounded-full" 
                />
                <div className="absolute w-20 h-20 border border-cyan-400/60 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                   <div className="text-xl font-bold text-cyan-400 font-mono tracking-tighter">98.4%</div>
                   <div className="text-[8px] font-mono text-cyan-500 uppercase">Trust</div>
                </div>
                
                {/* Random particles for swarm effect */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                      y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                      opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  />
                ))}
             </div>
             <div className="mt-8 flex justify-between items-end">
                <div>
                   <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total Transaction Value</div>
                   <div className="text-3xl font-black text-white">
                     ${transactions.reduce((acc, tx) => acc + tx.amount.value, 0).toLocaleString()}.00 <span className="text-xs font-normal text-slate-500">USD (EQUIV)</span>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-tighter">NLP_SENTIMENT: POSITIVE (0.98)</div>
                   <div className="text-[10px] font-mono text-slate-600">ORACLE_STATUS: WAITING_FOR_SYNC</div>
                </div>
             </div>
          </div>

          <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
             <StatCard 
                title="Swarm Nodes" 
                value={stats?.activeAgents ?? '1024'} 
                sub="Active Intelligent Agents" 
                icon={<Cpu className="text-cyan-400" />} 
                className="h-full"
              />
              <div className="p-6 rounded-3xl bg-cyan-500 text-black flex flex-col justify-between group overflow-hidden relative">
                <Zap className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono">Real-time Performance</div>
                  <div className="text-3xl font-black mt-1 leading-none uppercase">Compute</div>
                </div>
                <div className="mt-6">
                  <div className="text-xs font-bold uppercase tracking-tighter mb-1">Engine Throughput</div>
                  <div className="text-2xl font-black leading-none">{stats?.tps.toLocaleString() ?? '10,240'} TPS</div>
                  <div className="text-[9px] font-bold uppercase opacity-60 mt-4 font-mono tracking-widest">CUDA_CORES: UTIL_92.4%</div>
                </div>
              </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-12 gap-4">
           {/* Transactions list - span 7 */}
           <div className="col-span-12 lg:col-span-8 space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Transaction Stream
                </div>
                <button 
                  onClick={createDemoTx}
                  className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors"
                >
                  + DEMO TX
                </button>
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {transactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </AnimatePresence>
              </div>
           </div>

           {/* Logs - span 5 */}
           <div className="col-span-12 lg:col-span-4 space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Workflow className="w-4 h-4 text-cyan-400" />
                Agent Reasoning Log
              </h2>
              <div className="bg-black border border-white/10 rounded-3xl p-5 h-[450px] overflow-hidden flex flex-col font-mono text-[10px]">
                <div className="flex items-center gap-1.5 mb-4 border-b border-white/5 pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 overflow-y-auto space-y-5 scrollbar-hide">
                  {logs.map((log) => (
                    <AgentLogItem key={log.id} log={log} />
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, className }: { title: string; value: string | number; sub: string; icon: React.ReactNode; className?: string }) {
  return (
    <div className={`agent-card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{title}</span>
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black text-white tracking-tighter leading-none">{value}</div>
      <div className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-tight">{sub}</div>
      
      <div className="mt-6">
         <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "75%" }}
               className="bg-cyan-500 h-full" 
            />
         </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction; key?: any }) {
  const statusColors = {
    locked: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
    released: 'border-green-500/30 bg-green-500/5 text-green-400',
    disputed: 'border-red-500/30 bg-red-500/5 text-red-400',
    pendingSettlement: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
            <FileText className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
         </div>
         <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{tx.id}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 uppercase font-mono tracking-tighter">
                {tx.vertical.replace('_', ' ')}
              </span>
            </div>
            <div className="text-base font-bold text-slate-100 tracking-tight">
              Escrow for {tx.amount.value.toLocaleString()} {tx.amount.currency}
            </div>
         </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1.5 rounded-full border ${statusColors[tx.status]} text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5`}>
          {tx.status === 'locked' && <Lock className="w-3 h-3" />}
          {tx.status === 'released' && <CheckCircle2 className="w-3 h-3" />}
          {tx.status === 'disputed' && <AlertTriangle className="w-3 h-3" />}
          {tx.status}
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 hover:text-cyan-400 border border-white/10 transition-colors flex items-center justify-center"
        >
          <Activity className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function AgentLogItem({ log }: { log: AgentLog; key?: any }) {
  const getVerdictColor = (v: string) => {
    switch(v) {
      case 'CLEAR': return 'text-green-500';
      case 'ALERT': return 'text-red-500';
      case 'EXECUTE': return 'text-cyan-400';
      case 'QUARANTINE': return 'text-amber-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center opacity-50">
        <span className="font-mono text-[9px] uppercase tracking-widest">&gt; {log.agent}</span>
        <span className="font-mono text-[8px]">
          {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
        </span>
      </div>
      <div className="text-slate-300 flex gap-2">
        <span className={getVerdictColor(log.verdict)}>[{log.verdict}]</span>
        <span className="leading-tight opacity-80">{log.message}</span>
      </div>
      {log.score !== undefined && (
        <div className="mt-1 flex items-center gap-2">
          <div className="h-[2px] flex-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500" style={{ width: `${(1 - log.score) * 100}%` }} />
          </div>
          <span className="text-[8px] font-mono text-cyan-500/50">T_{((1 - log.score) * 100).toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}
