import React, { useState, useMemo } from 'react';
import {
  Download,
  Printer,
  Search,
  MapPin,
  Activity,
  Zap,
  Clock,
  ExternalLink,
  RefreshCw,
  Building2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  X,
  Navigation,
  Gauge
} from 'lucide-react';
import { cn } from '../utils';

// Types
export interface MeterReportItem {
  id: string;
  name: string;
  type: 'HT' | 'LT' | 'Dual/Hybrid';
  subType: string;
  htHours: number;
  ltHours: number;
  htEnergyKwh: number;
  ltEnergyKwh: number;
  powerFactor: number;
  status: 'Active' | 'Idle' | 'Maintenance' | 'Standby';
  loadPercentage: number;
  lastReadingTime: string;
}

export interface HubReportGroup {
  id: string;
  name: string;
  location: string;
  building: string;
  zone: string;
  lat: number;
  lng: number;
  elevation: string;
  status: 'Active' | 'Warning' | 'Maintenance';
  meters: MeterReportItem[];
}

// 3 Distinct Repeating Accent Colors for Hub Left-Border Only (Clean Minimalist Aesthetics)
export const HUB_COLOR_THEMES = [
  {
    name: 'indigo',
    borderLeft: 'border-l-[4px] border-l-indigo-600 dark:border-l-indigo-500',
    gpsIcon: 'text-indigo-600 dark:text-indigo-400',
    idBadge: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
  },
  {
    name: 'emerald',
    borderLeft: 'border-l-[4px] border-l-emerald-600 dark:border-l-emerald-500',
    gpsIcon: 'text-emerald-600 dark:text-emerald-400',
    idBadge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
  },
  {
    name: 'amber',
    borderLeft: 'border-l-[4px] border-l-amber-600 dark:border-l-amber-500',
    gpsIcon: 'text-amber-600 dark:text-amber-400',
    idBadge: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
  }
];

