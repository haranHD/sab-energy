import React, { useState } from 'react';
import { Database, MapPin, Activity, HardDrive, Plus, Search, MoreVertical, Edit2, Trash2, Map } from 'lucide-react';
import { cn } from '../utils';
import { useParams, Navigate } from 'react-router-dom';

type TabType = 'hubs' | 'meters' | 'assets';

export function MasterManagement() {
  const { tab } = useParams<{ tab: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validate the tab parameter
  if (!tab || !['hubs', 'meters', 'assets'].includes(tab)) {
    return <Navigate to="/master/assets" replace />;
  }

  const activeTab = tab as TabType;
  const titleMap = {
    hubs: 'Hubs Management',
    meters: 'Meters Management',
    assets: 'Assets Management'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database size={24} className="text-indigo-600 dark:text-indigo-400" />
            {titleMap[activeTab]}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Configure {activeTab} in the master data</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Create New {activeTab === 'hubs' ? 'Hub' : activeTab === 'meters' ? 'Meter' : 'Asset'}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-card rounded-lg shadow-md">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'hubs' && <HubsTable />}
          {activeTab === 'meters' && <MetersTable />}
          {activeTab === 'assets' && <AssetsTable />}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <CreateModal tab={activeTab} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function HubsTable() {
  const hubs = [
    { id: 'HUB-001', name: 'Main Plant Hub', location: 'Block A, Level 1', lat: '12.9716', lng: '77.5946', status: 'Active' },
    { id: 'HUB-002', name: 'Rooftop Solar Hub', location: 'Block B, Roof', lat: '12.9718', lng: '77.5948', status: 'Active' },
  ];

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Hub ID</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Location Details</th>
          <th className="px-6 py-3">Geolocation (Lat, Lng)</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {hubs.map((hub) => (
          <tr key={hub.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4 font-medium text-foreground">{hub.id}</td>
            <td className="px-6 py-4">{hub.name}</td>
            <td className="px-6 py-4 flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />
              {hub.location}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Map size={14} />
                <span>{hub.lat}, {hub.lng}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {hub.status}
              </span>
            </td>
            <td className="px-6 py-4 flex gap-3 text-muted-foreground">
              <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
              <button className="hover:text-destructive transition-colors"><Trash2 size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MetersTable() {
  const meters = [
    { id: 'MTR-101', name: 'Main Grid Input', type: 'Energy Meter (HT)', hub: 'HUB-001', status: 'Active' },
    { id: 'MTR-102', name: 'Solar Inverter 1', type: 'Solar Meter', hub: 'HUB-002', status: 'Active' },
  ];

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Meter ID</th>
          <th className="px-6 py-3">Meter Name</th>
          <th className="px-6 py-3">Type</th>
          <th className="px-6 py-3">Assigned Hub</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {meters.map((meter) => (
          <tr key={meter.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4 font-medium text-foreground">{meter.id}</td>
            <td className="px-6 py-4 flex items-center gap-2">
              <Activity size={14} className="text-indigo-600 dark:text-indigo-400" />
              {meter.name}
            </td>
            <td className="px-6 py-4 text-muted-foreground">{meter.type}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-foreground border border-border">
                {meter.hub}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {meter.status}
              </span>
            </td>
            <td className="px-6 py-4 flex gap-3 text-muted-foreground">
              <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
              <button className="hover:text-destructive transition-colors"><Trash2 size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AssetsTable() {
  const assets = [
    { id: 'AST-501', name: 'Transformer 1', category: 'Electrical', manufacturer: 'Siemens', status: 'Active' },
    { id: 'AST-502', name: 'HVAC Chiller A', category: 'Mechanical', manufacturer: 'Trane', status: 'Maintenance' },
  ];

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Asset ID</th>
          <th className="px-6 py-3">Asset Name</th>
          <th className="px-6 py-3">Category</th>
          <th className="px-6 py-3">Manufacturer</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {assets.map((asset) => (
          <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-4 font-medium text-foreground">{asset.id}</td>
            <td className="px-6 py-4 flex items-center gap-2">
              <HardDrive size={14} className="text-amber-600 dark:text-amber-400" />
              {asset.name}
            </td>
            <td className="px-6 py-4 text-muted-foreground">{asset.category}</td>
            <td className="px-6 py-4">{asset.manufacturer}</td>
            <td className="px-6 py-4">
              <span className={cn(
                "px-2 py-0.5 rounded text-[11px] font-semibold border",
                asset.status === 'Active' 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              )}>
                {asset.status}
              </span>
            </td>
            <td className="px-6 py-4 flex gap-3 text-muted-foreground">
              <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
              <button className="hover:text-destructive transition-colors"><Trash2 size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CreateModal({ tab, onClose }: { tab: TabType; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="text-lg font-bold text-foreground">
            Create New {tab === 'hubs' ? 'Hub' : tab === 'meters' ? 'Meter' : 'Asset'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Name</label>
            <input type="text" className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Enter name..." />
          </div>

          {tab === 'hubs' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Location Name</label>
                <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500" placeholder="e.g. Roof, Basement" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Latitude</label>
                  <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500" placeholder="0.0000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Longitude</label>
                  <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500" placeholder="0.0000" />
                </div>
              </div>
            </>
          )}

          {tab === 'meters' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Type</label>
                <select className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500">
                  <option>Energy Meter (HT)</option>
                  <option>Energy Meter (LT)</option>
                  <option>Water Meter</option>
                  <option>Gas Meter</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Assign to Hub</label>
                <select className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500">
                  <option>HUB-001 - Main Plant Hub</option>
                  <option>HUB-002 - Rooftop Solar Hub</option>
                </select>
              </div>
            </>
          )}

          {tab === 'assets' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500" placeholder="e.g. Electrical, Mechanical" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Manufacturer / Model</label>
                <input type="text" className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500" placeholder="e.g. Siemens XYZ" />
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/30">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-foreground bg-background border border-border hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
            Save {tab === 'hubs' ? 'Hub' : tab === 'meters' ? 'Meter' : 'Asset'}
          </button>
        </div>
      </div>
    </div>
  );
}
