import React from 'react';
import { FileSearch, Layers, Upload, BrainCircuit, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function DocSwarm() {
  const documents = [
    { name: 'Commercial_Invoice_882.pdf', type: 'INVOICE', confidence: 0.98, status: 'VERIFIED' },
    { name: 'Bill_of_Lading_TK9.pdf', type: 'BOL', confidence: 0.94, status: 'VERIFIED' },
    { name: 'Certificate_Origin_AF.pdf', type: 'COO', confidence: 0.99, status: 'VERIFIED' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-swarm-gradient">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">DocSwarm™</h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Vision Transformer Document Intelligence</p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-cyan-400 transition-colors">
                <Upload className="w-4 h-4" /> New Extraction
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="agent-card">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Layers className="w-4 h-4 text-cyan-400" />
                Extraction Pipeline
              </h2>
              <div className="space-y-4">
                {documents.map((doc, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={doc.name} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                         <FileSearch className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{doc.name}</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase">{doc.type} • CONFIDENCE: {(doc.confidence * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">{doc.status}</span>
                       <CheckCircle className="w-4 h-4 text-cyan-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5">
                  <BrainCircuit className="w-8 h-8 text-cyan-500/50 mb-4" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Structure Graph</h3>
                  <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                    DocSwarm uses cross-referencing agents to verify invoice data against BOL and insurance certificates automatically.
                  </p>
               </div>
               <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col justify-end min-h-[200px]">
                  <div className="text-4xl font-black text-white mb-2">400ms</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Average Extraction Time</div>
               </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 agent-card overflow-hidden">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Active Field Agents</div>
             <div className="space-y-6">
                {[
                  { name: 'Entity_Recognizer', tasks: 124 },
                  { name: 'IBAN_Validator', tasks: 88 },
                  { name: 'Tax_Code_Parser', tasks: 45 },
                  { name: 'Signature_Vision', tasks: 12 },
                ].map((agent, i) => (
                  <div key={agent.name} className="relative">
                    <div className="flex justify-between items-center mb-2 px-2">
                       <span className="text-[10px] font-mono text-slate-300 tracking-tighter">&gt; {agent.name}</span>
                       <span className="text-[10px] font-mono text-cyan-500">{agent.tasks} jobs</span>
                    </div>
                    <div className="h-[1px] bg-white/10 w-full" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${60 + Math.random() * 30}%` }}
                      className="absolute bottom-0 h-[1px] bg-cyan-500" 
                    />
                  </div>
                ))}
             </div>
             
             <div className="mt-20 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-2">TitanCore™ Sync Status</div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                   <div className="text-[10px] font-mono text-white tracking-tighter uppercase">Document Swarm Consensus Active</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
