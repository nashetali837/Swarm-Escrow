import React from 'react';
import { Globe2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function OmniCompliance() {
  const jurisdictions = [
    { name: 'European Union (MiCA)', status: 'SYNCED', latency: '42ms', agents: 12 },
    { name: 'United States (FinCEN)', status: 'SYNCED', latency: '88ms', agents: 24 },
    { name: 'India (PMLA/FEMA)', status: 'SYNCED', latency: '12ms', agents: 18 },
    { name: 'Singapore (MAS)', status: 'SYNCED', latency: '34ms', agents: 12 },
    { name: 'United Kingdom (FCA)', status: 'SYNCED', latency: '45ms', agents: 10 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-swarm-gradient">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">OmniCompliance™</h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Parallel Jurisdiction Agent Swarm v4.2</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-300 uppercase">180+ Regions Active</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Regional Agent Consensus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jurisdictions.map((j, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={j.name} 
                  className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-white tracking-tight">{j.name}</span>
                    <span className="text-[9px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase">{j.status}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Compute Latency</div>
                      <div className="text-xl font-black text-white font-mono">{j.latency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-cyan-500 uppercase">Agents: {j.agents}</div>
                      <div className="text-[8px] font-mono text-slate-600">CLUSTER: {j.name.split(' ')[0]}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                     <span className="text-[8px] font-mono text-slate-500 uppercase">KYC_VALID</span>
                     <span className="text-[8px] font-mono text-slate-500 uppercase">AML_SYNC</span>
                     <span className="text-[8px] font-mono text-slate-500 uppercase">SAR_ACTIVE</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="agent-card bg-cyan-500 text-black">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Compliance Verdict</span>
              </div>
              <h3 className="text-2xl font-black uppercase leading-tight mb-6">Autonomous SAR Engine</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/10 border border-black/5">
                  <div className="text-[9px] font-bold uppercase opacity-60 mb-1">SAR Filed (24h)</div>
                  <div className="text-2xl font-black">0</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/10 border border-black/5">
                  <div className="text-[9px] font-bold uppercase opacity-60 mb-1">Manual Reviews Required</div>
                  <div className="text-2xl font-black">0.02%</div>
                </div>
              </div>
              <button className="w-full mt-6 py-4 rounded-2xl bg-black text-white font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-colors">
                Download Regulatory Report <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Alerts</h4>
               <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-3">
                       <Zap className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                         [19:42:01] <span className="text-cyan-500">SYSTEM</span>: Rule {i*120} updated automatically from local regulatory stream.
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
