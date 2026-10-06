import React, { useState, useEffect } from 'react';
import { Sun, ThermometerSun, Zap, Cloud, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulate external API data fetch
const fetchSolarData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        currentPower: 124.5, // kW
        dailyYield: 856.2, // kWh
        irradiance: 850, // W/m2
        panelTemp: 45.2, // °C
        status: 'Optimal',
        chartData: Array.from({ length: 24 }).map((_, i) => {
          let power = 0;
          if (i > 6 && i < 18) {
            // Simulate a bell curve for solar generation during the day
            power = Math.sin(((i - 6) / 12) * Math.PI) * 150 + (Math.random() * 10 - 5);
          }
          return {
            time: `${i}:00`,
            power: Math.max(0, power).toFixed(1)
          };
        })
      });
    }, 800);
  });
};

export function SolarLog() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolarData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-muted-foreground">
          <Sun size={48} className="animate-spin text-amber-500 opacity-50" />
          <p className="animate-pulse">Fetching telemetry from Solar Inverters...</p>
        </div>
      </div>
    );
  }

  const STATS = [
    { label: 'Current Output', value: data.currentPower, unit: 'kW', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Daily Yield', value: data.dailyYield, unit: 'kWh', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Irradiance', value: data.irradiance, unit: 'W/m²', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Panel Temp', value: data.panelTemp, unit: '°C', icon: ThermometerSun, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sun size={24} className="text-amber-500" />
            Solar PV Generation
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Live telemetry from external inverter API</p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          API Connected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-card rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none ${stat.color}`}>
              <stat.icon size={100} />
            </div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">{stat.label}</p>
              <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5 relative z-10">
              <span className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
              <span className="text-muted-foreground font-medium text-sm">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-base font-bold text-foreground">Generation Curve (24h)</h3>
          <Cloud size={20} className="text-muted-foreground" />
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kW`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="power" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
