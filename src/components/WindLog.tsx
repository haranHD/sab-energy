import React, { useState, useEffect } from 'react';
import { Wind, Zap, Activity, Gauge, CloudLightning } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulate external API data fetch
const fetchWindData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        currentPower: 412.8, // kW
        dailyYield: 3450.4, // kWh
        windSpeed: 8.4, // m/s
        rotorSpeed: 14.2, // RPM
        status: 'Online',
        chartData: Array.from({ length: 24 }).map((_, i) => {
          // Wind power usually fluctuates up and down
          const basePower = 300 + Math.sin(i * 0.5) * 150;
          const noise = Math.random() * 50 - 25;
          return {
            time: `${i}:00`,
            power: Math.max(0, basePower + noise).toFixed(1)
          };
        })
      });
    }, 1000); // Slightly longer delay to simulate different API endpoint
  });
};

export function WindLog() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWindData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-muted-foreground">
          <Wind size={48} className="animate-spin text-cyan-500 opacity-50 duration-1000" />
          <p className="animate-pulse">Fetching telemetry from Wind API...</p>
        </div>
      </div>
    );
  }

  const STATS = [
    { label: 'Current Output', value: data.currentPower, unit: 'kW', icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Daily Yield', value: data.dailyYield, unit: 'kWh', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Wind Speed', value: data.windSpeed, unit: 'm/s', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Rotor Speed', value: data.rotorSpeed, unit: 'RPM', icon: Gauge, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wind size={24} className="text-cyan-500" />
            Wind Turbine Generation
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Live telemetry from external SCADA API</p>
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
          <CloudLightning size={20} className="text-muted-foreground" />
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kW`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="power" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWind)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
