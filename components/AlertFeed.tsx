
import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, Info, ShieldAlert, Heart, Sprout, Building2, Trash } from 'lucide-react';
import { AlertSeverity } from '../types';

interface AlertItem {
  id: number | string;
  type: string;
  message: string;
  severity: string;
  createdAt?: string;
}

interface AlertFeedProps {
  isDark?: boolean;
  alerts?: AlertItem[]; // optional: if provided, component will render these
  showControls?: boolean; // whether to show delete controls
  onDelete?: (id: number | string) => void;
}

const AlertFeed: React.FC<AlertFeedProps> = ({ isDark = true, alerts: initialAlerts, showControls = false, onDelete }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAlerts) return; // use passed-in alerts
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAlerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error('Failed to load alerts', e);
    } finally {
      setLoading(false);
    }
  };
  const getSeverityStyles = (severity: AlertSeverity | string) => {
    switch (severity) {
      case AlertSeverity.CRITICAL: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case AlertSeverity.HIGH: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case AlertSeverity.MEDIUM: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case AlertSeverity.LOW: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Healthcare': return Heart;
      case 'Agriculture': return Sprout;

      default: return ShieldAlert;
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Alerts</h3>
        <button onClick={() => fetchAlerts()} className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Refresh</button>
      </div>

      {loading ? (
        <div className="py-4 text-center">Loading alerts...</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <div key={alert.id} className={`flex gap-3 p-3 border rounded ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center border ${getSeverityStyles((alert.severity as AlertSeverity) || alert.severity)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {alert.type}
                    </p>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1`}>
                      <Clock className="w-3 h-3" /> {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{alert.message}</p>
                </div>
                {showControls && onDelete && (
                  <button onClick={() => onDelete(alert.id)} className="p-2 rounded hover:bg-red-600/10 text-red-500">
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <button className={`w-full py-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'}`}>
          Acknowledge All
        </button>
      </div>
    </div>
  );
};

export default AlertFeed;
