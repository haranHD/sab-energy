import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  BatteryCharging,
  Sun,
  Wind,
  Settings,
  Bell,
  Activity,
  Moon,
  Database,
  ChevronDown,
  ChevronRight,
  Sun as SunIcon
} from 'lucide-react';
import { cn } from './utils';

import { OverviewDashboard as Dashboard } from './components/Dashboard';
import { EBMeter } from './components/EBMeter';
import { MasterManagement } from './components/MasterManagement';
import { SolarLog } from './components/SolarLog';
import { WindLog } from './components/WindLog';
import { GensetLog } from './components/GensetLog';
import { AlertsUtils } from './components/AlertsUtils';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/eb-meter', label: 'EB Meter', icon: Zap },
  { path: '/genset', label: 'Genset Log', icon: BatteryCharging },
  { path: '/solar', label: 'Solar PV', icon: Sun },
  { path: '/wind', label: 'Wind Turbine', icon: Wind },
  { 
    path: '/master', 
    label: 'Master Data', 
    icon: Database,
    subItems: [
      { path: '/master/assets', label: 'Assets' },
      { path: '/master/hubs', label: 'Hubs' },
      { path: '/master/meters', label: 'Meters' }
    ]
  },
  { path: '/alerts', label: 'Alerts & Utils', icon: Settings },
];

function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <Activity size={18} />
        </div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          SAB-ENERGY
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.subItems) {
            return <SidebarMenuGroup key={item.path} item={item} />;
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors group',
                  isActive
                    ? 'bg-muted text-foreground font-semibold border-l-2 border-indigo-600'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-2 border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={cn("transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-foreground")} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/30 p-3 rounded-md flex items-center space-x-3 border border-border/50">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">System Status</p>
            <p className="text-xs font-semibold text-foreground">Live & Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarMenuGroup({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between space-x-3 px-4 py-2.5 rounded-md transition-colors group text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-2 border-transparent"
      >
        <div className="flex items-center space-x-3">
          <item.icon size={18} className="transition-colors group-hover:text-foreground" />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      
      {isOpen && (
        <div className="pl-11 space-y-1">
          {item.subItems.map((sub: any) => (
            <NavLink
              key={sub.path}
              to={sub.path}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )
              }
            >
              {sub.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function Header({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div></div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-border bg-card">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Last Sync: Just now</span>
        </div>
        
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-border bg-card">
          <Database size={12} className="text-indigo-500" />
          <span className="text-[11px] font-medium text-foreground uppercase tracking-wider flex items-center">
            Connected Hubs: 
            <span className="ml-1.5 flex items-center justify-center bg-emerald-500 text-white min-w-[18px] h-[18px] px-1.5 rounded-full font-bold leading-none text-[10px] shadow-sm">
              12
            </span>
          </span>
        </div>

        <button onClick={toggleTheme} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          {isDark ? <SunIcon size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background"></span>
        </button>
      </div>
    </header>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header toggleTheme={toggleTheme} isDark={isDark} />
          <main className="flex-1 overflow-y-auto bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/master/:tab" element={<MasterManagement />} />
              <Route path="/master" element={<MasterManagement />} />
              <Route path="/eb-meter" element={<EBMeter />} />
              <Route path="/genset" element={<GensetLog />} />
              <Route path="/solar" element={<SolarLog />} />
              <Route path="/wind" element={<WindLog />} />
              <Route path="/alerts" element={<AlertsUtils />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
