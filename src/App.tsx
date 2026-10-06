import React, { useState, useEffect } from 'react';
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
  Sun as SunIcon,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from './utils';

import { OverviewDashboard as Dashboard } from './components/Dashboard';
import { EBMeter } from './components/EBMeter';
import { MasterManagement } from './components/MasterManagement';
import { SolarLog } from './components/SolarLog';
import { WindLog } from './components/WindLog';
import { GensetLog } from './components/GensetLog';
import { AlertsUtils } from './components/AlertsUtils';
import { HubReports } from './components/HubReports';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/eb-meter', label: 'EB Meter', icon: Zap },
  { path: '/genset', label: 'Genset Log', icon: BatteryCharging },
  { path: '/solar', label: 'Solar PV', icon: Sun },
  { path: '/wind', label: 'Wind Turbine', icon: Wind },
  { path: '/reports', label: 'Reports', icon: FileSpreadsheet },
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
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen print:hidden">
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
  const [isOpen, setIsOpen] = React.useState(true);

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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
      {/* Left empty spacer or brand area */}
      <div></div>

      {/* Right: Exact Visual Badges & Controls */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Badge 1: LAST SYNC: JUST NOW */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="text-[11px] font-semibold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
            LAST SYNC: JUST NOW
          </span>
        </div>

        {/* Badge 2: CONNECTED HUBS: 12 */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <Database size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2]" />
          <span className="text-[11px] font-semibold tracking-wider text-slate-800 dark:text-slate-100 uppercase">
            CONNECTED HUBS:
          </span>
          <span className="bg-[#059669] dark:bg-emerald-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-full leading-none shrink-0 shadow-sm">
            12
          </span>
        </div>

        <div className="h-4 w-px bg-border my-auto"></div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {isDark ? <SunIcon size={17} /> : <Moon size={17} />}
        </button>

        <button
          className="relative p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="System Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
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
      <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground print:h-auto print:overflow-visible print:block">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 print:block">
          <Header toggleTheme={toggleTheme} isDark={isDark} />
          <main className="flex-1 overflow-y-auto bg-background print:overflow-visible print:h-auto print:p-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<HubReports />} />
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
