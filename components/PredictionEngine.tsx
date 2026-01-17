
import React, { useState, useEffect } from 'react';
import { BrainCircuit, CloudRain, ShieldAlert, Zap, Thermometer, Droplets } from 'lucide-react';
import { PredictionResult } from '../types';

const PredictionEngine: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Mock call to the Unified Prediction Engine
  const fetchPrediction = async (domain: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponses: Record<string, PredictionResult> = {
      weather: {
        prediction: "High Rain Risk",
        confidence: 0.92,
        model: "WeatherRiskV3.2",
        domain: "Agriculture"
      },
      healthcare: {
        prediction: "Moderate Overload Risk",
        confidence: 0.74,
        model: "PatientLoadTransformer",
        domain: "Healthcare"
      }
    };

    setResult(mockResponses[domain] || mockResponses.weather);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrediction('weather');
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          Prediction Intelligence
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono uppercase">
          ML Assisted
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => fetchPrediction('weather')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              result?.domain === 'Agriculture' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-100' : 'bg-slate-950/50 border-white/5 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <CloudRain className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold uppercase">Agri-Weather</span>
          </button>
          <button 
            onClick={() => fetchPrediction('healthcare')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              result?.domain === 'Healthcare' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-100' : 'bg-slate-950/50 border-white/5 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold uppercase">Health Load</span>
          </button>
        </div>

        <div className="relative p-5 bg-slate-950 rounded-2xl border border-indigo-500/20 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-xs text-slate-500 font-mono">Querying Prediction Engine...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Prediction</p>
                  <h4 className="text-xl font-bold text-white mt-1">{result.prediction}</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Confidence</p>
                  <p className="text-xl font-mono text-emerald-400 mt-1">{(result.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-mono text-slate-400">{result.model}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-300">29°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-300">72%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default PredictionEngine;
