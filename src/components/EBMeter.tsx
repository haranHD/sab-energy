import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Zap, AlertCircle, Activity, Gauge, Battery, Radio, Waves } from 'lucide-react';
import { cn } from '../utils';

const generateVoltageData = () => {
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    l1: Math.round((415 + (Math.sin(i * 0.8) * 6) + (Math.random() * 4 - 2)) * 10) / 10,
    l2: Math.round((412 + (Math.cos(i * 0.7) * 5) + (Math.random() * 4 - 2)) * 10) / 10,
    l3: Math.round((418 + (Math.sin(i * 0.5 + 1) * 7) + (Math.random() * 4 - 2)) * 10) / 10,
  }));
};

const STATS = [
  { label: 'Voltage L-L', value: '415', unit: 'V', icon: Zap },
  { label: 'Current', value: '1,245', unit: 'A', icon: Activity },
  { label: 'Active Power', value: '894', unit: 'kW', icon: Battery },
  { label: 'Reactive Power', value: '312', unit: 'kVAR', icon: Radio },
  { label: 'Frequency', value: '50.01', unit: 'Hz', icon: Waves },
];

export function EBMeter() {
  const [view, setView] = useState<'HT' | 'LT'>('HT');
  const [data] = useState(generateVoltageData());
  const powerFactor = 0.94;
  const isPenalty = powerFactor < 0.90;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap size={24} className="text-indigo-600 dark:text-indigo-400" />
            EB Meter Reading
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Main Grid Supply Monitoring</p>
        </div>

        <div className="flex bg-card border border-border rounded-lg p-1">
          {(['HT', 'LT'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-6 py-2 rounded-md text-sm font-semibold transition-all',
                view === v
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {v} Line
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
              <stat.icon size={100} />
            </div>
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider mb-2 relative z-10">{stat.label}</p>
            <div className="flex items-baseline space-x-1.5 relative z-10">
              <span className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</span>
              <span className="text-muted-foreground font-medium text-sm">{stat.unit}</span>
            </div>
          </div>
        ))}
        
        {/* Power Factor Special Card */}
        <div className={cn(
          "rounded-lg p-4 shadow-md flex flex-col justify-center relative overflow-hidden",
          isPenalty ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        )}>
          <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none">
            <Gauge size={100} />
          </div>
          <p className={cn("text-[11px] font-semibold uppercase tracking-wider mb-2 relative z-10", isPenalty ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
            Power Factor (PF)
          </p>
          <div className="flex items-baseline space-x-1 relative z-10">
            <span className={cn("text-2xl font-bold tracking-tight", isPenalty ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}>
              {powerFactor.toFixed(2)}
            </span>
          </div>
          {isPenalty && (
            <div className="mt-2 text-[10px] flex items-center space-x-1 text-red-400 font-medium">
              <AlertCircle size={12} />
              <span>Penalty Zone (&lt; 0.90)</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Voltage Imbalance (L-L)</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                Live 24h Profile
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Line-to-Line Phase Voltage across 24 hourly intervals with nominal 415V reference line
            </p>
          </div>

          {/* Quick Axis Legend Summary */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <span className="text-muted-foreground font-medium">
              <strong className="text-foreground">X-Axis:</strong> Time (00:00 – 23:00)
            </span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground font-medium">
              <strong className="text-foreground">Y-Axis:</strong> Voltage in Volts (V)
            </span>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
              
              {/* X-Axis: Time in Hours */}
              <XAxis 
                dataKey="time" 
                stroke="currentColor" 
                className="text-muted-foreground"
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                label={{ value: 'Time of Day (Hours)', position: 'insideBottom', offset: -15, fill: 'currentColor', fontSize: 11, className: 'text-muted-foreground font-medium' }}
              />
              
              {/* Y-Axis: Voltage in Volts (V) */}
              <YAxis 
                stroke="currentColor" 
                className="text-muted-foreground"
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                domain={[395, 435]}
                tickFormatter={(val) => `${Math.round(val)} V`}
                label={{ value: 'Line-to-Line Voltage (V)', angle: -90, position: 'insideLeft', offset: 0, fill: 'currentColor', fontSize: 11, className: 'text-muted-foreground font-medium' }}
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
                formatter={(value: any, name: any) => [`${value} V`, name]}
              />

              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} 
              />
              
              <ReferenceLine y={415} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Nominal 415V', fill: '#10b981', fontSize: 10, position: 'right' }} />
              
              <Line type="monotone" dataKey="l1" name="Phase R-Y (L1-L2)" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="l2" name="Phase Y-B (L2-L3)" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="l3" name="Phase B-R (L3-L1)" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
