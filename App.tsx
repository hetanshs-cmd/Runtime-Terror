
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Layout from './components/Layout';
import Login from './components/Login';
import HomePage from './pages/HomePage';
import HealthcarePage from './pages/HealthcarePage';
import AlertsPage from './pages/AlertsPage';
import SystemHealthPage from './pages/SystemHealthPage';

const AppContent: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = '/api';

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedTheme = localStorage.getItem('govconnect_theme');
      const savedUser = localStorage.getItem('user');

      // Load theme preference
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      // Load user data
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      try {
        // Verify authentication with backend
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          credentials: 'include' // Important for cookies
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Authentication functions
  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Token refresh function
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Save theme preference
  const handleThemeChange = (dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem('govconnect_theme', dark ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading GovConnect...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isDark={isDark} onThemeChange={handleThemeChange} />;
  }

  return (
    <Layout isDark={isDark} setIsDark={handleThemeChange} onLogout={handleLogout} user={user} />
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
