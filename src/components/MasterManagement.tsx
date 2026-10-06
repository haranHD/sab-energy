import { useState, useRef, useEffect } from 'react';
import {
  Database,
  MapPin,
  Activity,
  HardDrive,
  Plus,
  Search,
  Edit2,
  Trash2,
  Map,
  Eye,
  Zap,
  Radio,
  RefreshCw,
  X,
  ExternalLink,
  Thermometer,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../utils';
import { useParams, Navigate } from 'react-router-dom';

type TabType = 'hubs' | 'meters' | 'assets';

export interface HubItem {
  id: string;
  name: string;
  location: string;
  lat: string;
  lng: string;
  status: 'Active' | 'Inactive' | 'Warning';
  ipAddress: string;
  gateway: string;
  firmware: string;
  signalDbm: number;
  uptime: string;
  activePowerKw: number;
  ratedCapacityKw: number;
  voltageV: number;
  currentA: number;
  powerFactor: number;
  frequencyHz: number;
  temperatureC: number;
  connectedMeters: Array<{
    id: string;
    name: string;
    type: string;
    loadKw: number;
    kwh?: number;
    status: 'Active' | 'Idle' | 'Offline';
  }>;
  hourlyTrends: Array<{ time: string; power: number }>;
}

export interface MeterItem {
  id: string;
  name: string;
  type: string;
  hub: string;
  status: 'Active' | 'Inactive';
  voltageL1: number;
  voltageL2: number;
  voltageL3: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
  totalKwh: number;
  thdPercent: number;
  activeKw: number;
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  status: 'Active' | 'Maintenance';
  healthScore: number;
  runningHours: number;
  temperatureC: number;
  vibrationMmS: number;
  nextServiceDays: number;
  powerDrawKw: number;
}

const INITIAL_HUBS: HubItem[] = [
  {
    id: 'HUB-001',
    name: 'Main Plant Hub',
    location: 'Block A, Level 1',
    lat: '12.9716',
    lng: '77.5946',
    status: 'Active',
    ipAddress: '192.168.10.142',
    gateway: 'GW-ETH-01 (Modbus TCP)',
    firmware: 'v3.4.2-PROD',
    signalDbm: -62,
    uptime: '99.98% (48d 14h)',
    activePowerKw: 428.5,
    ratedCapacityKw: 600,
    voltageV: 415.2,
    currentA: 596.1,
    powerFactor: 0.98,
    frequencyHz: 50.02,
    temperatureC: 36.4,
    connectedMeters: [
      { id: 'MTR-101', name: 'Main Grid Incomer (HT)', type: 'Energy Meter (HT)', loadKw: 280.4, kwh: 12.48, status: 'Active' },
      { id: 'MTR-103', name: 'Chiller & HVAC Loop', type: 'Sub-feeder Meter', loadKw: 94.1, kwh: 8.76, status: 'Active' },
      { id: 'MTR-104', name: 'Shop Floor Air Compressor', type: 'Industrial Sub-meter', loadKw: 54.0, kwh: 15.32, status: 'Active' },
      { id: 'MTR-107', name: 'Lighting & Aux Load', type: 'Facility Sub-meter', loadKw: 18.5, kwh: 10.21, status: 'Active' },
    ],
    hourlyTrends: [
      { time: '06:00', power: 210 },
      { time: '08:00', power: 340 },
      { time: '10:00', power: 415 },
      { time: '12:00', power: 435 },
      { time: '14:00', power: 428 },
      { time: '16:00', power: 390 },
      { time: '18:00', power: 310 },
      { time: '20:00', power: 250 },
    ],
  },
  {
    id: 'HUB-002',
    name: 'Rooftop Solar Hub',
    location: 'Block B, Roof',
    lat: '12.9718',
    lng: '77.5948',
    status: 'Active',
    ipAddress: '192.168.10.149',
    gateway: 'GW-WIFI-02 (RS-485 / MQTT)',
    firmware: 'v3.4.0-PROD',
    signalDbm: -54,
    uptime: '99.91% (19d 08h)',
    activePowerKw: 278.0,
    ratedCapacityKw: 350,
    voltageV: 412.5,
    currentA: 388.9,
    powerFactor: 0.99,
    frequencyHz: 49.98,
    temperatureC: 42.1,
    connectedMeters: [
      { id: 'MTR-102', name: 'Solar Inverter 1 Array', type: 'Solar Inverter Meter', loadKw: 145.2, kwh: 14.52, status: 'Active' },
      { id: 'MTR-105', name: 'Solar Inverter 2 Array', type: 'Solar Inverter Meter', loadKw: 98.4, kwh: 9.84, status: 'Active' },
      { id: 'MTR-106', name: 'Battery ESS Storage', type: 'Storage Meter', loadKw: 24.2, kwh: 16.40, status: 'Active' },
      { id: 'MTR-108', name: 'Solar Auxiliary Control', type: 'PV Aux Meter', loadKw: 10.2, kwh: 7.15, status: 'Active' },
    ],
    hourlyTrends: [
      { time: '06:00', power: 15 },
      { time: '08:00', power: 110 },
      { time: '10:00', power: 245 },
      { time: '12:00', power: 278 },
      { time: '14:00', power: 260 },
      { time: '16:00', power: 180 },
      { time: '18:00', power: 45 },
      { time: '20:00', power: 0 },
    ],
  },
];

const INITIAL_METERS: MeterItem[] = [
  {
    id: 'MTR-101',
    name: 'Main Grid Input',
    type: 'Energy Meter (HT)',
    hub: 'HUB-001',
    status: 'Active',
    voltageL1: 239.4,
    voltageL2: 240.1,
    voltageL3: 239.8,
    currentL1: 390.2,
    currentL2: 388.4,
    currentL3: 391.0,
    totalKwh: 184520,
    thdPercent: 1.8,
    activeKw: 280.4,
  },
  {
    id: 'MTR-102',
    name: 'Solar Inverter 1',
    type: 'Solar Meter',
    hub: 'HUB-002',
    status: 'Active',
    voltageL1: 238.2,
    voltageL2: 238.7,
    voltageL3: 238.0,
    currentL1: 202.4,
    currentL2: 203.1,
    currentL3: 201.8,
    totalKwh: 64210,
    thdPercent: 1.4,
    activeKw: 145.2,
  },
];

const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'AST-501',
    name: 'Transformer 1',
    category: 'Electrical',
    manufacturer: 'Siemens',
    status: 'Active',
    healthScore: 98,
    runningHours: 8420,
    temperatureC: 58.2,
    vibrationMmS: 0.8,
    nextServiceDays: 62,
    powerDrawKw: 410.0,
  },
  {
    id: 'AST-502',
    name: 'HVAC Chiller A',
    category: 'Mechanical',
    manufacturer: 'Trane',
    status: 'Maintenance',
    healthScore: 76,
    runningHours: 12640,
    temperatureC: 72.4,
    vibrationMmS: 2.4,
    nextServiceDays: 8,
    powerDrawKw: 94.1,
  },
];

