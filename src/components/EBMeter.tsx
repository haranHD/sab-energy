import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Zap, AlertCircle, Activity, Gauge, Battery, Radio, Waves } from 'lucide-react';
import { cn } from '../utils';

const generateVoltageData = () => {
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    l1: 415 + (Math.random() * 10 - 5),
    l2: 412 + (Math.random() * 10 - 5),
    l3: 418 + (Math.random() * 10 - 5),
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

      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-base font-bold text-foreground mb-6">Voltage Imbalance (L-L)</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <ReferenceLine y={415} stroke="#334155" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="l1" name="L1-L2" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="l2" name="L2-L3" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="l3" name="L3-L1" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
