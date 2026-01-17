
import React from 'react';
import { HeartPulse, Sprout, Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const DomainStatus: React.FC = () => {
  const domains = [
    { 
      name: 'Healthcare', 
      icon: HeartPulse, 
      color: 'rose', 
      metrics: [
        { label: 'Hospitals Active', value: '42,802', trend: 'up' },
        { label: 'Overload Risk', value: 'LOW', trend: 'down' }
      ]
    },
    { 
      name: 'Agriculture', 
      icon: Sprout, 
      color: 'emerald', 
      metrics: [
        { label: 'Weather Alerts', value: '14 Active', trend: 'up' },
        { label: 'Advisory Reach', value: '82%', trend: 'up' }
      ]
    },
    { 
      name: 'Urban / Smart City', 
      icon: Building2, 
      color: 'indigo', 
      metrics: [
        { label: 'Utility Stress', value: 'MED', trend: 'none' },
        { label: 'Complaint Load', value: 'Low Vol', trend: 'down' }
      ]
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {domains.map((domain) => (
        <div key={domain.name} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group overflow-hidden relative">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg bg-${domain.color}-500/10 text-${domain.color}-400`}>
              <domain.icon className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-200">{domain.name}</h4>
          </div>

          <div className="space-y-4">
            {domain.metrics.map((m) => (
              <div key={m.label} className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200">{m.value}</span>
                  {m.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : m.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Minus className="w-3 h-3 text-slate-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Abstract mini chart overlay */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800 group-hover:bg-slate-700 transition-colors">
            <div className={`h-full bg-${domain.color}-500/50 w-2/3`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DomainStatus;
