
import React from 'react';

interface StatusBadgeProps {
  status: 'good' | 'neutral' | 'poor';
  isDark?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isDark = true }) => {
  const config = {
    good: { 
      color: 'bg-green-500', 
      text: 'Good', 
      light: isDark ? 'bg-green-900 border-green-600' : 'bg-green-100 border-green-400',
      textColor: isDark ? 'text-green-400' : 'text-green-700'
    },
    neutral: { 
      color: 'bg-yellow-500', 
      text: 'Neutral', 
      light: isDark ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-100 border-yellow-400',
      textColor: isDark ? 'text-yellow-400' : 'text-yellow-700'
    },
    poor: { 
      color: 'bg-red-500', 
      text: 'Poor', 
      light: isDark ? 'bg-red-900 border-red-600' : 'bg-red-100 border-red-400',
      textColor: isDark ? 'text-red-400' : 'text-red-700'
    },
  };

  const { color, text, light, textColor } = config[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded border ${light}`}>
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className={`text-xs font-bold uppercase ${textColor}`}>
        {text}
      </span>
    </div>
  );
};

export default StatusBadge;
