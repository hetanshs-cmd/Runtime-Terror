
import React, { useState, useEffect } from 'react';
import { Sprout, Users, CloudRain, Sun, Wind, BarChart4, AlertTriangle, CloudSun, Plus, MapPin, Tractor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import KPICard from './KPICard';

interface AgricultureSectorProps {
  isDark?: boolean;
  user?: any;
}

interface Farmer {
  id: number;
  name: string;
  location: string;
  area_plot: number;
  crop_types: string;
  contact_number?: string;
  registration_date: string;
}

const cropData = [
  { name: 'Wheat', area: 4500, health: 92 },
  { name: 'Rice', area: 3800, health: 85 },
  { name: 'Maize', area: 2100, health: 78 },
  { name: 'Cotton', area: 1500, health: 65 },
  { name: 'Sugarcane', area: 2800, health: 88 },
];

const AgricultureSector: React.FC<AgricultureSectorProps> = ({ isDark = true, user }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    location: '',
    area_plot: 0,
    crop_types: '',
    contact_number: ''
  });

  useEffect(() => {
    fetchFarmers();
    fetchUserRole();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await fetch('/api/agriculture/farmers', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFarmers(data.farmers);
      }
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role || '');
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/agriculture/farmers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newFarmer),
      });
      if (response.ok) {
        setNewFarmer({ name: '', location: '', area_plot: 0, crop_types: '', contact_number: '' });
        fetchFarmers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to add farmer:', error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <Sprout className="text-green-500 w-6 h-6" />
            Agriculture & Farmer Welfare
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Predictive crop analysis and real-time weather monitoring</p>
        </div>
        <div className={`px-3 py-1 border rounded text-sm font-bold uppercase ${isDark ? 'bg-green-900 border-green-600 text-green-400' : 'bg-green-100 border-green-400 text-green-700'}`}>
          Harvest Active
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Farmers Registered" value={farmers.length.toString()} trend="+4.2%" icon={Users} color="emerald" isDark={isDark} />
        <KPICard title="Cultivation Area" value={`${farmers.reduce((sum, f) => sum + f.area_plot, 0)} ha`} trend="+0.5%" icon={Sprout} color="indigo" isDark={isDark} />
        <KPICard title="Active Alerts" value="14" trend="-2" icon={CloudRain} color="blue" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Farmer List Section */}
        <div className="space-y-4">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <Tractor className="w-5 h-5 text-green-500" />
              Registered Farmers ({farmers.length})
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading farmers...</span>
              </div>
            ) : farmers.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No farmers registered yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {farmers.map((farmer) => (
                  <div key={farmer.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded`}>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{farmer.name}</h4>
                    <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-3 h-3" />
                      {farmer.location}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{farmer.area_plot} ha</span>
                      <span className={`px-2 py-1 rounded bg-green-100 text-green-800`}>{farmer.crop_types}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weather Forecast Section */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <CloudSun className="w-5 h-5 text-blue-400" />
              Weather Forecast
            </h3>

            <div className="space-y-3">
              {[
                { region: 'Central India', cond: 'Sunny • 34°C', risk: 'NO RISK', riskColor: 'text-green-500', icon: Sun, iconColor: 'text-yellow-500' },
                { region: 'Coastal Bengal', cond: 'Rain • 28°C', risk: 'HIGH RISK', riskColor: 'text-red-500', icon: CloudRain, iconColor: 'text-blue-500' },
                { region: 'Northern Plains', cond: 'Windy • 41°C', risk: 'MODERATE', riskColor: 'text-yellow-500', icon: Wind, iconColor: 'text-gray-500' }
              ].map((w, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 border rounded ${isDark ? 'bg-gray-900 border-gray-600 hover:bg-gray-800' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded ${w.iconColor}`}>
                      <w.icon className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'} truncate`}>{w.region}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>{w.cond}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${w.riskColor}`}>{w.risk}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className={`w-full mt-4 py-2 text-white text-sm font-bold rounded ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}>
              Generate Advisory
            </button>
          </div>

          {/* Admin Form for Adding Farmers */}
          {userRole === 'admin' && (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
              <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Plus className="w-4 h-4 text-green-500" />
                Add New Farmer
              </h3>
              <form onSubmit={handleAddFarmer} className="space-y-3">
                <input
                  type="text"
                  placeholder="Farmer Name"
                  value={newFarmer.name}
                  onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newFarmer.location}
                  onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="number"
                  placeholder="Area Plot (hectares)"
                  value={newFarmer.area_plot}
                  onChange={(e) => setNewFarmer({ ...newFarmer, area_plot: parseFloat(e.target.value) })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Crop Types (comma separated)"
                  value={newFarmer.crop_types}
                  onChange={(e) => setNewFarmer({ ...newFarmer, crop_types: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={newFarmer.contact_number}
                  onChange={(e) => setNewFarmer({ ...newFarmer, contact_number: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm font-semibold"
                >
                  Add Farmer
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Crop Analysis Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <BarChart4 className="w-5 h-5 text-green-500" />
              Crop Data Analysis
            </h3>

            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#d1d5db"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: isDark ? '#1f2937' : '#f3f4f6', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: isDark ? '#111827' : '#ffffff', border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`, borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="area" radius={[4, 4, 0, 0]} barSize={30}>
                    {cropData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.health > 80 ? '#10b981' : entry.health > 70 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { l: 'Soil Health', v: '8.2', u: '/ 10', c: 'text-green-500' },
                { l: 'Pest Risk', v: 'Low', u: ' Risk', c: 'text-yellow-500' },
                { l: 'Fertilizer', v: '94', u: '%', c: 'text-blue-500' },
                { l: 'Market', v: 'Heavy', u: '', c: isDark ? 'text-gray-300' : 'text-gray-700' }
              ].map(stat => (
                <div key={stat.l} className={`p-3 border rounded text-center ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <p className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.l}</p>
                  <p className={`text-lg font-bold ${stat.c}`}>{stat.v}<span className="text-sm opacity-60">{stat.u}</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 border rounded flex items-start gap-3 ${isDark ? 'bg-yellow-900 border-yellow-600 text-yellow-400' : 'bg-yellow-50 border-yellow-400 text-yellow-700'}`}>
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold uppercase">Pre-Monsoon Advisory</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>Farmers in North-West zones advised to harvest mature wheat crops before 24th May storm system arrival.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgricultureSector;
