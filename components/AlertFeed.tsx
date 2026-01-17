
import React from 'react';
import { AlertCircle, Clock, Info, ShieldAlert, Heart, Sprout, Building2 } from 'lucide-react';
import { AlertSeverity } from '../types';

interface AlertFeedProps {
  isDark?: boolean;
}

const alerts = [
  { id: '1', type: 'Healthcare', msg: 'Hospital overload detected in Delhi NCR Zone-4', severity: AlertSeverity.CRITICAL, time: '2m ago' },
  { id: '2', type: 'Agriculture', msg: 'Heatwave warning for Western Rajasthan region', severity: AlertSeverity.HIGH, time: '14m ago' },
  { id: '3', type: 'Urban', msg: 'Utility stress: Water pipeline burst at Bangalore Hub', severity: AlertSeverity.MEDIUM, time: '45m ago' },
  { id: '4', type: 'System', msg: 'Backup sync delayed on Central Node-7', severity: AlertSeverity.LOW, time: '1h ago' },
  { id: '5', type: 'Healthcare', msg: 'Vaccine distribution logistics completed for Zone-2', severity: AlertSeverity.LOW, time: '2h ago' },
];

const AlertFeed: React.FC<AlertFeedProps> = ({ isDark = true }) => {
  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case AlertSeverity.HIGH: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case AlertSeverity.MEDIUM: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case AlertSeverity.LOW: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Healthcare': return Heart;
      case 'Agriculture': return Sprout;
      case 'Urban': return Building2;
      default: return ShieldAlert;
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Alerts</h3>
        <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>View All</button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);
          return (
            <div key={alert.id} className={`flex gap-3 p-3 border rounded ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center border ${getSeverityStyles(alert.severity)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className={`text-sm font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {alert.type}
                  </p>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1`}>
                    <Clock className="w-3 h-3" /> {alert.time}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{alert.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <button className={`w-full py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'}`}>
          Acknowledge All
        </button>
      </div>
    </div>
  );
};

export default AlertFeed;
