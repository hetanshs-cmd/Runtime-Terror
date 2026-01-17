
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: 'indigo' | 'blue' | 'emerald' | 'cyan' | 'purple' | 'rose';
  isDark?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon: Icon, color, isDark = true }) => {
  return (
    <div className={`p-4 border rounded ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className={`text-sm font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{value}</p>
      </div>
    </div>
  );
};

export default KPICard;
