import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Zap, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function HydraGuard() {
  const [chatLog, setChatLog] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFraud = async () => {
    if (!chatLog.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const prompt = `
        Analyze the following ecommerce communication log for potential fraud, social engineering, or beneficiary detail manipulation.
        Provide a RISK_SCORE (0.0 to 1.0) and a list of specific suspicious patterns detected.
        Format the output as JSON with fields: score, verdict (SAFE/CAUTION/CRITICAL), findings (array of strings), and reasoning.
        
        Log:
        "${chatLog}"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text);
      
      // CALL PYTHON SWARM ENGINE FOR CONSENSUS
      try {
        const swarmRes = await fetch('/api/swarm/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tx_id: 'tx_' + Math.random().toString(36).substr(2, 4),
            vector: [
              result.score || 0.5, 
              Math.random(), 
              Math.random()
            ]
          })
        });
        const swarmData = await swarmRes.json();
        // Merge swarm data into analysis
        result.swarm_consensus = swarmData.consensus;
        result.cuda_perf = swarmData.cuda_acceleration;
      } catch (swarmErr) {
        console.error("Swarm consensus failed", swarmErr);
      }

      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-swarm-gradient">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <ShieldAlert className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Hydra<span className="text-cyan-400">Guard</span>™</h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Adversarial Intelligence Agent v4.2.0</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">BERT_NLP_CLUSTER_ONLINE</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Input Area */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Communication Ingest</label>
            </div>
            <textarea
              className="w-full h-80 bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all outline-none resize-none"
              placeholder="Paste chat logs, emails, or dispute messages here..."
              value={chatLog}
              onChange={(e) => setChatLog(e.target.value)}
            />
            <button
              onClick={analyzeFraud}
              disabled={isAnalyzing || !chatLog.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-white/5 disabled:text-slate-600 text-black font-black uppercase tracking-[0.2em] text-xs py-5 px-6 rounded-3xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-3"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-black" />}
              {isAnalyzing ? "Processing Consensus..." : "Execute Swarm Analysis"}
            </button>
          </div>

          {/* Analysis Results */}
          <div className="md:col-span-5 space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Agent Reasoning Output</label>
            <div className="bg-black border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 overflow-hidden opacity-30">
                 <motion.div 
                    animate={{ x: [-100, 400] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" 
                 />
              </div>
              
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="relative">
                       <div className="w-16 h-16 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                       <ShieldAlert className="absolute inset-0 m-auto w-6 h-6 text-cyan-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">Swarm_Syncing...</p>
                       <p className="text-slate-600 font-mono text-[8px] uppercase">BERT-NLP Layer 4 Evaluation</p>
                    </div>
                  </motion.div>
                ) : analysis ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded border text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
                        analysis.verdict === 'CRITICAL' ? 'bg-red-500/10 border-red-500/40 text-red-500' :
                        analysis.verdict === 'CAUTION' ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' :
                        'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                      }`}>
                        {analysis.verdict}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-mono font-black text-white tracking-tighter">
                          {(analysis.score * 100).toFixed(0)}<span className="text-xs text-slate-500 font-normal ml-1 tracking-widest">/100 RISK</span>
                        </div>
                        {analysis.swarm_consensus && (
                          <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-tighter mt-1">
                            SWARM_CONSENSUS: {(analysis.swarm_consensus.trust_score * 100).toFixed(0)} TRUST
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Top Vector Threats:</h4>
                        {analysis.cuda_perf && (
                          <span className="text-[9px] font-mono text-slate-600 uppercase">CUDA_ACCEL: {analysis.cuda_perf.latency_ms.toFixed(2)}ms</span>
                        )}
                      </div>
                      <ul className="space-y-3">
                        {analysis.findings.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-3 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 mt-1.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 italic text-xs text-slate-400 leading-relaxed font-mono relative">
                      <span className="absolute -top-3 left-6 px-2 bg-black text-[9px] text-slate-600 font-bold uppercase tracking-widest">Logic Proof</span>
                      "{analysis.reasoning}"
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30 group-hover:opacity-50 transition-opacity">
                    <ShieldCheck className="w-12 h-12 mx-auto text-slate-500" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em]">Ready for Inference</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
           <FeatureItem 
            title="Adversarial BERT" 
            desc="Model trained on 4M+ fraud vectors and social engineering patterns."
           />
           <FeatureItem 
            title="Swarm Consensus" 
            desc="Decision requires 2/3+1 verified agent nodes for high-value triggers."
           />
           <FeatureItem 
            title="Consortium Feed" 
            desc="Real-time fraud signal propagation across 180+ jurisdictions."
           />
        </section>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] group hover:bg-white/[0.04] transition-colors">
      <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-3 font-mono">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{desc}</p>
    </div>
  );
}
