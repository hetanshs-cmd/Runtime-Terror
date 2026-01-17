import React from 'react';
import { Activity } from 'lucide-react';

interface UrbanPageProps {
  isDark: boolean;
}

const UrbanPage: React.FC<UrbanPageProps> = ({ isDark }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[50vh] p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      <Activity className="w-12 h-12 mb-4 opacity-50" />
      <h2 className="text-lg font-semibold">Urban / Smart City</h2>
      <p className="text-sm max-w-md">Smart city infrastructure monitoring and urban development dashboard is under development.</p>
    </div>
  );
};

export default UrbanPage;