export function MasterManagement() {
  const { tab } = useParams<{ tab: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<HubItem | null>(null);
  const [selectedMeter, setSelectedMeter] = useState<MeterItem | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Validate the tab parameter
  if (!tab || !['hubs', 'meters', 'assets'].includes(tab)) {
    return <Navigate to="/master/assets" replace />;
  }

  const activeTab = tab as TabType;
  const titleMap = {
    hubs: 'Hubs Management',
    meters: 'Meters Management',
    assets: 'Assets Management',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database size={24} className="text-indigo-600 dark:text-indigo-400" />
            {titleMap[activeTab]}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configure {activeTab} in master data and inspect real-time visual telemetry
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Create New {activeTab === 'hubs' ? 'Hub' : activeTab === 'meters' ? 'Meter' : 'Asset'}</span>
        </button>
      </div>

      {/* Content Table Card */}
      <div className="bg-card rounded-lg shadow-md border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Click <strong>View</strong> to open interactive visual telemetry card</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'hubs' && (
            <HubsTable
              searchTerm={searchTerm}
              selectedHub={selectedHub}
              onSelectHub={(hub) => setSelectedHub(hub)}
            />
          )}
          {activeTab === 'meters' && (
            <MetersTable
              searchTerm={searchTerm}
              selectedMeter={selectedMeter}
              onSelectMeter={(meter) => setSelectedMeter(meter)}
            />
          )}
          {activeTab === 'assets' && (
            <AssetsTable
              searchTerm={searchTerm}
              selectedAsset={selectedAsset}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />
          )}
        </div>
      </div>

      {/* Visual Telemetry Card on the Page */}
      {selectedHub && activeTab === 'hubs' && (
        <HubVisualCard key={selectedHub.id} hub={selectedHub} onClose={() => setSelectedHub(null)} />
      )}

      {selectedMeter && activeTab === 'meters' && (
        <MeterVisualCard meter={selectedMeter} onClose={() => setSelectedMeter(null)} />
      )}

      {selectedAsset && activeTab === 'assets' && (
        <AssetVisualCard asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <CreateModal tab={activeTab} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function HubsTable({
  searchTerm,
  selectedHub,
  onSelectHub,
}: {
  searchTerm: string;
  selectedHub: HubItem | null;
  onSelectHub: (hub: HubItem | null) => void;
}) {
  const hubs = INITIAL_HUBS.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Hub ID</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Location Details</th>
          <th className="px-6 py-3">Geolocation (Lat, Lng)</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3 text-center">Visual View</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {hubs.map((hub) => {
          const isSelected = selectedHub?.id === hub.id;
          return (
            <tr
              key={hub.id}
              className={cn(
                'transition-all',
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 font-medium'
                  : 'hover:bg-muted/30'
              )}
            >
              <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                {isSelected && (
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full inline-block mr-1"></span>
                )}
                {hub.id}
              </td>
              <td className="px-6 py-4">{hub.name}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span>{hub.location}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Map size={14} />
                  <span>
                    {hub.lat}, {hub.lng}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {hub.status}
                </span>
              </td>
              {/* Visual View Column */}
              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onSelectHub(isSelected ? null : hub)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-card'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800'
                  )}
                  title={isSelected ? 'Hide visual card' : 'View visual telemetry card'}
                >
                  <Eye size={14} className={isSelected ? 'animate-pulse' : ''} />
                  <span>{isSelected ? 'Viewing' : 'View'}</span>
                </button>
              </td>
              <td className="px-6 py-4 flex gap-3 text-muted-foreground">
                <button
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface DynamicMeter {
  id: string;
  name: string;
  subtitle: string;
  kwh: number;
  kw: number;
  voltage: number;
  current: number;
  pf: number;
  status: 'Connected' | 'Warning' | 'Offline';
}

function HubVisualCard({
  hub,
  onClose,
}: {
  hub: HubItem;
  onClose: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [activeViewMode, setActiveViewMode] = useState<'topology' | 'analytics'>('topology');
  const [displayUnit, setDisplayUnit] = useState<'kwh' | 'kw'>('kwh');
  const [selectedMeterDetail, setSelectedMeterDetail] = useState<DynamicMeter | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize dynamic meters from hub data (defaulting to Image 2 values if available)
  const [meters, setMeters] = useState<DynamicMeter[]>(() => {
    return hub.connectedMeters.map((m, idx) => ({
      id: m.id,
      name: `Meter ${idx + 1}`,
      subtitle: m.name,
      kwh: m.kwh ?? (idx === 0 ? 12.48 : idx === 1 ? 8.76 : idx === 2 ? 15.32 : 10.21),
      kw: m.loadKw,
      voltage: +(hub.voltageV / Math.sqrt(3) + (idx * 0.4 - 0.6)).toFixed(1),
      current: +((m.loadKw * 1000) / (230 * hub.powerFactor)).toFixed(1),
      pf: +(hub.powerFactor - (idx * 0.01)).toFixed(2),
      status: 'Connected' as const,
    }));
  });

  // Smooth scroll into view
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [hub.id]);

  // Dynamic live animation effect: fluctuate power & increment energy every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMeters((prev) =>
        prev.map((m) => {
          const deltaKw = (Math.random() - 0.48) * 0.6;
          const newKw = Math.max(0.5, +(m.kw + deltaKw).toFixed(1));
          const newKwh = +(m.kwh + 0.01).toFixed(2);
          const newVolt = +(m.voltage + (Math.random() - 0.5) * 0.4).toFixed(1);
          return {
            ...m,
            kw: newKw,
            kwh: newKwh,
            voltage: newVolt,
          };
        })
      );
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 600);
  };

  const peakPower = Math.max(...hub.hourlyTrends.map((t) => t.power));
  const avgPower = Math.round(
    hub.hourlyTrends.reduce((a, b) => a + b.power, 0) / hub.hourlyTrends.length
  );
  const capacityPercent = Math.min(
    100,
    Math.round((hub.activePowerKw / hub.ratedCapacityKw) * 100)
  );

  const cardContent = (
    <div
      ref={cardRef}
      className="w-full max-w-5xl max-h-[94vh] flex flex-col bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
    >
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .animate-flow-dash {
          animation: flowDash 1.2s linear infinite;
        }
        @keyframes impPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.25); filter: drop-shadow(0 0 5px #ef4444); }
        }
        .animate-imp-pulse {
          animation: impPulse 1.6s ease-in-out infinite;
        }
        @keyframes hubGlowAura {
          0%, 100% { opacity: 0.2; transform: scale(0.96); }
          50% { opacity: 0.45; transform: scale(1.06); }
        }
        .animate-hub-glow {
          animation: hubGlowAura 3s ease-in-out infinite;
        }
      `}</style>

      {/* Visual Header (Single Clean Row) */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-500/10 via-card to-card border-b border-border/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
            <Radio size={20} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {hub.id}
              </span>
              <h3 className="text-lg font-bold text-foreground leading-tight">{hub.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
              <MapPin size={11} />
              <span>{hub.location}</span>
              <span>•</span>
              <span className="font-mono">{hub.lat}, {hub.lng}</span>
              <span>•</span>
              <span>Firmware: {hub.firmware}</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-muted/80 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setActiveViewMode('topology')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeViewMode === 'topology'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Cpu size={13} />
              <span>Topology Network</span>
            </button>
            <button
              onClick={() => setActiveViewMode('analytics')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeViewMode === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Activity size={13} />
              <span>24h Load Curve</span>
            </button>
          </div>

          <span className="text-xs text-muted-foreground hidden xl:inline">
            Updated: {lastRefreshed}
          </span>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/70 hover:bg-muted text-foreground rounded-lg text-xs font-medium border border-border transition-colors cursor-pointer"
            title="Refresh Real-Time Telemetry"
          >
            <RefreshCw
              size={13}
              className={cn('transition-transform', isRefreshing && 'animate-spin')}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
            title="Close Popup (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Slim Executive Telemetry Ribbon (Saves vertical space) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 px-5 py-2.5 bg-muted/20 border-b border-border/70 shrink-0">
        {/* Metric 1 */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/70 shadow-xs">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Zap size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Demand
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground leading-tight">
                {hub.activePowerKw.toFixed(1)}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">kW</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold leading-none">
                {capacityPercent}% Load
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/70 shadow-xs">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Activity size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              3-Phase Voltage
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground leading-tight">
                {hub.voltageV.toFixed(1)}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">V (HT)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
                Balanced
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/70 shadow-xs">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Power Factor
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground leading-tight">
                {hub.powerFactor.toFixed(2)}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">lag</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/70 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Gateway Health
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground leading-tight">
                {hub.signalDbm}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">dBm</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Showcase Section (Scrollable body) */}
      <div className="flex-1 overflow-y-auto">
        {activeViewMode === 'topology' ? (
          /* IMAGE 2 DESIGN STYLE: Dynamic Animated Network Topology */
          <div className="p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/40 dark:via-background dark:to-background">
            {/* Top Status & Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                  All Meters Connected
                </span>
                <span className="text-xs text-muted-foreground">
                  ({meters.length} Online Nodes Active)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  Meter Box Display:
                </span>
                <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5 text-xs">
                  <button
                    onClick={() => setDisplayUnit('kwh')}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer',
                      displayUnit === 'kwh'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    kWh (Energy)
                  </button>
                  <button
                    onClick={() => setDisplayUnit('kw')}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer',
                      displayUnit === 'kw'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    kW (Demand)
                  </button>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Data Stream</span>
                </div>
              </div>
            </div>

            {/* Topology Canvas with SVG Wires & Cards */}
            <div className="relative max-w-4xl mx-auto py-1">
              {/* SVG Connecting Cables Overlay */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
                viewBox="0 0 1000 520"
                preserveAspectRatio="none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Wire 1: Top-Left (Meter 1) -> Hub Left Port */}
                <path
                  d="M 270 130 C 370 130, 360 230, 420 230"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 270 130 C 370 130, 360 230, 420 230"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 12"
                  className="animate-flow-dash"
                />
                <circle r="4.5" fill="#38bdf8" filter="url(#wireGlow)">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path="M 270 130 C 370 130, 360 230, 420 230"
                  />
                </circle>

                {/* Wire 2: Top-Right (Meter 2) -> Hub Right Port */}
                <path
                  d="M 730 130 C 630 130, 640 230, 580 230"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 730 130 C 630 130, 640 230, 580 230"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 12"
                  className="animate-flow-dash"
                />
                <circle r="4.5" fill="#38bdf8" filter="url(#wireGlow)">
                  <animateMotion
                    dur="2.2s"
                    repeatCount="indefinite"
                    path="M 730 130 C 630 130, 640 230, 580 230"
                  />
                </circle>

                {/* Wire 3: Bottom-Left (Meter 3) -> Hub Bottom-Left Port */}
                <path
                  d="M 270 390 C 370 390, 360 290, 420 290"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 270 390 C 370 390, 360 290, 420 290"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 12"
                  className="animate-flow-dash"
                />
                <circle r="4.5" fill="#38bdf8" filter="url(#wireGlow)">
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path="M 270 390 C 370 390, 360 290, 420 290"
                  />
                </circle>

                {/* Wire 4: Bottom-Right (Meter 4) -> Hub Bottom-Right Port */}
                <path
                  d="M 730 390 C 630 390, 640 290, 580 290"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 730 390 C 630 390, 640 290, 580 290"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 12"
                  className="animate-flow-dash"
                />
                <circle r="4.5" fill="#38bdf8" filter="url(#wireGlow)">
                  <animateMotion
                    dur="2.1s"
                    repeatCount="indefinite"
                    path="M 730 390 C 630 390, 640 290, 580 290"
                  />
                </circle>

                {/* Connection Node Rings on Hub */}
                <circle cx="420" cy="230" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="580" cy="230" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="420" cy="290" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="580" cy="290" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              </svg>

              {/* Layout Grid: 3 Columns matching Image 2 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                {/* LEFT COLUMN: Meter 1 (Top) & Meter 3 (Bottom) */}
                <div className="md:col-span-4 flex flex-col gap-6">
                  {meters[0] && (
                    <div
                      onClick={() => setSelectedMeterDetail(meters[0])}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <DigitalMeterCard
                        meter={meters[0]}
                        displayUnit={displayUnit}
                        nodeSide="right"
                        isSelected={selectedMeterDetail?.id === meters[0].id}
                      />
                    </div>
                  )}

                  {meters[2] && (
                    <div
                      onClick={() => setSelectedMeterDetail(meters[2])}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <DigitalMeterCard
                        meter={meters[2]}
                        displayUnit={displayUnit}
                        nodeSide="right"
                        isSelected={selectedMeterDetail?.id === meters[2].id}
                      />
                    </div>
                  )}
                </div>

                {/* CENTER COLUMN: Central Hub Device (MeterHub) */}
                <div className="md:col-span-4 flex flex-col items-center justify-center my-4 md:my-0">
                  <div className="relative flex flex-col items-center">
                    {/* Circular Ambient Glow Backdrop */}
                    <div className="absolute -inset-8 rounded-full bg-blue-500/20 dark:bg-blue-400/25 blur-2xl pointer-events-none animate-hub-glow" />

                    {/* Central Router Hardware Chassis */}
                    <div className="w-48 bg-slate-900 dark:bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl relative z-10 flex flex-col items-center">
                      {/* Left Antenna */}
                      <div className="absolute -top-7 left-5 w-2.5 h-8 bg-slate-800 border border-slate-600 rounded-t-full flex flex-col items-center">
                        <div className="w-full h-1 bg-slate-600 mt-2" />
                      </div>

                      {/* Right Antenna */}
                      <div className="absolute -top-7 right-5 w-2.5 h-8 bg-slate-800 border border-slate-600 rounded-t-full flex flex-col items-center">
                        <div className="w-full h-1 bg-slate-600 mt-2" />
                      </div>

                      {/* Top Cooling Ventilation Grill */}
                      <div className="w-full flex justify-center gap-1 mb-2 pt-0.5">
                        <div className="w-5 h-1 bg-slate-700/60 rounded-full" />
                        <div className="w-5 h-1 bg-slate-700/60 rounded-full" />
                        <div className="w-5 h-1 bg-slate-700/60 rounded-full" />
                        <div className="w-5 h-1 bg-slate-700/60 rounded-full" />
                      </div>

                      {/* Front Center Waveform Logo & MeterHub Name */}
                      <div className="flex flex-col items-center gap-1 my-1.5">
                        <div className="flex items-center gap-1 h-4 text-white">
                          <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-3 bg-white rounded-full" />
                          <span className="w-1 h-4.5 bg-white rounded-full" />
                          <span className="w-1 h-3 bg-white rounded-full" />
                          <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                        <span className="text-white font-bold text-xs tracking-wide">MeterHub</span>
                      </div>

                      {/* 4 Status LEDs on Front Panel */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 w-full justify-center">
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
                          title="Power / System Ready"
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"
                          title="WiFi / WAN Stream"
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"
                          title="RS485 Modbus Bus Data"
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]"
                          title="MQTT Gateway Active"
                        />
                      </div>
                    </div>

                    {/* Hub Name & Online Status Badges underneath */}
                    <div className="flex flex-col items-center gap-1 mt-2.5 z-10">
                      <div className="px-3.5 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[11px] border border-slate-700 shadow-sm">
                        MeterHub
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Meter 2 (Top) & Meter 4 (Bottom) */}
                <div className="md:col-span-4 flex flex-col gap-6">
                  {meters[1] && (
                    <div
                      onClick={() => setSelectedMeterDetail(meters[1])}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <DigitalMeterCard
                        meter={meters[1]}
                        displayUnit={displayUnit}
                        nodeSide="left"
                        isSelected={selectedMeterDetail?.id === meters[1].id}
                      />
                    </div>
                  )}

                  {meters[3] && (
                    <div
                      onClick={() => setSelectedMeterDetail(meters[3])}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <DigitalMeterCard
                        meter={meters[3]}
                        displayUnit={displayUnit}
                        nodeSide="left"
                        isSelected={selectedMeterDetail?.id === meters[3].id}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Clicked Meter Quick Telemetry Drawer Card */}
              {selectedMeterDetail && (
                <div className="mt-5 p-3.5 bg-card rounded-xl border-2 border-indigo-500/30 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Zap size={15} className="text-indigo-600 dark:text-indigo-400" />
                      <h5 className="font-bold text-xs text-foreground">
                        {selectedMeterDetail.name}: {selectedMeterDetail.subtitle} ({selectedMeterDetail.id})
                      </h5>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Live Telemetry
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedMeterDetail(null)}
                      className="text-muted-foreground hover:text-foreground p-1 rounded-md"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[10px] text-muted-foreground">Cumulative Energy</span>
                      <p className="font-mono font-bold text-foreground text-xs mt-0.5">
                        {selectedMeterDetail.kwh.toFixed(2)} kWh
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[10px] text-muted-foreground">Instant Demand</span>
                      <p className="font-mono font-bold text-foreground text-xs mt-0.5">
                        {selectedMeterDetail.kw.toFixed(1)} kW
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[10px] text-muted-foreground">Line Voltage</span>
                      <p className="font-mono font-bold text-foreground text-xs mt-0.5">
                        {selectedMeterDetail.voltage.toFixed(1)} V
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[10px] text-muted-foreground">Phase Current</span>
                      <p className="font-mono font-bold text-foreground text-xs mt-0.5">
                        {selectedMeterDetail.current.toFixed(1)} A
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 border border-border">
                      <span className="text-[10px] text-muted-foreground">Power Factor</span>
                      <p className="font-mono font-bold text-emerald-600 text-xs mt-0.5">
                        {selectedMeterDetail.pf} lag
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ANALYTICS & 24H LOAD PROFILE VIEW (IMAGE 1 ANALYTICS) */
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Live Load Curve */}
            <div className="lg:col-span-7 bg-muted/20 p-4 rounded-xl border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Activity size={16} className="text-indigo-600 dark:text-indigo-400" />
                      Live 24-Hour Load Profile
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Active power distribution in kW over time
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Peak: <strong className="text-foreground">{peakPower} kW</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Avg: <strong className="text-foreground">{avgPower} kW</strong>
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hub.hourlyTrends}>
                      <defs>
                        <linearGradient id={`hubPowerGrad-${hub.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} unit="kW" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderRadius: '8px',
                          border: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="power"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#hubPowerGrad-${hub.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Thermometer size={14} className="text-amber-500" />
                  Internal Temp:{' '}
                  <strong className="text-foreground">{hub.temperatureC}°C (Normal)</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu size={14} className="text-indigo-500" />
                  Gateway: <strong className="text-foreground">{hub.gateway}</strong>
                </span>
              </div>
            </div>

            {/* Right Column: Connected Sub-meters & Architecture */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-muted/20 p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                    Downlink Connected Meters ({meters.length})
                  </h4>
                  <span className="text-xs text-muted-foreground">Real-time load share</span>
                </div>

                <div className="space-y-2">
                  {meters.map((meter) => {
                    const meterShare = Math.round((meter.kw / hub.activePowerKw) * 100) || 0;
                    return (
                      <div
                        key={meter.id}
                        className="p-2.5 bg-card rounded-lg border border-border text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {meter.id}
                            </span>
                            <span className="font-semibold text-foreground">{meter.subtitle}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {meter.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                          <span>Accumulated: {meter.kwh.toFixed(2)} kWh</span>
                          <span className="font-semibold text-foreground">
                            {meter.kw.toFixed(1)} kW ({meterShare}%)
                          </span>
                        </div>

                        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-1 rounded-full"
                            style={{ width: `${meterShare}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hardware & Geolocation Chip */}
              <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      IP: <span className="font-mono text-muted-foreground">{hub.ipAddress}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Coordinates: {hub.lat}, {hub.lng}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${hub.lat},${hub.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-muted transition-colors"
                >
                  <span>View Map</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {cardContent}
    </div>
  );
}

// DIGITAL ENERGY METER HARDWARE CARD (Exact match to Image 2 design style)
function DigitalMeterCard({
  meter,
  displayUnit,
  nodeSide,
  isSelected,
}: {
  meter: DynamicMeter;
  displayUnit: 'kwh' | 'kw';
  nodeSide: 'left' | 'right';
  isSelected?: boolean;
}) {
  const displayValue = displayUnit === 'kwh' ? meter.kwh.toFixed(2) : meter.kw.toFixed(1);
  const unitLabel = displayUnit === 'kwh' ? 'kWh' : 'kW';

  return (
    <div
      className={cn(
        'w-full max-w-[240px] mx-auto bg-card dark:bg-slate-900/90 border rounded-2xl p-3 shadow-md transition-all duration-300 relative',
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-500/20 shadow-xl'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg'
      )}
    >
      {/* Blue Cable Connection Node Socket on the edge facing Hub */}
      {nodeSide === 'right' && (
        <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sky-500 border-2 border-card items-center justify-center shadow-md z-20 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      )}
      {nodeSide === 'left' && (
        <div className="hidden md:flex absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sky-500 border-2 border-card items-center justify-center shadow-md z-20 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      )}

      {/* Top Header Row matching Image 2 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Circular Lightning Badge */}
          <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Zap size={13} className="fill-blue-500 text-blue-500" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-foreground tracking-tight leading-tight">{meter.name}</h5>
            <span className="text-[10px] text-muted-foreground block leading-none">
              {meter.id}
            </span>
          </div>
        </div>

        {/* Connected Status with Green Dot */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Connected</span>
        </div>
      </div>

      {/* Photorealistic Utility Energy Meter Hardware Casing */}
      <div className="bg-gradient-to-b from-slate-100 via-slate-200 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl p-2.5 shadow-inner relative overflow-hidden">
        {/* 4 Corner Screws */}
        <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500/70" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500/70" />
        <span className="absolute bottom-6 left-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500/70" />
        <span className="absolute bottom-6 right-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500/70" />

        {/* Recessed LCD Display Frame */}
        <div className="bg-slate-300/80 dark:bg-slate-950 p-1 rounded-lg border border-slate-400 dark:border-slate-700 shadow-inner mb-2">
          {/* LCD Digital Screen (Authentic 7-Segment Greenish-Gray Look) */}
          <div className="bg-[#d7e4d0] dark:bg-[#122216] border border-[#a8c29e] dark:border-[#204026] rounded-md px-2.5 py-1.5 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Top Micro Legend */}
            <div className="w-full flex justify-between items-center text-[7.5px] font-mono font-bold text-[#2d4d2e] dark:text-[#52e874]/70 tracking-wider uppercase">
              <span>{displayUnit === 'kwh' ? 'TOTAL CUMULATIVE' : 'INSTANT DEMAND'}</span>
              <span>L1·L2·L3</span>
            </div>

            {/* Dynamic Large LCD Readout */}
            <div className="my-0.5 flex items-baseline justify-center gap-1">
              <span className="font-mono text-lg sm:text-xl font-black tracking-widest text-[#102213] dark:text-[#52e874] drop-shadow-xs">
                {displayValue}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#2d4d2e] dark:text-[#52e874]/80">
                {unitLabel}
              </span>
            </div>

            {/* Bottom Micro Telemetry on LCD Screen */}
            <div className="w-full flex justify-between items-center text-[7.5px] font-mono text-[#2d4d2e] dark:text-[#52e874]/70">
              <span>{meter.voltage}V</span>
              <span>RUN ●</span>
              <span>{meter.pf} PF</span>
            </div>
          </div>
        </div>

        {/* Hardware Faceplate Controls below Display */}
        <div className="flex items-center justify-between px-1.5 py-0.5">
          {/* Optical Communication Port */}
          <div
            className="w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-600 flex items-center justify-center shadow-xs"
            title="Optical Comm Port (IEC 62056)"
          >
            <div className="w-1 h-1 rounded-full bg-slate-500" />
          </div>

          {/* Red Impulse Blink LED (imp/kWh) that pulses dynamically with power */}
          <div className="flex items-center gap-1" title="Energy Calibration Pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-imp-pulse shadow-[0_0_6px_#ef4444]" />
            <span className="text-[7.5px] font-mono font-bold text-slate-600 dark:text-slate-400">
              imp/kWh
            </span>
          </div>

          {/* Test / Display Scroll Push-Button */}
          <div
            className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-500 shadow-xs flex items-center justify-center cursor-pointer"
            title="Scroll Display"
          >
            <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
          </div>
        </div>

        {/* Bottom Heavy-Duty Terminal Block */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-b-lg py-1 px-2.5 mt-1 flex justify-between items-center border-t border-slate-700/80">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-600" />
        </div>
      </div>
    </div>
  );
}

function MetersTable({
  searchTerm,
  selectedMeter,
  onSelectMeter,
}: {
  searchTerm: string;
  selectedMeter: MeterItem | null;
  onSelectMeter: (meter: MeterItem | null) => void;
}) {
  const meters = INITIAL_METERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.hub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Meter ID</th>
          <th className="px-6 py-3">Meter Name</th>
          <th className="px-6 py-3">Type</th>
          <th className="px-6 py-3">Assigned Hub</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3 text-center">Visual View</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {meters.map((meter) => {
          const isSelected = selectedMeter?.id === meter.id;
          return (
            <tr
              key={meter.id}
              className={cn(
                'transition-all',
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 font-medium'
                  : 'hover:bg-muted/30'
              )}
            >
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
              {/* Visual View Column */}
              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onSelectMeter(isSelected ? null : meter)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-card'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800'
                  )}
                  title={isSelected ? 'Hide visual card' : 'View visual telemetry card'}
                >
                  <Eye size={14} className={isSelected ? 'animate-pulse' : ''} />
                  <span>{isSelected ? 'Viewing' : 'View'}</span>
                </button>
              </td>
              <td className="px-6 py-4 flex gap-3 text-muted-foreground">
                <button
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MeterVisualCard({
  meter,
  onClose,
}: {
  meter: MeterItem;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [meter.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-card border-2 border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden p-5 space-y-4 my-auto"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Zap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600">
                  {meter.id}
                </span>
                <h3 className="text-lg font-bold text-foreground">{meter.name}</h3>
                <span className="text-xs text-muted-foreground">Assigned to: {meter.hub}</span>
              </div>
              <p className="text-xs text-muted-foreground">{meter.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Active Load</span>
            <p className="text-xl font-bold text-foreground mt-1">{meter.activeKw} kW</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Cumulative Energy</span>
            <p className="text-xl font-bold text-foreground mt-1">
              {meter.totalKwh.toLocaleString()} kWh
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Avg Line Voltage</span>
            <p className="text-xl font-bold text-foreground mt-1">
              {((meter.voltageL1 + meter.voltageL2 + meter.voltageL3) / 3).toFixed(1)} V
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">THD (Harmonics)</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">{meter.thdPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetsTable({
  searchTerm,
  selectedAsset,
  onSelectAsset,
}: {
  searchTerm: string;
  selectedAsset: AssetItem | null;
  onSelectAsset: (asset: AssetItem | null) => void;
}) {
  const assets = INITIAL_ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
        <tr>
          <th className="px-6 py-3">Asset ID</th>
          <th className="px-6 py-3">Asset Name</th>
          <th className="px-6 py-3">Category</th>
          <th className="px-6 py-3">Manufacturer</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3 text-center">Visual View</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {assets.map((asset) => {
          const isSelected = selectedAsset?.id === asset.id;
          return (
            <tr
              key={asset.id}
              className={cn(
                'transition-all',
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 font-medium'
                  : 'hover:bg-muted/30'
              )}
            >
              <td className="px-6 py-4 font-medium text-foreground">{asset.id}</td>
              <td className="px-6 py-4 flex items-center gap-2">
                <HardDrive size={14} className="text-amber-600 dark:text-amber-400" />
                {asset.name}
              </td>
              <td className="px-6 py-4 text-muted-foreground">{asset.category}</td>
              <td className="px-6 py-4">{asset.manufacturer}</td>
              <td className="px-6 py-4">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-semibold border',
                    asset.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  )}
                >
                  {asset.status}
                </span>
              </td>
              {/* Visual View Column */}
              <td className="px-6 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onSelectAsset(isSelected ? null : asset)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-card'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800'
                  )}
                  title={isSelected ? 'Hide visual card' : 'View visual telemetry card'}
                >
                  <Eye size={14} className={isSelected ? 'animate-pulse' : ''} />
                  <span>{isSelected ? 'Viewing' : 'View'}</span>
                </button>
              </td>
              <td className="px-6 py-4 flex gap-3 text-muted-foreground">
                <button
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function AssetVisualCard({
  asset,
  onClose,
}: {
  asset: AssetItem;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [asset.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-card border-2 border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden p-5 space-y-4 my-auto"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/10 text-amber-600 rounded-lg">
              <HardDrive size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-muted text-foreground">
                  {asset.id}
                </span>
                <h3 className="text-lg font-bold text-foreground">{asset.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {asset.category} • {asset.manufacturer}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Equipment Health & Digital Twin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Health Score</span>
            <p
              className={cn(
                'text-xl font-bold mt-1',
                asset.healthScore > 85 ? 'text-emerald-600' : 'text-amber-600'
              )}
            >
              {asset.healthScore}%
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Operating Temp</span>
            <p className="text-xl font-bold text-foreground mt-1">{asset.temperatureC}°C</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Vibration (RMS)</span>
            <p className="text-xl font-bold text-foreground mt-1">{asset.vibrationMmS} mm/s</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Next Service In</span>
            <p className="text-xl font-bold text-indigo-600 mt-1">
              {asset.nextServiceDays} days
            </p>
          </div>
        </div>
      </div>
    </div>
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
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Name</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter name..."
            />
          </div>

          {tab === 'hubs' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Location Name
                </label>
                <input
                  type="text"
                  className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Roof, Basement"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    placeholder="0.0000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                    placeholder="0.0000"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'meters' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Type
                </label>
                <select className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500">
                  <option>Energy Meter (HT)</option>
                  <option>Energy Meter (LT)</option>
                  <option>Water Meter</option>
                  <option>Gas Meter</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Assign to Hub
                </label>
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
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Electrical, Mechanical"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Manufacturer / Model
                </label>
                <input
                  type="text"
                  className="w-full bg-muted/50 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Siemens XYZ"
                />
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-foreground bg-background border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            Save {tab === 'hubs' ? 'Hub' : tab === 'meters' ? 'Meter' : 'Asset'}
          </button>
        </div>
      </div>
    </div>
  );
}
