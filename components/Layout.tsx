import React, { useState, useEffect } from 'react';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import HomePage from '../pages/HomePage';
import HealthcarePage from '../pages/HealthcarePage';
import AgriculturePage from '../pages/AgriculturePage';
import AlertsPage from '../pages/AlertsPage';
import SystemHealthPage from '../pages/SystemHealthPage';
import AdminPage from '../pages/AdminPage';
import HospitalRegistrationPage from '../pages/HospitalRegistrationPage';
import FarmerRegistrationPage from '../pages/FarmerRegistrationPage';
import Settings from './Settings';

interface LayoutProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onLogout?: () => void;
  user?: { username: string } | null;
}

const Layout: React.FC<LayoutProps> = ({ isDark, setIsDark, onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileClose = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className={`fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-black/30'}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
        isDark={isDark}
        onMobileClose={handleMobileClose}
        user={user}
      />

      <div className={`flex-1 flex flex-col ${!isMobile ? (sidebarOpen ? 'ml-64' : 'ml-16') : 'ml-0'}`}>
        <TopNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isDark={isDark}
          setIsDark={setIsDark}
          onLogout={onLogout}
          user={user}
        />

        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage isDark={isDark} />} />
              <Route path="/healthcare" element={<HealthcarePage isDark={isDark} user={user} />} />
              <Route path="/agriculture" element={<AgriculturePage isDark={isDark} user={user} />} />
              <Route path="/alerts" element={<AlertsPage isDark={isDark} />} />
              <Route path="/system-health" element={<SystemHealthPage isDark={isDark} />} />
              <Route path="/admin" element={<AdminPage isDark={isDark} user={user} />} />
              <Route path="/hospital-registration" element={<HospitalRegistrationPage isDark={isDark} user={user} />} />
              <Route path="/farmer-registration" element={<FarmerRegistrationPage isDark={isDark} user={user} />} />
              <Route path="/settings" element={<Settings isDark={isDark} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;