import React from 'react';
import { Activity } from 'lucide-react';

interface AlertsPageProps {
  isDark: boolean;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ isDark }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[50vh] p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <Activity className="w-12 h-12 mb-4 opacity-50" />
      <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
      <p className="text-sm max-w-md">Centralized alert management system and notification dashboard is under development.</p>
    </div>
  );
};

export default AlertsPage;