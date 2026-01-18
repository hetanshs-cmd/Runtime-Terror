
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
  id: string;
  hospitalId: string;
  name: string;
  city: string;
  state: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Doctor {
  id: string;
  drName: string;
  hospitalId: string;
  gender: string;
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  hospitalId: string;
  department: string;
  doctorName?: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const HealthcareSector: React.FC<HealthcareSectorProps> = ({ isDark = true, user }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [viewEmail, setViewEmail] = useState<string>('');
  const [showAppointmentViewer, setShowAppointmentViewer] = useState(false);

  // KPI Statistics State
  const [kpiStats, setKpiStats] = useState({
    totalUsers: 'Loading...',
    totalDoctors: 'Loading...'
  });
  const [newDoctor, setNewDoctor] = useState({
    drName: '',
    hospitalId: '',
    gender: 'Male',
    time: ''
  });
  const [newHospital, setNewHospital] = useState({
    hospitalId: '',
    name: '',
    type: 'government',
    city: '',
    state: '',
    address: '',
    pincode: '',
    phone: '',
    email: '',
    totalBeds: '',
    icuBeds: '',
    emergencyBeds: ''
  });
  const [quickHospital, setQuickHospital] = useState({
    hospitalId: '',
    name: '',
    state: '',
    type: 'government'
  });

  const API_BASE_URL = '/api';

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
    fetchUserRole();
    fetchCriticalAlerts();
    loadKPIStats();
  }, []);

  // Load KPI statistics from API
  const loadKPIStats = async () => {
    try {
      const [usersRes, doctorsRes] = await Promise.all([
        fetch('/api/healthcare/stats/users', { credentials: 'include' }),
        fetch('/api/healthcare/stats/doctors', { credentials: 'include' })
      ]);

      const users = usersRes.ok ? await usersRes.json() : { total_users: 'Error' };
      const doctors = doctorsRes.ok ? await doctorsRes.json() : { total_doctors: 'Error' };

      setKpiStats({
        totalUsers: users.total_users?.toString() || 'Error',
        totalDoctors: doctors.total_doctors?.toString() || 'Error'
      });
    } catch (error) {
      console.error('Error loading healthcare KPI stats:', error);
      setKpiStats({
        totalUsers: 'Error',
        totalDoctors: 'Error'
      });
    }
  };

  const fetchCriticalAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts?severity=CRITICAL`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCriticalAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch critical alerts:', error);
    }
  };

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

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/doctors`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAppointments = async (email?: string) => {
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/my?email=${encodeURIComponent(email)}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newDoctor)
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors([...doctors, data.doctor]);
        setShowAddDoctorForm(false);
        setNewDoctor({
          drName: '',
          hospitalId: '',
          gender: 'Male',
          time: ''
        });
      }
    } catch (error) {
      console.error('Failed to add doctor:', error);
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
          hospitalId: '',
          name: '',
          type: 'government',
          city: '',
          state: '',
          address: '',
          pincode: '',
          phone: '',
          email: '',
          totalBeds: '',
          icuBeds: '',
          emergencyBeds: ''
        });
      }
    } catch (error) {
      console.error('Failed to add hospital:', error);
    }
  };

  const handleQuickAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/healthcare/hospitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          hospitalId: quickHospital.hospitalId,
          name: quickHospital.name,
          state: quickHospital.state,
          type: quickHospital.type,
          city: quickHospital.state // Use state as city for quick registration
        })
      });
      if (response.ok) {
        const data = await response.json();
        setHospitals([...hospitals, data.hospital]);
        setQuickHospital({
          hospitalId: '',
          name: '',
          state: '',
          type: 'government'
        });
        alert('Hospital registered successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to register hospital: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to add hospital:', error);
      alert('Error registering hospital');
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
        <KPICard title="Total Users Registered" value={kpiStats.totalUsers} trend="+0.8%" icon={Users} color="indigo" isDark={isDark} />
        <KPICard title="Total Hospitals Linked" value={hospitals.length.toString()} trend="+412" icon={Building2} color="blue" isDark={isDark} />
        <KPICard title="Avg. Waiting Time" value="18m" trend="-2m" icon={Activity} color="emerald" isDark={isDark} />
        <KPICard title="Registered Doctors" value={kpiStats.totalDoctors} trend="+12%" icon={Activity} color="purple" isDark={isDark} />
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
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{hospital.city}, {hospital.state}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className={`px-2 py-1 rounded ${hospital.type === 'government' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {hospital.type}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ID: {hospital.hospitalId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs bg-blue-100 text-blue-800`}>
                        {hospital.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hospital Registration Section - Only for Healthcare Admin, Admin, and Super Admin */}
          {user && (user.role === 'healthcare_admin' || user.role === 'admin' || user.role === 'super_admin') && (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  <Plus className="w-5 h-5 text-green-500" />
                  Register New Hospital
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${showAddForm
                    ? `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    } transition-colors`}
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? 'Cancel' : 'Add Hospital'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddHospital} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Hospital ID
                      </label>
                      <input
                        type="text"
                        value={newHospital.hospitalId}
                        onChange={(e) => setNewHospital({ ...newHospital, hospitalId: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        value={newHospital.name}
                        onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Type
                      </label>
                      <select
                        value={newHospital.type}
                        onChange={(e) => setNewHospital({ ...newHospital, type: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                      >
                        <option value="government">Government</option>
                        <option value="private">Private</option>
                        <option value="charitable">Charitable</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        City
                      </label>
                      <input
                        type="text"
                        value={newHospital.city}
                        onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        State
                      </label>
                      <input
                        type="text"
                        value={newHospital.state}
                        onChange={(e) => setNewHospital({ ...newHospital, state: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newHospital.phone}
                        onChange={(e) => setNewHospital({ ...newHospital, phone: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={newHospital.email}
                        onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Total Beds
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newHospital.totalBeds}
                        onChange={(e) => setNewHospital({ ...newHospital, totalBeds: e.target.value })}
                        className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className={`px-4 py-2 border rounded ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Register Hospital
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Patient Services Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Book Appointment */}
            <AppointmentForm isDark={isDark} />

            {/* Add New Doctor - Only for Healthcare Admin, Admin, and Super Admin */}
            {(userRole === 'admin' || userRole === 'healthcare_admin' || userRole === 'super_admin') && (
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
                <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Plus className="w-4 h-4 text-green-500" />
                  Add New Doctor
                </h3>
                <form onSubmit={handleAddDoctor} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={newDoctor.drName}
                    onChange={(e) => setNewDoctor({ ...newDoctor, drName: e.target.value })}
                    className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                  <select
                    value={newDoctor.hospitalId}
                    onChange={(e) => setNewDoctor({ ...newDoctor, hospitalId: e.target.value })}
                    className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    required
                  >
                    <option value="">Select Hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.hospitalId} value={hospital.hospitalId}>
                        {hospital.name} ({hospital.hospitalId})
                      </option>
                    ))}
                  </select>
                  <select
                    value={newDoctor.gender}
                    onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                    className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Available Time (e.g., 09:00-12:00)"
                    value={newDoctor.time}
                    onChange={(e) => setNewDoctor({ ...newDoctor, time: e.target.value })}
                    className={`w-full p-2 border rounded text-sm ${isDark ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm font-semibold"
                  >
                    Add Doctor
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Doctors List Section */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <Users className="w-5 h-5 text-green-500" />
              Registered Doctors ({doctors.length})
            </h3>
            {doctors.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No doctors registered yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded`}>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{doctor.drName}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hospital ID: {doctor.hospitalId}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span className={`px-2 py-1 rounded ${doctor.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {doctor.gender}
                      </span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{doctor.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Bell className="w-4 h-4 text-red-500" />
              Critical Alerts
            </h3>
            <AlertFeed isDark={isDark} alerts={criticalAlerts.map(a => ({ id: a.id, type: a.type, message: a.message, severity: a.severity, createdAt: a.createdAt }))} />
          </div>

          {/* View Appointments Section */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <Activity className="w-5 h-5 text-blue-500" />
              View My Appointments
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email to view appointments"
                  value={viewEmail}
                  onChange={(e) => setViewEmail(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded text-sm ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    }`}
                />
                <button
                  onClick={() => fetchAppointments(viewEmail)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold"
                  disabled={!viewEmail.trim()}
                >
                  View
                </button>
              </div>

              {appointments.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{appointment.patientName}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p><strong>Hospital:</strong> {appointment.hospitalId}</p>
                        <p><strong>Department:</strong> {appointment.department}</p>
                        <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                        <p><strong>Phone:</strong> {appointment.patientPhone}</p>
                        {appointment.doctorName && <p><strong>Doctor:</strong> {appointment.doctorName}</p>}
                        {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewEmail && appointments.length === 0 && (
                <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No appointments found for this email.
                </div>
              )}
            </div>
          </div>

          {/* Admin: View All Appointments */}
          {(userRole === 'admin' || userRole === 'healthcare_admin' || userRole === 'super_admin') && (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
                <Activity className="w-5 h-5 text-purple-500" />
                All Appointments (Admin View)
              </h3>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`${API_BASE_URL}/appointments`, {
                      credentials: 'include'
                    });
                    if (response.ok) {
                      const data = await response.json();
                      setAppointments(data.appointments);
                    }
                  } catch (error) {
                    console.error('Failed to fetch all appointments:', error);
                  }
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm font-semibold mb-3"
              >
                Load All Appointments
              </button>

              {appointments.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className={`p-3 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} border rounded`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{appointment.patientName}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {appointment.status}
                          </span>
                          {(userRole === 'admin' || userRole === 'healthcare_admin' || userRole === 'super_admin') && (
                            <select
                              value={appointment.status}
                              onChange={async (e) => {
                                try {
                                  const response = await fetch(`${API_BASE_URL}/appointments/${appointment.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({ status: e.target.value })
                                  });
                                  if (response.ok) {
                                    // Refresh appointments
                                    const refreshResponse = await fetch(`${API_BASE_URL}/appointments`, {
                                      credentials: 'include'
                                    });
                                    if (refreshResponse.ok) {
                                      const data = await refreshResponse.json();
                                      setAppointments(data.appointments);
                                    }
                                  }
                                } catch (error) {
                                  console.error('Failed to update appointment status:', error);
                                }
                              }}
                              className={`px-2 py-1 rounded text-xs border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                }`}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </div>
                      <div className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p><strong>Email:</strong> {appointment.patientEmail}</p>
                        <p><strong>Phone:</strong> {appointment.patientPhone}</p>
                        <p><strong>Hospital:</strong> {appointment.hospitalId}</p>
                        <p><strong>Department:</strong> {appointment.department}</p>
                        <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                        {appointment.doctorName && <p><strong>Doctor:</strong> {appointment.doctorName}</p>}
                        {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Quick Hospital Registration */}
        <div className="space-y-4">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} border rounded p-4`}>
            <h3 className={`text-sm font-bold uppercase mb-4 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Plus className="w-4 h-4 text-green-500" />
              Quick Hospital Registration
            </h3>
            <form onSubmit={handleQuickAddHospital} className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Hospital ID
                </label>
                <input
                  type="text"
                  value={quickHospital.hospitalId}
                  onChange={(e) => setQuickHospital({ ...quickHospital, hospitalId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded text-sm ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    }`}
                  placeholder="e.g., HOS-DEL-001"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={quickHospital.name}
                  onChange={(e) => setQuickHospital({ ...quickHospital, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded text-sm ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    }`}
                  placeholder="Enter hospital name"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  State
                </label>
                <input
                  type="text"
                  value={quickHospital.state}
                  onChange={(e) => setQuickHospital({ ...quickHospital, state: e.target.value })}
                  className={`w-full px-3 py-2 border rounded text-sm ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    }`}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={quickHospital.type}
                  onChange={(e) => setQuickHospital({ ...quickHospital, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded text-sm ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                    }`}
                >
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                  <option value="semi-government">Semi-Government</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!['super_admin', 'healthcare_admin', 'healthcare_admin2'].includes(userRole)}
                className={`w-full py-2 px-4 rounded text-sm font-semibold transition-colors ${['super_admin', 'healthcare_admin', 'healthcare_admin2'].includes(userRole)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
              >
                {['super_admin', 'healthcare_admin', 'healthcare_admin2'].includes(userRole)
                  ? 'Register Hospital'
                  : 'Access Restricted'
                }
              </button>
              {!['super_admin', 'healthcare_admin', 'healthcare_admin2'].includes(userRole) && (
                <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Only authorized administrators can register hospitals
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareSector;
