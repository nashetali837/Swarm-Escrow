import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  FileSearch, 
  Globe2, 
  Link2, 
  Box, 
  Settings,
  Scale,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Main Control', icon: BarChart3 },
    { id: 'frauds', label: 'HydraGuard Agent', icon: ShieldCheck },
    { id: 'docs', label: 'DocSwarm AI', icon: FileSearch },
    { id: 'compliance', label: 'OmniCompliance', icon: Globe2 },
    { id: 'disputes', label: 'ArbitrAI Analysis', icon: Scale },
    { id: 'bridge', label: 'ChainBridge', icon: Link2 },
    { id: 'vault', label: 'ModelVault', icon: Box },
  ];

  return (
    <div className="w-64 bg-[#050505] border-r border-white/10 flex flex-col h-screen sticky top-0 hidden lg:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Zap className="text-black fill-black w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-none uppercase">Swarm<span className="text-cyan-400">Escrow</span></h1>
            <span className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mt-1 block">v4.2.0 Autonomous</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-white/10 text-cyan-400 border border-white/10' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] font-mono text-cyan-500/70 uppercase mb-2 text-center border-b border-white/5 pb-2">Compute Layer</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">CUDA_ACTIVE: 102.4T</div>
            </div>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">Torch2.0-AE OS Wrapper</div>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-300 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">System Config</span>
        </button>
      </div>
    </div>
  );
}
