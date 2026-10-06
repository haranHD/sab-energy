import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Activity, BatteryCharging, Sun, Wind, Zap, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../utils';

// Mock Data
const generateHourlyData = () => {
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    actual: Math.floor(Math.random() * 500) + 1500,
    baseline: Math.floor(Math.random() * 200) + 1600,
  }));
};

const powerMixData = [
  { name: 'EB HT', value: 45, color: '#06b6d4' }, // cyan-500
  { name: 'EB LT', value: 15, color: '#3b82f6' }, // blue-500
  { name: 'Genset', value: 10, color: '#f59e0b' }, // amber-500
  { name: 'Solar', value: 20, color: '#10b981' }, // emerald-500
  { name: 'Wind', value: 10, color: '#6366f1' }, // indigo-500
];

const METRICS = [
  { label: 'Total Demand', value: '2,145', unit: 'kW', icon: Activity, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-muted' },
  { label: 'Today\'s Consumption', value: '18,420', unit: 'kWh', icon: Zap, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-muted' },
  { label: 'Renewables', value: '30.0', unit: '%', icon: Sun, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-muted' },
  { label: 'Active Alerts', value: '3', unit: '', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  { label: 'Carbon Saved', value: '450', unit: 'kg CO2', icon: Wind, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
];

export function OverviewDashboard() {
  const [chartData, setChartData] = useState(generateHourlyData());
  const [isStale, setIsStale] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly simulate stale data for demonstration
      if (Math.random() > 0.8) {
        setIsStale(true);
      } else {
        setIsStale(false);
        setChartData(generateHourlyData());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Executive Overview</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time facility energy monitoring</p>
        </div>
        
        {isStale && (
          <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-md border border-amber-500/20">
            <AlertCircle size={16} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Stale Data Warning</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="bg-card rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
              <metric.icon size={100} />
            </div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">{metric.label}</p>
              <div className={cn("p-1.5 rounded-md", metric.bg, metric.color)}>
                <metric.icon size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5 relative z-10">
              <span className="text-3xl font-bold text-foreground tracking-tight">{metric.value}</span>
              {metric.unit && <span className="text-muted-foreground font-medium text-sm">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Demand Trend (24h)</h3>
              <p className="text-sm text-muted-foreground">Actual vs Baseline Consumption</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-foreground/80">Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Baseline</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                <Line type="monotone" dataKey="baseline" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-md">
          <h3 className="text-base font-bold text-foreground mb-6">Real-Time Power Mix</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={powerMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {powerMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {powerMixData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground/80 font-medium">{item.name}</span>
                </div>
                <span className="text-foreground font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
