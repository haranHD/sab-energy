import { useState } from 'react';
import { Settings, AlertTriangle, Clock, Zap, Save, Bell } from 'lucide-react';
import { cn } from '../utils';

export function AlertsUtils() {
  const [activeTab, setActiveTab] = useState<'thresholds' | 'timing'>('thresholds');

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings size={24} className="text-indigo-600 dark:text-indigo-400" />
            Alerts & Utilities
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Configure system thresholds, alarms, and time-based parameters</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
          <Save size={18} />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab('thresholds')}
          className={cn(
            'px-6 py-3 font-medium text-sm transition-all border-b-2 flex items-center gap-2',
            activeTab === 'thresholds'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-muted/30'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
          )}
        >
          <AlertTriangle size={16} />
          HT/LT Thresholds
        </button>
        <button
          onClick={() => setActiveTab('timing')}
          className={cn(
            'px-6 py-3 font-medium text-sm transition-all border-b-2 flex items-center gap-2',
            activeTab === 'timing'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-muted/30'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
          )}
        >
          <Clock size={16} />
          Time-of-Use (ToU) Schedule
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'thresholds' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HT Configuration */}
            <div className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-rose-500" size={20} />
                <h3 className="text-lg font-bold text-foreground">High Tension (HT) Configuration</h3>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Over Voltage Limit (V)</label>
                    <input type="number" defaultValue={12000} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Under Voltage Limit (V)</label>
                    <input type="number" defaultValue={10500} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Over Current Alert (A)</label>
                    <input type="number" defaultValue={400} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Power Factor Penalty Limit</label>
                    <input type="number" step="0.01" defaultValue={0.90} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Bell size={16} /> Enable SMS Alerts
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* LT Configuration */}
            <div className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-foreground">Low Tension (LT) Configuration</h3>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Over Voltage Limit (V)</label>
                    <input type="number" defaultValue={440} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Under Voltage Limit (V)</label>
                    <input type="number" defaultValue={380} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Max Load Capacity (kW)</label>
                    <input type="number" defaultValue={100} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Phase Imbalance Limit (%)</label>
                    <input type="number" defaultValue={5} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Bell size={16} /> Enable Email Alerts
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-indigo-500" size={20} />
              <h3 className="text-lg font-bold text-foreground">Time-Based Usage Configuration</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Define the Peak and Off-Peak hours for Time-of-Use (ToU) billing and utilization tracking. Energy consumed during peak hours may trigger specific alerts or rate calculations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-md bg-rose-500/5 border border-rose-500/20">
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  Peak Hours
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Time</label>
                    <input type="time" defaultValue="18:00" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Time</label>
                    <input type="time" defaultValue="22:00" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-md bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Off-Peak Hours
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Time</label>
                    <input type="time" defaultValue="22:00" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Time</label>
                    <input type="time" defaultValue="06:00" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-5 rounded-md bg-indigo-500/5 border border-indigo-500/20">
              <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Standard Hours
              </h4>
              <p className="text-sm text-foreground">
                Standard hours are automatically calculated as the remaining time blocks (06:00 to 18:00).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
