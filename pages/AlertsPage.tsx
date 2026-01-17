import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import AlertFeed from '../components/AlertFeed';

interface AlertsPageProps {
  isDark: boolean;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ isDark }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [newAlert, setNewAlert] = useState({ type: 'System', message: '', severity: 'CRITICAL' });

  useEffect(() => {
    fetchUser();
    fetchAlerts();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role || '');
      }
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert)
      });
      if (res.ok) {
        setNewAlert({ type: 'System', message: '', severity: 'CRITICAL' });
        fetchAlerts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create alert');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to create alert');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Delete this alert?')) return;
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchAlerts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete alert');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete alert');
    }
  };

  return (
    <div className={`p-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-8 h-8 opacity-60" />
        <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
      </div>

      {userRole === 'super_admin' && (
        <div className={`mb-6 p-4 border rounded ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-2">Create Alert (super_admin)</h3>
          <form onSubmit={handleCreate} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select className="p-2 border rounded" value={newAlert.type} onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}>
                <option>System</option>
                <option>Healthcare</option>
                <option>Agriculture</option>
              </select>
              <select className="p-2 border rounded" value={newAlert.severity} onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
              <input className="p-2 border rounded" placeholder="Message" value={newAlert.message} onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })} />
            </div>
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Alert</button>
            </div>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <div>Loading alerts...</div>
        ) : (
          <AlertFeed isDark={isDark} alerts={alerts.map(a => ({ id: a.id, type: a.type, message: a.message, severity: a.severity, createdAt: a.createdAt }))} showControls={userRole === 'super_admin'} onDelete={(id) => handleDelete(id)} />
        )}
      </div>
    </div>
  );
};

export default AlertsPage;