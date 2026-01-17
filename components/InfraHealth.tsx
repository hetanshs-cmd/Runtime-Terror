
import React from 'react';
import { Database, Cpu, MemoryStick as Memory, Network } from 'lucide-react';

const InfraHealth: React.FC = () => {
  const metrics = [
    { icon: Cpu, label: 'CPU Cluster Load', value: 42, color: 'indigo' },
    { icon: Memory, label: 'Memory Allocation', value: 68, color: 'blue' },
    { icon: Network, label: 'Network Latency', value: 12, color: 'emerald' },
    { icon: Database, label: 'Storage Cluster', value: 89, color: 'purple' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
        <Server className="w-4 h-4" />
        Infrastructure Health
      </h3>

      <div className="space-y-6">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-300">
                <m.icon className="w-4 h-4 opacity-70" />
                <span className="text-xs font-medium">{m.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">{m.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  m.value > 80 ? 'bg-rose-500' : m.value > 60 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${m.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span>NODES: 1,420 ACTIVE</span>
        <span>REGIONS: 04 DATA CENTERS</span>
      </div>
    </div>
  );
};

import { Server } from 'lucide-react';
export default InfraHealth;
