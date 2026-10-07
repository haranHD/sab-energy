import { useState, useEffect } from 'react';
import {
  Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, Sun, Wind, Zap, AlertTriangle, AlertCircle } from 'lucide-react';
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
        <div className="lg:col-span-2 bg-card rounded-lg p-6 shadow-md border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Demand Trend (24h)</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                  Power Telemetry
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Actual Demand vs Projected Baseline across 24 hourly intervals</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Axis summary badge */}
              <div className="flex items-center gap-2 text-xs bg-muted/50 px-2.5 py-1 rounded border border-border text-muted-foreground">
                <span><strong>X:</strong> Time (0–23h)</span>
                <span className="text-border">|</span>
                <span><strong>Y:</strong> Demand (kW)</span>
              </div>

              {/* Legend series */}
              <div className="flex items-center space-x-3 text-xs font-medium">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-foreground">Actual</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-0.5 border-t-2 border-dashed border-slate-500" />
                  <span className="text-muted-foreground">Baseline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
                
                {/* X-Axis: Time of Day */}
                <XAxis 
                  dataKey="time" 
                  stroke="currentColor" 
                  className="text-muted-foreground"
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  label={{ value: 'Time of Day (Hours)', position: 'insideBottom', offset: -15, fill: 'currentColor', fontSize: 11, className: 'text-muted-foreground font-medium' }}
                />
                
                {/* Y-Axis: Power Demand in kW */}
                <YAxis 
                  stroke="currentColor" 
                  className="text-muted-foreground"
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val} kW`}
                  label={{ value: 'Power Demand (kW)', angle: -90, position: 'insideLeft', offset: -5, fill: 'currentColor', fontSize: 11, className: 'text-muted-foreground font-medium' }}
                />
                
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '4px' }}
                  formatter={(value: any, name: any) => [`${value} kW`, name === 'actual' ? 'Actual Demand' : 'Baseline Projection']}
                />
                <Area type="monotone" dataKey="actual" name="actual" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Line type="monotone" dataKey="baseline" name="baseline" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
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
