
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Search, Globe, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import AlertFeed from './AlertFeed';

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onLogout?: () => void;
  user?: { username: string } | null;
}

const TopNav: React.FC<TopNavProps> = ({ sidebarOpen, setSidebarOpen, isMobile, isDark, setIsDark, onLogout, user }) => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setAlerts(data.alerts || []);
        }
      } catch (e) {
        console.error('Failed to load alerts', e);
      }
    };

    fetchAlerts();
    const id = setInterval(fetchAlerts, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/login');
    }
  };
  return (
    <header className={`h-16 ${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-300'} flex items-center justify-between px-4`}>
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className={`${isDark ? 'bg-gray-600' : 'bg-gray-400'} w-8 h-8 rounded flex items-center justify-center font-bold text-white`}>
          G
        </div>
        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
          GovConnect
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setShowAlerts(!showAlerts)} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} relative`}>
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute -top-2 -right-2 px-1 text-xs bg-red-500 rounded-full text-white">{alerts.length}</span>
            )}
          </button>
          {showAlerts && (
            <div className={`absolute right-0 mt-2 w-96 z-50 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-lg p-2`}>
              <AlertFeed isDark={isDark} alerts={alerts} />
            </div>
          )}
        </div>

        <button className={`flex items-center gap-2 p-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block">
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{user?.username || 'Admin'}</p>
          </div>
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className={`p-2 rounded ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100'}`}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopNav;
