import { useState, useEffect } from 'react';
import { BatteryCharging, Zap, Gauge, Droplets, Thermometer, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulate external API data fetch for DG Set (Diesel Generator)
const fetchGensetData = (gensetId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some slightly different data based on genset string length/chars to make it look real
      const basePower = gensetId.includes('1000') ? 800 : gensetId.includes('500') ? 400 : 200;
      resolve({
        currentPower: basePower * 0.6 + (Math.random() * 20 - 10), // kW
        fuelLevel: 45 + Math.floor(Math.random() * 50), // %
        runTime: 12 + Math.floor(Math.random() * 40), // hours this month
        coolantTemp: 75 + Math.floor(Math.random() * 15), // °C
        status: Math.random() > 0.7 ? 'Running' : 'Standby',
        chartData: Array.from({ length: 24 }).map((_, i) => {
          let power = 0;
          if ((i > 8 && i < 11) || (i > 18 && i < 20)) {
            power = basePower * 0.5 + Math.random() * (basePower * 0.1);
          }
          return {
            time: `${i}:00`,
            power: power.toFixed(1)
          };
        })
      });
    }, 700);
  });
};

const GENSETS = ['DG-01 (500 kVA)', 'DG-02 (250 kVA)', 'DG-03 (1000 kVA)'];

export function GensetLog() {
  const [activeGenset, setActiveGenset] = useState(GENSETS[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGensetData(activeGenset).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [activeGenset]);

  if (loading || !data) {
    return (
      <div className="p-6 h-full flex flex-col gap-6">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BatteryCharging size={24} className="text-rose-500" />
              Diesel Backup (Genset) Log
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Live telemetry from DG Set Controller</p>
          </div>
          <div className="flex bg-card border border-border rounded-lg p-1 shadow-sm">
            {GENSETS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenset(g)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeGenset === g
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 text-muted-foreground">
            <BatteryCharging size={48} className="animate-pulse text-rose-500 opacity-50" />
            <p className="animate-pulse">Connecting to {activeGenset} API...</p>
          </div>
        </div>
      </div>
    );
  }

  const STATS = [
    { label: 'Current Output', value: data.currentPower.toFixed(1), unit: 'kW', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Fuel Level', value: data.fuelLevel, unit: '%', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Run Time (MTD)', value: data.runTime, unit: 'Hrs', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Coolant Temp', value: data.coolantTemp, unit: '°C', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BatteryCharging size={24} className="text-rose-500" />
            Diesel Backup (Genset) Log
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Live telemetry from DG Set Controller</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${data.status === 'Running' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-muted text-muted-foreground'}`}>
              Status: {data.status}
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              API Connected
            </div>
          </div>
          
          <div className="flex bg-card border border-border rounded-lg p-1 shadow-sm">
            {GENSETS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenset(g)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeGenset === g
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
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
          <Gauge size={20} className="text-muted-foreground" />
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGenset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kW`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="step" dataKey="power" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorGenset)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
