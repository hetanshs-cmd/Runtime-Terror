
/// <reference types="vite/client" />

export enum HealthStatus {
  HEALTHY = 'Healthy',
  DEGRADED = 'Degraded',
  DOWN = 'Down'
}

export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
  model: string;
  domain: string;
}

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  responseTime: string;
  uptime: string;
}

export interface Alert {
  id: string;
  domain: 'Healthcare' | 'Agriculture' | 'Urban' | 'System';
  message: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface InfraMetric {
  label: string;
  value: number;
  unit: string;
}
