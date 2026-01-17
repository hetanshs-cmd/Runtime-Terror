
import React, { useState, useEffect } from 'react';
import { Users, Building2, HeartPulse, Activity, Bell, Plus, MapPin, Phone, Mail } from 'lucide-react';
import KPICard from './KPICard';
import StatusBadge from './StatusBadge';
import AlertFeed from './AlertFeed';
import AppointmentForm from './AppointmentForm';

interface HealthcareSectorProps {
  isDark?: boolean;
  user?: any;
}

interface Hospital {
  id: number;
  name: string;
  location: string;
  hospitalType: string;
  numRooms: number;
  numDoctors: number;
  numNurses: number;
  capacity: number;
  phone?: string;
  email?: string;
}

const HealthcareSector: React.FC<HealthcareSectorProps> = ({ isDark = true, user }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [newHospital, setNewHospital] = useState({
    name: '',
    location: '',
    type: 'Government',
    total_rooms: 0,
    total_doctors: 0,
    operational_status: 'Operational'
  });

  const API_BASE_URL = '/api';

  useEffect(() => {
    fetchHospitals();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
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

  const fetchHospitals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/hospitals`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHospitals(data.hospitals);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/hospitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newHospital)
      });
      if (response.ok) {
        const data = await response.json();
        setHospitals([...hospitals, data.hospital]);
        setShowAddForm(false);
        setNewHospital({
          name: '',
          location: '',
          hospitalType: 'general',
          numRooms: 0,
          numDoctors: 0,
          numNurses: 0,
          capacity: 0,
          phone: '',
          email: ''
        });
      }
    } catch (error) {
      console.error('Failed to add hospital:', error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <HeartPulse className="text-red-500 w-6 h-6" />
            Healthcare Infrastructure
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>National healthcare service monitoring & load balance</p>
        </div>
        <StatusBadge status="good" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users Registered" value="842.5M" trend="+0.8%" icon={Users} color="indigo" isDark={isDark} />
        <KPICard title="Total Hospitals Linked" value={hospitals.length.toString()} trend="+412" icon={Building2} color="blue" isDark={isDark} />
        <KPICard title="Avg. Waiting Time" value="18m" trend="-2m" icon={Activity} color="emerald" isDark={isDark} />
        <KPICard title="Tele-Health Consults" value="1.2M" trend="+12%" icon={Activity} color="purple" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <Activity className="w-5 h-5 text-red-500" />
              National Load Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded flex flex-col items-center`}>
                <p className={`text-xs font-bold mb-4 text-center uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>OPD Load Factor</p>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className={isDark ? "text-gray-700" : "text-gray-300"} />
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset="80" className="text-green-500" strokeLinecap="round" />
                  </svg>
                  <span className={`absolute text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>72%</span>
                </div>
                <p className="mt-4 text-xs text-green-500 font-mono font-bold">STABLE NODES</p>
              </div>

              <div className={`p-4 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded flex flex-col items-center`}>
                <p className={`text-xs font-bold mb-4 text-center uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Strain</p>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className={isDark ? "text-gray-700" : "text-gray-300"} />
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset="150" className="text-yellow-500" strokeLinecap="round" />
                  </svg>
                  <span className={`absolute text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>45%</span>
                </div>
                <p className="mt-4 text-xs text-yellow-500 font-mono font-bold">NEUTRAL ZONE</p>
              </div>

              <div className={`p-4 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded flex flex-col items-center`}>
                <p className={`text-xs font-bold mb-4 text-center uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>API Latency (P99)</p>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className={isDark ? "text-gray-700" : "text-gray-300"} />
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset="240" className="text-red-500" strokeLinecap="round" />
                  </svg>
                  <span className={`absolute text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>14%</span>
                </div>
                <p className="mt-4 text-xs text-red-500 font-mono font-bold">OPTIMIZED</p>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Activity className="w-4 h-4" />
              Resource Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Bed Availability', val: 88 },
                { label: 'Oxygen Supply', val: 94 },
                { label: 'Blood Reserves', val: 76 },
                { label: 'ICU Occupancy', val: 42 }
              ].map(res => (
                <div key={res.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{res.label}</span>
                    <span className="text-blue-500 font-mono">{res.val}%</span>
                  </div>
                  <div className={`h-2 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded overflow-hidden`}>
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{ width: `${res.val}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital List Section */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <Building2 className="w-5 h-5 text-blue-500" />
              Registered Hospitals ({hospitals.length})
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading hospitals...</span>
              </div>
            ) : hospitals.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No hospitals registered yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded flex items-center justify-between`}>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{hospital.name}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.location}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className={`px-2 py-1 rounded ${hospital.type === 'Government' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {hospital.type}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.total_rooms} rooms</span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.total_doctors} doctors</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${hospital.operational_status === 'Operational' ? 'bg-green-100 text-green-800' :
                        hospital.operational_status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {hospital.operational_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Bell className="w-4 h-4 text-red-500" />
              Critical Alerts
            </h3>
            <AlertFeed isDark={isDark} />
          </div>

          <AppointmentForm isDark={isDark} />

          {/* Admin Form for Adding Hospitals */}
          {userRole === 'admin' && (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
              <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Plus className="w-4 h-4 text-green-500" />
                Add New Hospital
              </h3>
              <form onSubmit={handleAddHospital} className="space-y-3">
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newHospital.location}
                  onChange={(e) => setNewHospital({ ...newHospital, location: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <select
                  value={newHospital.type}
                  onChange={(e) => setNewHospital({ ...newHospital, type: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                </select>
                <input
                  type="number"
                  placeholder="Total Rooms"
                  value={newHospital.total_rooms}
                  onChange={(e) => setNewHospital({ ...newHospital, total_rooms: parseInt(e.target.value) })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="number"
                  placeholder="Total Doctors"
                  value={newHospital.total_doctors}
                  onChange={(e) => setNewHospital({ ...newHospital, total_doctors: parseInt(e.target.value) })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                />
                <select
                  value={newHospital.operational_status}
                  onChange={(e) => setNewHospital({ ...newHospital, operational_status: e.target.value })}
                  className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Closed">Closed</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm font-semibold"
                >
                  Add Hospital
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthcareSector;
