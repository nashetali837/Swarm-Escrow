import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  Search, 
  CheckCircle2,
  Zap,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ArbitrAI() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const performAnalysis = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setAnalysis(null);

    try {
      const prompt = `
        As an AI agent specializing in e-commerce dispute resolution and NLP forensic analysis for Swarm Escrow, analyze the following chat between buyer and seller.
        
        TASKS:
        1. Extract Key Agreements: What did they actually agree on regarding price, shipping, condition, and timeline?
        2. Identify Points of Contention: Where are the misunderstandings or active disputes?
        3. Summarize Sentiment: Overall tone of the conversation (Aggressive, Cooperative, Deceptive, etc.)
        4. Highlight Critical Info: Any specific information an escrow agent MUST know (threats, bank detail changes, proof of delivery claims).
        5. Propose Resolution: A fair outcome based on standard e-commerce policies.
        
        Format the output as a clean JSON object with fields:
        agreements (array), contentions (array), sentiment (string), critical_alerts (array), proposed_resolution (string), confidence_score (0-100).
        
        Log:
        "${input}"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setAnalysis(JSON.parse(response.text));
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-swarm-gradient">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <Scale className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Arbitr<span className="text-indigo-400">AI</span>™</h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Autonomous Dispute Resolution Node</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Input Feed */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
             <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">Communication Feed</label>
                <span className="text-[8px] text-slate-600 font-mono">SUPPORTED: CHAT, EMAIL, SMS_HISTORY</span>
             </div>
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the disputed communication logs here..."
                className="w-full h-[500px] bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none placeholder:text-slate-700"
             />
             <button
                onClick={performAnalysis}
                disabled={isProcessing || !input.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 text-white font-black uppercase tracking-[0.2em] text-xs py-5 px-6 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/10"
             >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isProcessing ? "Analyzing Consensus..." : "Start Arbitrary Inference"}
             </button>
          </div>

          {/* Analysis Results */}
          <div className="col-span-12 lg:col-span-6">
             <div className="bg-black border border-white/10 rounded-3xl p-8 min-h-[600px] flex flex-col group relative">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center space-y-4"
                    >
                       <Zap className="w-12 h-12 text-indigo-500 animate-pulse" />
                       <p className="text-indigo-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Running_NLP_Forensics...</p>
                    </motion.div>
                  ) : analysis ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                       <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Inference Report</div>
                          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono rounded">CONFIDENCE: {analysis.confidence_score}%</div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <AnalysisBox title="Agreements" items={analysis.agreements} icon={<CheckCircle2 className="w-3 h-3 text-green-500" />} />
                          <AnalysisBox title="Contentions" items={analysis.contentions} icon={<AlertCircle className="w-3 h-3 text-red-500" />} />
                       </div>

                       <div className="space-y-2">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sentiment Analysis</div>
                          <div className="text-sm font-medium text-indigo-300 italic">"{analysis.sentiment}"</div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest">Critical Alerts for Agent:</h4>
                          <div className="space-y-2">
                             {analysis.critical_alerts.map((alert: string, i: number) => (
                                <div key={i} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-red-400 flex gap-2">
                                   <AlertCircle className="w-4 h-4 shrink-0" />
                                   {alert}
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 relative">
                          <div className="absolute -top-3 left-6 px-2 bg-black text-[9px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Proposed Resolution</div>
                          <p className="text-sm text-slate-300 leading-relaxed italic">"{analysis.proposed_resolution}"</p>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 space-y-4">
                       <MessageSquare className="w-16 h-16 text-slate-500" />
                       <div className="text-center">
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Awaiting Data Input</p>
                          <p className="text-[9px] text-slate-600 mt-2 font-mono">ArbitrAI™ Consensus protocol v4.2</p>
                       </div>
                    </div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisBox({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
            <span className="mt-1">{icon}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
