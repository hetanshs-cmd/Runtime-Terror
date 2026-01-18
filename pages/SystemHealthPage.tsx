import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Server,
  RefreshCw,
  BarChart3,
  Gauge,
  Timer,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';
import KPICard from '../components/KPICard';

interface SystemHealthPageProps {
  isDark: boolean;
}

interface HealthMetrics {
  health_score: number;
  status: string;
  uptime_seconds: number;
  metrics: {
    avg_latency_ms: number;
    requests_per_min: number;
    error_rate_percent: number;
    recovery_boost: number;
  };
}

const SystemHealthPage: React.FC<SystemHealthPageProps> = ({ isDark }) => {
  const [healthData, setHealthData] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/system-health/status', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
        setError('');
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch system health data');
      }
    } catch (err) {
      setError('Unable to connect to health monitoring service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Refresh health data every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-500';
      case 'STABLE': return 'text-blue-500';
      case 'DEGRADED': return 'text-yellow-500';
      case 'CRITICAL': return 'text-red-500';
      case 'WARMING_UP': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'STABLE': return <Activity className="w-6 h-6 text-blue-500" />;
      case 'DEGRADED': return <TrendingDown className="w-6 h-6 text-yellow-500" />;
      case 'CRITICAL': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'WARMING_UP': return <Zap className="w-6 h-6 text-purple-500" />;
      default: return <Server className="w-6 h-6 text-gray-500" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 88) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-blue-400 to-blue-600';
    if (score >= 45) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getLatencyStatus = (latency: number) => {
    if (latency < 200) return { status: 'Excellent', color: 'text-green-500', icon: CheckCircle };
    if (latency < 500) return { status: 'Good', color: 'text-blue-500', icon: Activity };
    if (latency < 1000) return { status: 'Slow', color: 'text-yellow-500', icon: TrendingDown };
    return { status: 'Critical', color: 'text-red-500', icon: AlertTriangle };
  };

  const getErrorRateStatus = (errorRate: number) => {
    if (errorRate < 1) return { status: 'Excellent', color: 'text-green-500', icon: CheckCircle };
    if (errorRate < 5) return { status: 'Acceptable', color: 'text-blue-500', icon: Activity };
    if (errorRate < 10) return { status: 'High', color: 'text-yellow-500', icon: TrendingDown };
    return { status: 'Critical', color: 'text-red-500', icon: AlertTriangle };
  };

  if (loading && !healthData) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[50vh] p-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <Activity className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
        <p className="text-sm">Loading system health metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[50vh] p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-lg font-semibold mb-2">Health Monitoring Error</h2>
        <p className="text-sm max-w-md">{error}</p>
        <button
          onClick={fetchHealthData}
          className={`mt-4 px-4 py-2 rounded ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Health Dashboard
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time performance monitoring and health metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchHealthData}
            className={`p-2 rounded-lg transition-colors ${isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Health Score Overview */}
      {healthData && (
        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(healthData.status)}
              <div>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  System Status: {healthData.status}
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overall Health Score
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getStatusColor(healthData.status)}`}>
                {healthData.health_score}%
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Health Score
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar with Gauge Effect */}
          <div className="relative">
            <div className={`w-full bg-gray-200 rounded-full h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${getHealthScoreColor(healthData.health_score)}`}
                style={{ width: `${healthData.health_score}%` }}
              ></div>
            </div>
            {/* Gauge markers */}
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-red-500">0%</span>
              <span className="text-yellow-500">45%</span>
              <span className="text-blue-500">70%</span>
              <span className="text-green-500">88%</span>
              <span className="text-green-600">100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Metrics Grid */}
      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Server Uptime"
            value={formatUptime(healthData.uptime_seconds)}
            icon={Clock}
            trend="up"
            color="blue"
            isDark={isDark}
            subtitle="System uptime"
          />

          <KPICard
            title="Average Latency"
            value={`${healthData.metrics.avg_latency_ms.toFixed(1)}ms`}
            icon={Zap}
            trend={healthData.metrics.avg_latency_ms < 300 ? "up" : "down"}
            color="cyan"
            isDark={isDark}
            subtitle={getLatencyStatus(healthData.metrics.avg_latency_ms).status}
          />

          <KPICard
            title="Requests/Minute"
            value={healthData.metrics.requests_per_min.toFixed(1)}
            icon={TrendingUp}
            trend="up"
            color="emerald"
            isDark={isDark}
            subtitle="Request throughput"
          />

          <KPICard
            title="Error Rate"
            value={`${healthData.metrics.error_rate_percent.toFixed(1)}%`}
            icon={AlertTriangle}
            trend={healthData.metrics.error_rate_percent < 5 ? "up" : "down"}
            color={healthData.metrics.error_rate_percent > 5 ? "rose" : "emerald"}
            isDark={isDark}
            subtitle={getErrorRateStatus(healthData.metrics.error_rate_percent).status}
          />
        </div>
      )}

      {/* Performance Metrics Section */}
      {healthData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed Performance Metrics */}
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Performance Metrics
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Response Time
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Average latency
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${getLatencyStatus(healthData.metrics.avg_latency_ms).color}`}>
                    {healthData.metrics.avg_latency_ms.toFixed(2)} ms
                  </div>
                  <div className={`text-xs ${getLatencyStatus(healthData.metrics.avg_latency_ms).color}`}>
                    {getLatencyStatus(healthData.metrics.avg_latency_ms).status}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Request Throughput
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Requests per minute
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg text-emerald-500`}>
                    {healthData.metrics.requests_per_min.toFixed(2)}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    req/min
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20">
                <div className="flex items-center space-x-3">
                  <WifiOff className="w-5 h-5 text-rose-500" />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Error Rate
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Percentage of failed requests
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${getErrorRateStatus(healthData.metrics.error_rate_percent).color}`}>
                    {healthData.metrics.error_rate_percent.toFixed(2)}%
                  </div>
                  <div className={`text-xs ${getErrorRateStatus(healthData.metrics.error_rate_percent).color}`}>
                    {getErrorRateStatus(healthData.metrics.error_rate_percent).status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status & Recovery */}
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                System Status & Recovery
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(healthData.status)}
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Health Status
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Current system state
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${getStatusColor(healthData.status)}`}>
                    {healthData.status}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {healthData.health_score}% score
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Recovery Boost
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      AI-powered recovery factor
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg text-orange-500`}>
                    +{healthData.metrics.recovery_boost}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    boost points
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      System Uptime
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Continuous operation time
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg text-gray-600 dark:text-gray-300`}>
                    {formatUptime(healthData.uptime_seconds)}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    running time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Status Legend */}
      <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Health Status Guide
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Healthy (88-100%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Stable (70-87%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-yellow-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Degraded (45-69%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Critical (0-44%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Warming Up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;