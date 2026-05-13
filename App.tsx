/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HydraGuard from './components/HydraGuard';
import ArbitrAI from './components/ArbitrAI';
import OmniCompliance from './components/OmniCompliance';
import DocSwarm from './components/DocSwarm';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'frauds':
        return <HydraGuard />;
      case 'disputes':
        return <ArbitrAI />;
      case 'docs':
        return <DocSwarm />;
      case 'compliance':
        return <OmniCompliance />;
      case 'bridge':
        return <Placeholder title="ChainBridge™ On-Chain Oracle" icon="🔗" desc="AI-verified smart contract triggers for EVM-compatible settlement." />;
      case 'vault':
        return <Placeholder title="ModelVault™ Asset Protection" icon="📦" desc="Enterprise-grade escrow for AI models, weights, and training datasets." />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'frauds', label: 'HydraGuard' },
    { id: 'disputes', label: 'ArbitrAI' },
    { id: 'docs', label: 'DocSwarm' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'bridge', label: 'ChainBridge' },
    { id: 'vault', label: 'ModelVault' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans overflow-hidden italic-disable text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-white/10 flex items-center justify-between px-6 z-50">
        <h1 className="font-bold text-white tracking-tight uppercase">Swarm<span className="text-cyan-400">Escrow</span></h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 p-2"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 pt-24 px-6 overflow-y-auto"
          >
            <nav className="space-y-4 pb-12">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-6 rounded-3xl font-black uppercase tracking-tighter text-xl border transition-all ${
                    activeTab === item.id 
                    ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
                    : 'text-slate-400 border-white/5 bg-white/[0.02]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>


      <main className="flex-1 flex flex-col pt-16 lg:pt-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Placeholder({ title, icon, desc }: { title: string; icon: string; desc?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-swarm-gradient relative overflow-hidden">
      <div className="text-7xl mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">{icon}</div>
      <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">{title}</h2>
      <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest max-w-sm mx-auto leading-relaxed mb-12">
        {desc || "Agent swarms are currently processing real-time signals for this module. Integrating TitanCore™ scale architecture for $34B market readiness."}
      </p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 h-48 animate-pulse flex flex-col justify-end text-left group hover:border-cyan-500/30 transition-colors">
            <div className="h-[1px] bg-white/10 rounded-full w-full mb-6 relative overflow-hidden">
               <motion.div 
                  animate={{ x: [-100, 400] }}
                  transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-full bg-cyan-400" 
               />
            </div>
            <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-10 left-10 flex gap-6 opacity-20 hidden md:flex">
         <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">system_active</div>
         <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">node_verification_sync_pass</div>
      </div>
    </div>
  );
}


