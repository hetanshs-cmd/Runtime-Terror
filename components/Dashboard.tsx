
import React from 'react';
import KPICard from './KPICard';
import AlertFeed from './AlertFeed';
import { Users, Server, Map, Activity, Clock, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  isDark?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDark = true }) => {
  return (
    <div className="space-y-4">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Total Users" value="1.24B" trend="+2.4%" icon={Users} color="indigo" isDark={isDark} />
        <KPICard title="Active Services" value="482" trend="stable" icon={Server} color="blue" isDark={isDark} />
        <KPICard title="Regions" value="36" trend="100%" icon={Map} color="emerald" isDark={isDark} />
        <KPICard title="System Uptime" value="99.98%" trend="+0.01%" icon={Activity} color="cyan" isDark={isDark} />
        <KPICard title="Requests / Day" value="4.8M" trend="+12%" icon={Clock} color="purple" isDark={isDark} />
        <KPICard title="Alerts Today" value="12" trend="-4" icon={AlertTriangle} color="rose" isDark={isDark} />
      </div>

      {/* Alert Feed */}
      <div className="w-full">
        <AlertFeed isDark={isDark} />
      </div>
    </div>
  );
};

export default Dashboard;
