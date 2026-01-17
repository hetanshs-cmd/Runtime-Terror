
import React from 'react';
import { Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { HealthStatus } from '../types';

const services = [
  { name: 'Healthcare API', status: HealthStatus.HEALTHY, latency: '42ms', uptime: '99.99%' },
  { name: 'Agriculture API', status: HealthStatus.HEALTHY, latency: '85ms', uptime: '99.95%' },
  { name: 'Finance Gateway', status: HealthStatus.HEALTHY, latency: '12ms', uptime: '99.99%' },
  { name: 'Identity Service', status: HealthStatus.HEALTHY, latency: '24ms', uptime: '99.99%' },
];

const APIHealthMonitor: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        API Cluster Health
      </h3>

      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
              {svc.status === HealthStatus.HEALTHY ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : svc.status === HealthStatus.DEGRADED ? (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="text-sm font-medium text-slate-300">{svc.name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <p className="text-slate-500">Latency</p>
                <p className={`font-mono ${svc.status === HealthStatus.HEALTHY ? 'text-slate-300' : 'text-amber-400'}`}>{svc.latency}</p>
              </div>
              <div className="text-right min-w-[50px]">
                <p className="text-slate-500">Uptime</p>
                <p className="text-slate-300 font-mono">{svc.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIHealthMonitor;
