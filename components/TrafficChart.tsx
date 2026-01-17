
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const data = [
  { time: '00:00', requests: 1200 },
  { time: '03:00', requests: 900 },
  { time: '06:00', requests: 2400 },
  { time: '09:00', requests: 4800 },
  { time: '12:00', requests: 6200 },
  { time: '15:00', requests: 5400 },
  { time: '18:00', requests: 4100 },
  { time: '21:00', requests: 2800 },
  { time: '23:59', requests: 1900 },
];

const TrafficChart: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-indigo-400" />
            Live National Traffic Monitor
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Real-time aggregate API throughput across DPI nodes</p>
        </div>
        
        <div className="flex gap-6 self-end md:self-auto">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Grid Status</p>
            <p className="text-sm md:text-base font-black text-emerald-400">OPTIMIZED</p>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Velocity</p>
            <p className="text-sm md:text-base font-black text-indigo-400 flex items-center gap-1 justify-end">
              <TrendingUp className="w-4 h-4" /> +14%
            </p>
          </div>
        </div>
      </div>

      <div className="h-[250px] md:h-[300px] lg:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.4} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10}}
              width={35}
            />
            <Tooltip 
              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
              itemStyle={{color: '#f8fafc', fontSize: '12px'}}
              labelStyle={{fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px'}}
            />
            <Area 
              type="monotone" 
              dataKey="requests" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRequests)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;