// Initial Industrial Data Set
const INITIAL_HUB_DATA: HubReportGroup[] = [
  {
    id: 'HUB-001',
    name: 'Main Plant Primary Substation',
    location: 'Block A, Level 1 - Transformer Yard',
    building: 'Main Manufacturing Block',
    zone: 'Zone-1 (High Voltage)',
    lat: 12.9716,
    lng: 77.5946,
    elevation: '920m ASL',
    status: 'Active',
    meters: [
      {
        id: 'MTR-101',
        name: '11kV Main Incomer Line',
        type: 'HT',
        subType: 'HT Grid Incomer',
        htHours: 718.5,
        ltHours: 0,
        htEnergyKwh: 142500,
        ltEnergyKwh: 0,
        powerFactor: 0.98,
        status: 'Active',
        loadPercentage: 82,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-102',
        name: 'Plant Floor LT Distribution-1',
        type: 'LT',
        subType: 'LT Main Bus',
        htHours: 0,
        ltHours: 712.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 38400,
        powerFactor: 0.95,
        status: 'Active',
        loadPercentage: 74,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-103',
        name: 'Chiller Plant 415V LT Incomer',
        type: 'LT',
        subType: 'HVAC Chiller Bus',
        htHours: 0,
        ltHours: 680.5,
        htEnergyKwh: 0,
        ltEnergyKwh: 51200,
        powerFactor: 0.92,
        status: 'Active',
        loadPercentage: 88,
        lastReadingTime: '2 mins ago'
      },
      {
        id: 'MTR-104',
        name: 'Air Compressor Bank LT-2',
        type: 'LT',
        subType: 'Pneumatics Feed',
        htHours: 0,
        ltHours: 645.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 29800,
        powerFactor: 0.91,
        status: 'Active',
        loadPercentage: 65,
        lastReadingTime: 'Just now'
      }
    ]
  },
  {
    id: 'HUB-002',
    name: 'Rooftop Solar & Renewable Hub',
    location: 'Block B, Roof Level - Solar Array Alpha',
    building: 'Warehouse & Logistics',
    zone: 'Zone-3 (Renewable Grid)',
    lat: 12.9718,
    lng: 77.5948,
    elevation: '945m ASL',
    status: 'Active',
    meters: [
      {
        id: 'MTR-201',
        name: 'Solar Central Inverter HT Sync',
        type: 'HT',
        subType: 'Solar Bi-Directional HT',
        htHours: 342.0,
        ltHours: 0,
        htEnergyKwh: 68000,
        ltEnergyKwh: 0,
        powerFactor: 0.99,
        status: 'Active',
        loadPercentage: 91,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-202',
        name: 'Solar Auxiliary LT Feeder',
        type: 'LT',
        subType: 'Balance of Plant LT',
        htHours: 0,
        ltHours: 720.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 3200,
        powerFactor: 0.96,
        status: 'Active',
        loadPercentage: 28,
        lastReadingTime: '5 mins ago'
      },
      {
        id: 'MTR-203',
        name: 'Rooftop Weather & Irradiance Station',
        type: 'LT',
        subType: 'Telemetry LT Feed',
        htHours: 0,
        ltHours: 720.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 450,
        powerFactor: 0.94,
        status: 'Active',
        loadPercentage: 12,
        lastReadingTime: 'Just now'
      }
    ]
  },
  {
    id: 'HUB-003',
    name: 'Substation North Yard',
    location: 'North Yard, Sector 4 - HT Switchgear Room',
    building: 'Grid Intake Substation',
    zone: 'Zone-2 (HT Switchyard)',
    lat: 12.9735,
    lng: 77.5960,
    elevation: '918m ASL',
    status: 'Active',
    meters: [
      {
        id: 'MTR-301',
        name: '22kV High Voltage Grid Feeder',
        type: 'HT',
        subType: 'High Tension Primary',
        htHours: 710.0,
        ltHours: 0,
        htEnergyKwh: 185000,
        ltEnergyKwh: 0,
        powerFactor: 0.97,
        status: 'Active',
        loadPercentage: 79,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-302',
        name: 'Distribution Transformer TX-2 LT',
        type: 'LT',
        subType: 'Step-Down 415V LT',
        htHours: 0,
        ltHours: 695.5,
        htEnergyKwh: 0,
        ltEnergyKwh: 42000,
        powerFactor: 0.93,
        status: 'Active',
        loadPercentage: 68,
        lastReadingTime: '1 min ago'
      },
      {
        id: 'MTR-303',
        name: 'Capacitor Bank Automatic PF Panel',
        type: 'LT',
        subType: 'APFC Power Quality',
        htHours: 0,
        ltHours: 718.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 1200,
        powerFactor: 0.99,
        status: 'Active',
        loadPercentage: 45,
        lastReadingTime: 'Just now'
      }
    ]
  },
  {
    id: 'HUB-004',
    name: 'Backup Genset & Emergency Power Hub',
    location: 'Auxiliary Utility Yard - DG Shed 1 & 2',
    building: 'Emergency Power Complex',
    zone: 'Zone-5 (Standby Generator)',
    lat: 12.9702,
    lng: 77.5930,
    elevation: '915m ASL',
    status: 'Active',
    meters: [
      {
        id: 'MTR-401',
        name: 'DG Set 1 (1500 kVA) HT Alternator',
        type: 'HT',
        subType: 'Emergency Diesel HT',
        htHours: 124.5,
        ltHours: 0,
        htEnergyKwh: 48500,
        ltEnergyKwh: 0,
        powerFactor: 0.91,
        status: 'Standby',
        loadPercentage: 0,
        lastReadingTime: '10 mins ago'
      },
      {
        id: 'MTR-402',
        name: 'DG Set 2 (1000 kVA) HT Alternator',
        type: 'HT',
        subType: 'Emergency Diesel HT',
        htHours: 98.0,
        ltHours: 0,
        htEnergyKwh: 36200,
        ltEnergyKwh: 0,
        powerFactor: 0.90,
        status: 'Standby',
        loadPercentage: 0,
        lastReadingTime: '10 mins ago'
      },
      {
        id: 'MTR-403',
        name: 'Essential Services LT AMF Panel',
        type: 'LT',
        subType: 'Auto Mains Failure LT',
        htHours: 0,
        ltHours: 720.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 14800,
        powerFactor: 0.94,
        status: 'Active',
        loadPercentage: 54,
        lastReadingTime: 'Just now'
      }
    ]
  },
  {
    id: 'HUB-005',
    name: 'Facility Utilities & HVAC Sub-Panel',
    location: 'Basement Level 2 - Utility Tunnel B',
    building: 'Administration & Utility Tower',
    zone: 'Zone-4 (Low Voltage Utilities)',
    lat: 12.9725,
    lng: 77.5955,
    elevation: '908m ASL',
    status: 'Active',
    meters: [
      {
        id: 'MTR-501',
        name: 'HVAC Cooling Tower Pumps LT-1',
        type: 'LT',
        subType: 'Cooling Loop LT',
        htHours: 0,
        ltHours: 672.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 24600,
        powerFactor: 0.92,
        status: 'Active',
        loadPercentage: 76,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-502',
        name: 'Admin Building Lighting & Server UPS',
        type: 'LT',
        subType: 'Commercial Critical LT',
        htHours: 0,
        ltHours: 720.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 18900,
        powerFactor: 0.98,
        status: 'Active',
        loadPercentage: 62,
        lastReadingTime: 'Just now'
      },
      {
        id: 'MTR-503',
        name: 'Effluent Treatment Plant (ETP) LT-1',
        type: 'LT',
        subType: 'Waste Water Treatment LT',
        htHours: 0,
        ltHours: 668.0,
        htEnergyKwh: 0,
        ltEnergyKwh: 15800,
        powerFactor: 0.89,
        status: 'Active',
        loadPercentage: 58,
        lastReadingTime: 'Just now'
      }
    ]
  }
];

