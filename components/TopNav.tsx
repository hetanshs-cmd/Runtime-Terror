
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Search, Globe, Menu, Sun, Moon, LogOut } from 'lucide-react';

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

        <button className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} relative`}>
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <button className={`flex items-center gap-2 p-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block">
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{user?.fullName || user?.username || 'Admin'}</p>
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