export function HubReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHubFilter, setSelectedHubFilter] = useState('ALL');
  const [meterTypeFilter, setMeterTypeFilter] = useState<'ALL' | 'HT' | 'LT'>('ALL');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedGeoHub, setSelectedGeoHub] = useState<HubReportGroup | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Trigger simulated real-time data sync
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filtered dataset
  const filteredHubs = useMemo(() => {
    return INITIAL_HUB_DATA.map((hub) => {
      if (selectedHubFilter !== 'ALL' && hub.id !== selectedHubFilter) {
        return null;
      }

      const searchLower = searchTerm.toLowerCase().trim();
      const hubMatches =
        hub.id.toLowerCase().includes(searchLower) ||
        hub.name.toLowerCase().includes(searchLower) ||
        hub.location.toLowerCase().includes(searchLower) ||
        hub.building.toLowerCase().includes(searchLower) ||
        hub.zone.toLowerCase().includes(searchLower) ||
        hub.lat.toString().includes(searchLower) ||
        hub.lng.toString().includes(searchLower);

      const matchingMeters = hub.meters.filter((meter) => {
        if (meterTypeFilter !== 'ALL' && meter.type !== meterTypeFilter) {
          return false;
        }

        if (!searchTerm) return true;

        const meterMatches =
          meter.id.toLowerCase().includes(searchLower) ||
          meter.name.toLowerCase().includes(searchLower) ||
          meter.subType.toLowerCase().includes(searchLower);

        return hubMatches || meterMatches;
      });

      if (!searchTerm && selectedHubFilter === 'ALL' && meterTypeFilter === 'ALL') {
        return hub;
      }

      if (hubMatches && matchingMeters.length === 0 && meterTypeFilter === 'ALL') {
        return hub;
      }

      if (matchingMeters.length > 0) {
        return {
          ...hub,
          meters: matchingMeters
        };
      }

      return null;
    }).filter(Boolean) as HubReportGroup[];
  }, [searchTerm, selectedHubFilter, meterTypeFilter]);

  // High-density aggregate report stats
  const reportStats = useMemo(() => {
    let totalHubs = filteredHubs.length;
    let totalMeters = 0;
    let totalHtHours = 0;
    let totalLtHours = 0;
    let totalHtEnergy = 0;
    let totalLtEnergy = 0;

    filteredHubs.forEach((hub) => {
      hub.meters.forEach((meter) => {
        totalMeters += 1;
        totalHtHours += meter.htHours;
        totalLtHours += meter.ltHours;
        totalHtEnergy += meter.htEnergyKwh;
        totalLtEnergy += meter.ltEnergyKwh;
      });
    });

    const totalEnergy = totalHtEnergy + totalLtEnergy;

    return {
      totalHubs,
      totalMeters,
      totalHtHours: totalHtHours.toFixed(1),
      totalLtHours: totalLtHours.toFixed(1),
      totalEnergyMwh: (totalEnergy / 1000).toFixed(2)
    };
  }, [filteredHubs]);

  // Copy GPS Coordinates to Clipboard
  const handleCopyCoordinates = (hub: HubReportGroup) => {
    const text = `${hub.lat}, ${hub.lng}`;
    navigator.clipboard.writeText(text);
    setCopiedId(hub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // CSV Export Function
  const exportToCSV = () => {
    const headers = [
      'Hub ID',
      'Hub Name',
      'Location',
      'Building / Zone',
      'Latitude',
      'Longitude',
      'Meter ID',
      'Meter Name',
      'Tension Type',
      'HT Hours',
      'LT Hours',
      'HT Energy (kWh)',
      'LT Energy (kWh)',
      'Power Factor',
      'Load %',
      'Meter Status'
    ];

    const rows: string[][] = [];

    filteredHubs.forEach((hub) => {
      hub.meters.forEach((meter) => {
        rows.push([
          `"${hub.id}"`,
          `"${hub.name}"`,
          `"${hub.location}"`,
          `"${hub.building} (${hub.zone})"`,
          `"${hub.lat}"`,
          `"${hub.lng}"`,
          `"${meter.id}"`,
          `"${meter.name}"`,
          `"${meter.type}"`,
          `"${meter.htHours}"`,
          `"${meter.ltHours}"`,
          `"${meter.htEnergyKwh}"`,
          `"${meter.ltEnergyKwh}"`,
          `"${meter.powerFactor}"`,
          `"${meter.loadPercentage}%"`,
          `"${meter.status}"`
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAB_Energy_Hub_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1700px] mx-auto print:p-0 print:m-0 font-sans">
      {/* Print-Only Official Document Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">SAB-ENERGY INDUSTRIAL TELEMETRY</h1>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Facility Hub Energy &amp; Operating Hours Matrix Report</p>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-600 space-y-0.5">
            <p>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            <p>Period: {dateRange.toUpperCase()} • Active Facility Hubs</p>
          </div>
        </div>
      </div>

      {/* 1. Minimalist Executive Stat Strip (Flat, High-Density, Compact) */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border bg-card rounded-lg border border-border shadow-2xs overflow-hidden print:grid-cols-5 print:divide-x print:border-slate-400">
        <div className="p-3 sm:p-3.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Building2 size={13} className="text-indigo-500 shrink-0" />
            <span>Hubs Monitored</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground tabular-nums">{reportStats.totalHubs}</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">100% Online</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <Cpu size={13} className="text-blue-500 shrink-0" />
            <span>Active Meters</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground tabular-nums">{reportStats.totalMeters}</span>
            <span className="text-[11px] font-medium text-muted-foreground">HT &amp; LT Feeders</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <Zap size={13} className="shrink-0" />
            <span>HT Run Hours</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-foreground tabular-nums">{reportStats.totalHtHours}</span>
            <span className="text-xs text-muted-foreground font-medium">hrs</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Clock size={13} className="shrink-0" />
            <span>LT Run Hours</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-foreground tabular-nums">{reportStats.totalLtHours}</span>
            <span className="text-xs text-muted-foreground font-medium">hrs</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Activity size={13} className="shrink-0" />
            <span>Total Energy</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-foreground tabular-nums font-mono">{reportStats.totalEnergyMwh}</span>
            <span className="text-xs text-muted-foreground font-medium">MWh</span>
          </div>
        </div>
      </div>

      {/* 2. Compact Minimalist Filter & Action Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card p-2.5 rounded-lg border border-border shadow-2xs print:hidden">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Hub ID, name, location, coordinates, meter ID..."
            className="w-full pl-8 pr-8 py-1.5 bg-background border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hub dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded px-2.5 py-1 text-xs">
            <label className="text-muted-foreground font-medium text-[11px]">Hub:</label>
            <select
              value={selectedHubFilter}
              onChange={(e) => setSelectedHubFilter(e.target.value)}
              className="bg-transparent text-foreground font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-card text-foreground">All Hubs (5)</option>
              {INITIAL_HUB_DATA.map((h) => (
                <option key={h.id} value={h.id} className="bg-card text-foreground">
                  {h.id} - {h.name.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>

          {/* Tension dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded px-2.5 py-1 text-xs">
            <label className="text-muted-foreground font-medium text-[11px]">Type:</label>
            <select
              value={meterTypeFilter}
              onChange={(e) => setMeterTypeFilter(e.target.value as any)}
              className="bg-transparent text-foreground font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-card text-foreground">All Types</option>
              <option value="HT" className="bg-card text-foreground">HT Tension Only</option>
              <option value="LT" className="bg-card text-foreground">LT Tension Only</option>
            </select>
          </div>

          {/* Period selector */}
          <div className="flex bg-muted/60 p-0.5 rounded border border-border text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7D' },
              { id: '30d', label: 'Month' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as any)}
                className={cn(
                  'px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors',
                  dateRange === tab.id
                    ? 'bg-card text-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block"></div>

          {/* Action buttons */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2.5 py-1 bg-background hover:bg-muted border border-border rounded text-xs font-medium text-foreground transition-colors"
            title="Sync Data"
          >
            <RefreshCw size={12} className={cn(isRefreshing && 'animate-spin text-indigo-600')} />
            <span>Sync</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 bg-background hover:bg-muted border border-border rounded text-xs font-medium text-foreground transition-colors"
            title="Print Report"
          >
            <Printer size={12} />
            <span>Print</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors shadow-2xs"
            title="Export CSV Spreadsheet"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 3. Minimalist Executive Spreadsheet Matrix Table */}
      <div className="bg-card rounded-lg border border-border shadow-2xs overflow-hidden print:shadow-none print:border-slate-400 print:rounded-none print:overflow-visible">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left text-xs border-collapse border border-border">
            {/* Table Column Headers */}
            <thead>
              <tr className="bg-muted/70 text-muted-foreground font-bold border-b-2 border-border uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3 w-[330px] border-r border-border text-left">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Hub &amp; Geolocation</span>
                  </div>
                </th>
                <th className="px-5 py-3 min-w-[320px] border-r border-border text-left">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Meters Belonging to Hub</span>
                  </div>
                </th>
                <th className="px-5 py-3 w-[180px] border-r border-border text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Zap size={14} className="text-rose-600 dark:text-rose-400" />
                    <span>HT Hours</span>
                  </div>
                </th>
                <th className="px-5 py-3 w-[180px] border-r border-border text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span>LT Hours</span>
                  </div>
                </th>
                <th className="px-5 py-3 w-[170px] border-r border-border text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Gauge size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Performance / Load</span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body with Row-Spanned Hubs and Clean Flat Rows */}
            <tbody className="divide-y divide-border">
              {filteredHubs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle size={32} className="text-amber-500" />
                      <p className="font-semibold text-sm text-foreground">No matching Hubs or Meters found</p>
                      <p className="text-xs">Adjust the search filter or reset dropdowns above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHubs.map((hub, hIdx) => {
                  const theme = HUB_COLOR_THEMES[hIdx % 3];
                  const hubTotalHtHours = hub.meters.reduce((acc, m) => acc + m.htHours, 0);
                  const hubTotalLtHours = hub.meters.reduce((acc, m) => acc + m.ltHours, 0);
                  const hubTotalHtEnergy = hub.meters.reduce((acc, m) => acc + m.htEnergyKwh, 0);
                  const hubTotalLtEnergy = hub.meters.reduce((acc, m) => acc + m.ltEnergyKwh, 0);
                  const hubTotalEnergy = hubTotalHtEnergy + hubTotalLtEnergy;

                  if (hub.meters.length === 0) {
                    return (
                      <tr key={hub.id} className="border-b-[3px] border-b-slate-800 dark:border-b-slate-400">
                        <td className={cn("px-5 py-4 align-top border-r border-border text-left", theme.borderLeft)}>
                          <div className="space-y-1">
                            <span className={cn("font-mono font-bold text-xs px-2 py-0.5 rounded border", theme.idBadge)}>
                              {hub.id}
                            </span>
                            <h4 className="font-bold text-foreground text-xs">{hub.name}</h4>
                            <p className="text-[11px] text-muted-foreground">{hub.location}</p>
                          </div>
                        </td>
                        <td colSpan={4} className="px-5 py-4 text-center text-xs text-muted-foreground italic">
                          No active meters matching filter
                        </td>
                      </tr>
                    );
                  }

                  // Total rows spanned: meters + 1 for Hub Subtotal row
                  const totalRowSpan = hub.meters.length + 1;

                  return (
                    <React.Fragment key={hub.id}>
                      {hub.meters.map((meter, mIdx) => (
                        <tr
                          key={meter.id}
                          className="hover:bg-muted/30 transition-colors border-b border-border/70"
                        >
                          {/* Column 1: Hub & Geolocation (Spanned across all meters of this Hub + Subtotal row) */}
                          {mIdx === 0 && (
                            <td
                              rowSpan={totalRowSpan}
                              className={cn(
                                "px-5 py-4 align-top border-r border-border border-b-[3px] border-b-slate-800 dark:border-b-slate-400 text-left bg-card",
                                theme.borderLeft
                              )}
                            >
                              <div className="space-y-2.5 sticky top-3">
                                {/* Hub ID & Badges */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={cn("font-mono font-bold text-xs px-2 py-0.5 rounded border", theme.idBadge)}>
                                    {hub.id}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    {hub.status}
                                  </span>
                                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
                                    {hub.meters.length} Meters
                                  </span>
                                </div>

                                {/* Hub Name & Facility info */}
                                <div>
                                  <h4 className="font-bold text-foreground text-xs leading-snug">
                                    {hub.name}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {hub.building} • {hub.zone}
                                  </p>
                                </div>

                                {/* Physical Location Pill */}
                                <div className="p-2 rounded bg-muted/30 border border-border/60">
                                  <div className="flex items-start gap-1.5 text-[11px] text-foreground font-medium">
                                    <MapPin size={13} className={cn("shrink-0 mt-0.5", theme.gpsIcon)} />
                                    <span className="leading-tight">{hub.location}</span>
                                  </div>
                                </div>

                                {/* Geolocation Coordinates & Interactive Action */}
                                <div className="space-y-1 pt-0.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                    GPS Geolocation
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => setSelectedGeoHub(hub)}
                                      className="flex-1 inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-semibold bg-background hover:bg-muted text-foreground border border-border transition-colors shadow-2xs"
                                      title="Click to view interactive GIS map"
                                    >
                                      <Navigation size={11} className={theme.gpsIcon} />
                                      <span>
                                        {hub.lat.toFixed(4)}°, {hub.lng.toFixed(4)}°
                                      </span>
                                    </button>

                                    <button
                                      onClick={() => handleCopyCoordinates(hub)}
                                      className="p-1 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded border border-border transition-colors shrink-0"
                                      title="Copy Coordinates"
                                    >
                                      {copiedId === hub.id ? (
                                        <Check size={12} className="text-emerald-500" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}

                          {/* Column 2: Meters Belonging to Hub */}
                          <td className="px-5 py-3 border-r border-border text-left">
                            <div className="space-y-1">
                              {/* Top line: Meter ID + Tension Type + Meter Name */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-xs text-foreground bg-muted/70 px-1.5 py-0.5 rounded border border-border/60">
                                  {meter.id}
                                </span>
                                <span
                                  className={cn(
                                    'px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border',
                                    meter.type === 'HT'
                                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                  )}
                                >
                                  {meter.type}
                                </span>
                                <span className="text-foreground font-semibold text-xs">{meter.name}</span>
                              </div>

                              {/* Sub line: Power factor & live state */}
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span>PF: <strong className="text-foreground font-medium">{meter.powerFactor.toFixed(2)}</strong></span>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                  <CheckCircle2 size={11} /> {meter.status}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Column 3: HT Hours */}
                          <td className="px-5 py-3 border-r border-border text-center">
                            {meter.htHours > 0 ? (
                              <div className="flex flex-col items-center justify-center space-y-0.5">
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                                    {meter.htHours.toFixed(1)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-medium">hrs</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground font-mono">
                                  {meter.htEnergyKwh.toLocaleString()} kWh
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/30 font-mono text-xs select-none">—</span>
                            )}
                          </td>

                          {/* Column 4: LT Hours */}
                          <td className="px-5 py-3 border-r border-border text-center">
                            {meter.ltHours > 0 ? (
                              <div className="flex flex-col items-center justify-center space-y-0.5">
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                    {meter.ltHours.toFixed(1)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-medium">hrs</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground font-mono">
                                  {meter.ltEnergyKwh.toLocaleString()} kWh
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/30 font-mono text-xs select-none">—</span>
                            )}
                          </td>

                          {/* Column 5: Performance / Load */}
                          <td className="px-5 py-3 text-center">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <div className="flex items-center justify-center gap-1 font-bold text-xs text-foreground">
                                <Gauge size={12} className="text-muted-foreground" />
                                <span className="tabular-nums">{meter.loadPercentage}%</span>
                                <span className="text-muted-foreground font-normal text-[10px]">Load</span>
                              </div>
                              <div className="w-20 bg-muted rounded-full h-1 overflow-hidden border border-border/40">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    meter.loadPercentage > 85
                                      ? 'bg-amber-500'
                                      : meter.type === 'HT'
                                      ? 'bg-rose-500'
                                      : 'bg-indigo-600'
                                  )}
                                  style={{ width: `${meter.loadPercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Hub Subtotal Row with Dark Bottom Border dividing each Hub */}
                      <tr className="bg-muted/40 font-semibold text-xs border-b-[3px] border-b-slate-800 dark:border-b-slate-400">
                        {/* (Col 1 is spanned by Hub cell above) */}
                        <td className="px-5 py-2.5 border-r border-border border-b-[3px] border-b-slate-800 dark:border-b-slate-400 text-left">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                                {hub.id} Subtotal
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                ({hub.meters.length} Meters)
                              </span>
                            </div>
                            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border shadow-2xs">
                              {(hubTotalEnergy / 1000).toFixed(1)} MWh
                            </span>
                          </div>
                        </td>

                        {/* Subtotal HT Hours */}
                        <td className="px-5 py-2.5 border-r border-border border-b-[3px] border-b-slate-800 dark:border-b-slate-400 text-center">
                          {hubTotalHtHours > 0 ? (
                            <div className="flex items-baseline justify-center gap-1 text-rose-600 dark:text-rose-400 font-extrabold text-xs tabular-nums">
                              <span>{hubTotalHtHours.toFixed(1)}</span>
                              <span className="text-[10px] font-medium text-muted-foreground">HT hrs</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono text-xs select-none">—</span>
                          )}
                        </td>

                        {/* Subtotal LT Hours */}
                        <td className="px-5 py-2.5 border-r border-border border-b-[3px] border-b-slate-800 dark:border-b-slate-400 text-center">
                          {hubTotalLtHours > 0 ? (
                            <div className="flex items-baseline justify-center gap-1 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs tabular-nums">
                              <span>{hubTotalLtHours.toFixed(1)}</span>
                              <span className="text-[10px] font-medium text-muted-foreground">LT hrs</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono text-xs select-none">—</span>
                          )}
                        </td>

                        {/* Subtotal Status */}
                        <td className="px-5 py-2.5 text-center border-b-[3px] border-b-slate-800 dark:border-b-slate-400 font-bold text-foreground text-xs">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 size={11} />
                            <span>Operational</span>
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* Grand Totals Table Footer */}
            {filteredHubs.length > 0 && (
              <tfoot className="bg-muted/80 text-foreground font-bold text-xs border-t-2 border-border">
                <tr>
                  <td className="px-5 py-3.5 border-r border-border text-left">
                    <div className="space-y-0.5">
                      <span className="uppercase tracking-wider font-extrabold text-xs text-foreground block">
                        Grand Total ({reportStats.totalHubs} Hubs)
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        {reportStats.totalMeters} Connected Meters
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 border-r border-border text-left font-medium text-xs text-muted-foreground">
                    Facility Total Energy: <strong className="text-foreground font-bold font-mono">{reportStats.totalEnergyMwh} MWh</strong>
                  </td>
                  <td className="px-5 py-3.5 border-r border-border text-center text-rose-600 dark:text-rose-400 text-sm font-extrabold">
                    <div className="flex items-baseline justify-center gap-1 tabular-nums">
                      <span>{reportStats.totalHtHours}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">HT hrs</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 border-r border-border text-center text-indigo-600 dark:text-indigo-400 text-sm font-extrabold">
                    <div className="flex items-baseline justify-center gap-1 tabular-nums">
                      <span>{reportStats.totalLtHours}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">LT hrs</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    <div className="flex items-center justify-center gap-1.5 font-mono">
                      <Gauge size={13} />
                      <span>{reportStats.totalEnergyMwh} MWh</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Geolocation Interactive GIS Flyout Modal */}
      {selectedGeoHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 print:hidden">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <MapPin size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm leading-tight">
                    {selectedGeoHub.name} ({selectedGeoHub.id})
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Hub Geolocation &amp; GIS Telemetry</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGeoHub(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Radar Simulation */}
              <div className="relative h-36 rounded-lg bg-slate-900 border border-border overflow-hidden flex items-center justify-center p-4">
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#6366f1" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <circle cx="50%" cy="50%" r="48" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50%" cy="50%" r="80" fill="none" stroke="#6366f1" strokeWidth="0.5" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60"></span>
                    <div className="relative inline-flex items-center justify-center rounded-full h-7 w-7 bg-indigo-600 text-white shadow-md">
                      <Zap size={14} />
                    </div>
                  </div>
                  <div className="mt-2 px-2.5 py-0.5 bg-slate-800/90 rounded border border-slate-700 text-xs text-white font-mono font-bold">
                    {selectedGeoHub.lat.toFixed(4)}° N, {selectedGeoHub.lng.toFixed(4)}° E
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                  SAB Plant GIS: {selectedGeoHub.elevation}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Location</span>
                  <p className="font-bold text-foreground text-[11px]">{selectedGeoHub.location}</p>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Facility Zone</span>
                  <p className="font-bold text-foreground text-[11px]">{selectedGeoHub.building}</p>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Coordinates</span>
                  <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                    {selectedGeoHub.lat}, {selectedGeoHub.lng}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Connected Meters</span>
                  <p className="font-bold text-foreground text-[11px]">{selectedGeoHub.meters.length} Active Feeder Meters</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-border flex items-center justify-between bg-muted/30">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedGeoHub.lat},${selectedGeoHub.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ExternalLink size={13} />
                <span>Open in Satellite Maps</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCoordinates(selectedGeoHub)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-card border border-border rounded text-foreground hover:bg-muted transition-colors"
                >
                  {copiedId === selectedGeoHub.id ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Coordinates</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedGeoHub(null)}
                  className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
