import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  ArrowRight,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Droplets,
  Calendar,
  Compass,
  FileWarning,
  Eye,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import StationMap from '../components/StationMap';

const CITY_PROFILES = {
  Hyderabad: {
    name: 'Hyderabad',
    state: 'Telangana',
    aqi: 58,
    status: 'Satisfactory',
    badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotCls: 'bg-emerald-400',
    summary: 'Air is clean and comfortable right now. Great day for outdoor activities.',
    outdoorAdvice: 'Great for walks, runs, and outdoor sports.',
    windowAdvice: 'Safe to open windows and let fresh air circulate.',
    maskAdvice: 'No mask required for general public.',
    waterName: 'Hussain Sagar Lake',
    waterScore: '88 WQI · Clean',
    waterCls: 'text-sky-400',
    pm25: '18.4 µg/m³',
    pm10: '42.0 µg/m³',
    coords: [17.385, 78.486]
  },
  Bangalore: {
    name: 'Bangalore',
    state: 'Karnataka',
    aqi: 42,
    status: 'Good',
    badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotCls: 'bg-emerald-400',
    summary: 'Fresh, crisp air across central parks and tech corridors.',
    outdoorAdvice: 'Ideal conditions for all outdoor workouts.',
    windowAdvice: 'Enjoy natural ventilation throughout the day.',
    maskAdvice: 'No mask needed outdoors.',
    waterName: 'Ulsoor Lake Basin',
    waterScore: '82 WQI · Good',
    waterCls: 'text-sky-400',
    pm25: '12.1 µg/m³',
    pm10: '28.5 µg/m³',
    coords: [12.971, 77.594]
  },
  Delhi: {
    name: 'Delhi NCR',
    state: 'National Capital Region',
    aqi: 138,
    status: 'Unhealthy for Sensitive Groups',
    badgeCls: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotCls: 'bg-amber-400',
    summary: 'Elevated particulate dust. Children and seniors should limit heavy outdoor exertion.',
    outdoorAdvice: 'Shift intensive workouts indoors until evening.',
    windowAdvice: 'Keep windows shut during peak traffic hours.',
    maskAdvice: 'Consider an N95 mask if outdoors near major roads.',
    waterName: 'Yamuna River Corridor',
    waterScore: '54 WQI · Monitored',
    waterCls: 'text-amber-400',
    pm25: '58.2 µg/m³',
    pm10: '124.0 µg/m³',
    coords: [28.613, 77.209]
  },
  Mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    aqi: 68,
    status: 'Moderate',
    badgeCls: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotCls: 'bg-amber-400',
    summary: 'Moderate air with sea breeze moderating inland traffic haze.',
    outdoorAdvice: 'Acceptable for walks and jogging along coastal promenades.',
    windowAdvice: 'Safe to open windows, especially in morning hours.',
    maskAdvice: 'Not needed for healthy individuals.',
    waterName: 'Powai Lake Catchment',
    waterScore: '78 WQI · Good',
    waterCls: 'text-sky-400',
    pm25: '24.8 µg/m³',
    pm10: '56.2 µg/m³',
    coords: [19.076, 72.877]
  },
  Chennai: {
    name: 'Chennai',
    state: 'Tamil Nadu',
    aqi: 46,
    status: 'Good',
    badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotCls: 'bg-emerald-400',
    summary: 'Coastal sea breeze keeps air clear and particulate matter low.',
    outdoorAdvice: 'Safe for all outdoor activities and sports.',
    windowAdvice: 'Open windows freely for natural coastal ventilation.',
    maskAdvice: 'No mask required.',
    waterName: 'Chetpet Lake Reservoir',
    waterScore: '85 WQI · Clean',
    waterCls: 'text-sky-400',
    pm25: '14.5 µg/m³',
    pm10: '31.0 µg/m³',
    coords: [13.082, 80.270]
  }
};

const WEEKLY_OUTLOOK = [
  { day: 'Today', date: 'Mon', aqi: '58', status: 'Satisfactory', color: 'text-emerald-400', dot: 'bg-emerald-400', note: 'Clear & sunny' },
  { day: 'Tomorrow', date: 'Tue', aqi: '64', status: 'Moderate', color: 'text-amber-400', dot: 'bg-amber-400', note: 'Evening rush haze' },
  { day: 'Wednesday', date: 'Wed', aqi: '72', status: 'Moderate', color: 'text-amber-400', dot: 'bg-amber-400', note: 'Mild dust buildup' },
  { day: 'Thursday', date: 'Thu', aqi: '48', status: 'Good', color: 'text-emerald-400', dot: 'bg-emerald-400', note: 'Light rain clears air' },
  { day: 'Friday', date: 'Fri', aqi: '61', status: 'Moderate', color: 'text-amber-400', dot: 'bg-amber-400', note: 'Normal urban traffic' },
  { day: 'Saturday', date: 'Sat', aqi: '44', status: 'Good', color: 'text-emerald-400', dot: 'bg-emerald-400', note: 'Crisp weekend breeze' }
];

export default function LandingPage({ stations = [], onNavigateToConsole }) {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ScrollCraft) {
      const sc = window.ScrollCraft.mount();
      return () => {
        if (sc && sc.destroy) sc.destroy();
      };
    }
  }, []);

  const currentProfile = CITY_PROFILES[selectedCity] || CITY_PROFILES.Hyderabad;

  // Filter stations based on search query or selected city
  const filteredStations = stations.filter(s => {
    if (searchQuery) {
      return (
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.location_name && s.location_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const displayStations = filteredStations.length > 0 ? filteredStations.slice(0, 35) : stations.slice(0, 35);

  return (
    <div className="bg-[#09090B] text-zinc-100 font-sans min-h-screen flex flex-col antialiased">

      {/* 1. HERO SECTION WITH INSTANT "DRUNK-PROOF" AIR QUALITY CHECKER */}
      <section data-sc-act="flow" className="pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-[#27272A] bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Simple Direct Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181B] border border-[#27272A] text-xs text-zinc-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Live Sensor Network · 133 stations reporting across India</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              How is the air in your city right now?
            </h1>
            <p className="mt-3 text-base sm:text-lg text-zinc-300 leading-relaxed">
              Real-time pollution numbers, plain-English outdoor advice, and clean commute routes — without confusing technical jargon.
            </p>
          </div>

          {/* City Selection Tabs (Big, Touch-Friendly, Obvious) */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
              Select City:
            </span>
            {Object.keys(CITY_PROFILES).map((cityName) => {
              const isSelected = selectedCity === cityName;
              return (
                <button
                  key={cityName}
                  onClick={() => setSelectedCity(cityName)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white/20'
                      : 'bg-[#18181B] text-zinc-300 hover:text-white hover:bg-zinc-800 border border-[#27272A]'
                  }`}
                >
                  {cityName}
                </button>
              );
            })}
          </div>

          {/* THE DRUNK-PROOF CENTERPIECE (Flat, non-nested hierarchy) */}
          <div className="mt-6 border-t border-b border-[#27272A] py-6 sm:py-8 space-y-6">
            
            {/* Top row: City Name, Status Badge & Big AQI Number */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
              <div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {currentProfile.name}
                  </h2>
                  <span className="text-xs text-zinc-400 font-medium">({currentProfile.state})</span>
                </div>
                <p className="text-sm text-zinc-300 mt-1 max-w-xl">
                  {currentProfile.summary}
                </p>
              </div>

              {/* Big Visual Gauge / Score */}
              <div className="flex items-center gap-4 bg-[#121215] border border-[#27272A] px-5 py-3 rounded-xl self-start md:self-auto">
                <div>
                  <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    Air Quality Index
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                      {currentProfile.aqi}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">AQI</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${currentProfile.badgeCls}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${currentProfile.dotCls}`}></span>
                  <span>{currentProfile.status}</span>
                </div>
              </div>
            </div>

            {/* 4 Plain-English "Can I do this right now?" Practical Checks */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Immediate Health &amp; Activity Advice
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Outdoor activity */}
                <div className="border-l-2 border-emerald-500 pl-3 py-1">
                  <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Outdoor Exercise</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {currentProfile.outdoorAdvice}
                  </div>
                </div>

                {/* 2. Ventilation */}
                <div className="border-l-2 border-emerald-500 pl-3 py-1">
                  <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Home Windows</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {currentProfile.windowAdvice}
                  </div>
                </div>

                {/* 3. Masks */}
                <div className="border-l-2 border-zinc-500 pl-3 py-1">
                  <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-zinc-300" />
                    <span>Face Masks</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {currentProfile.maskAdvice}
                  </div>
                </div>

                {/* 4. Local Water */}
                <div className="border-l-2 border-sky-500 pl-3 py-1">
                  <div className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span>Nearby Water Body</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {currentProfile.waterName}
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${currentProfile.waterCls}`}>
                    {currentProfile.waterScore}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick action buttons right inside the hero */}
            <div className="pt-4 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-zinc-300">
                <span>Fine Dust (PM2.5): <strong className="text-white font-mono">{currentProfile.pm25}</strong></span>
                <span>Coarse Dust (PM10): <strong className="text-white font-mono">{currentProfile.pm10}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigateToConsole && onNavigateToConsole('map')}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs tracking-tight transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Explore Live Map</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                </button>
                <button
                  onClick={() => onNavigateToConsole && onNavigateToConsole('analytics')}
                  className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-[#27272A] transition-colors"
                >
                  See 7-Day Forecast
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. 5-DAY AIR OUTLOOK STRIP (Human, Weather-App Style) */}
      <section data-sc-act="flow" className="bg-[#121215] border-b border-[#27272A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Upcoming 6-Day Air Quality Outlook ({selectedCity})
              </span>
            </div>
            <button
              onClick={() => onNavigateToConsole && onNavigateToConsole('analytics')}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
            >
              View detailed charts &amp; anomalies →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {WEEKLY_OUTLOOK.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#09090B] border border-[#27272A] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">{item.day}</span>
                  <span className="text-zinc-400 text-xs">{item.date}</span>
                </div>
                <div className="my-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-white font-mono">{item.aqi}</span>
                    <span className="text-xs text-zinc-400">AQI</span>
                  </div>
                  <div className={`text-xs font-semibold flex items-center gap-1.5 mt-0.5 ${item.color}`}>
                    <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                    <span>{item.status}</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 border-t border-[#27272A] pt-2 mt-1">
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 4 BIG TANGIBLE ACTION DOORS (Side-by-side headings, no icon tile stack) */}
      <section data-sc-act="flow" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What do you want to do today?
          </h2>
          <p className="text-sm text-zinc-300 mt-2">
            No complex dashboards or confusing controls. Tap any action below to get right to what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Live Map */}
          <div
            onClick={() => onNavigateToConsole && onNavigateToConsole('map')}
            className="group cursor-pointer p-5 bg-[#121215] hover:bg-[#18181B] border border-[#27272A] hover:border-zinc-500 rounded-xl transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Explore Live Map
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                See all 133 stations on a full-screen interactive map. Color-coded green for clean air, red for heavy smog.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>Open live map</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Forecasts */}
          <div
            onClick={() => onNavigateToConsole && onNavigateToConsole('analytics')}
            className="group cursor-pointer p-5 bg-[#121215] hover:bg-[#18181B] border border-[#27272A] hover:border-zinc-500 rounded-xl transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  7-Day Forecasts
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Will it smog tomorrow? See predictions for air and water health to plan outdoor workouts or travel.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-sky-400 gap-1">
              <span>Check forecasts</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: Clean Commute */}
          <div
            onClick={() => onNavigateToConsole && onNavigateToConsole('optimization')}
            className="group cursor-pointer p-5 bg-[#121215] hover:bg-[#18181B] border border-[#27272A] hover:border-zinc-500 rounded-xl transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Compass className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Clean Commute Planner
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Find driving or walking routes that bypass toxic congestion zones, cutting your exhaust exposure by up to 25%.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-amber-400 gap-1">
              <span>Plan cleaner route</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: Report Issue */}
          <div
            onClick={() => onNavigateToConsole && onNavigateToConsole('incidents')}
            className="group cursor-pointer p-5 bg-[#121215] hover:bg-[#18181B] border border-[#27272A] hover:border-zinc-500 rounded-xl transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <FileWarning className="w-5 h-5 text-rose-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                  Report Local Pollution
                </h3>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Smell burning plastic or spot dirty industrial water? Submit a 30-second observation for municipal review.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-rose-400 gap-1">
              <span>Report problem</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE MAP SECTION WITH QUICK-JUMP CHIPS */}
      <section data-sc-act="flow" className="py-10 bg-[#121215] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Live Sensor Map
              </h2>
              <p className="text-xs text-zinc-300 mt-1">
                Showing real stations across India. Click any pin to see exact particulate matter and water turbidity.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search neighborhood or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#09090B] border border-[#27272A] rounded-lg text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Map Container */}
          <div className="h-[440px] w-full rounded-xl overflow-hidden border border-[#27272A] relative bg-[#09090B]">
            <StationMap
              stations={displayStations}
              height="100%"
            />
          </div>

          {/* 4 Informative Metrics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-3.5">
              <div className="text-xs text-zinc-400">Total Stations</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">133 Active</div>
              <div className="text-xs text-zinc-400 mt-0.5">Continuous real-time sensors</div>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-3.5">
              <div className="text-xs text-zinc-400">Average Air Quality</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">64 AQI</div>
              <div className="text-xs text-zinc-400 mt-0.5">Moderate urban baseline</div>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-3.5">
              <div className="text-xs text-zinc-400">Average Water Quality</div>
              <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">78 WQI</div>
              <div className="text-xs text-zinc-400 mt-0.5">Healthy lake &amp; river basin</div>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-3.5">
              <div className="text-xs text-zinc-400">Coverage Zones</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">8 Major Cities</div>
              <div className="text-xs text-zinc-400 mt-0.5">Hyderabad, Bangalore &amp; more</div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. COMMUNITY REPORTING CALLOUT BANNER */}
      <section data-sc-act="flow" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
              <FileWarning className="w-3.5 h-3.5" />
              <span>Community Environmental Watch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Spot illegal burning or dirty industrial water?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Help keep our neighborhoods clean. Anyone can file a 30-second report with photo and GPS location. Verified reports are triaged directly to municipal monitoring teams.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigateToConsole && onNavigateToConsole('incidents')}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow transition-colors"
            >
              Report a Pollution Issue
            </button>
          </div>
        </div>
      </section>

      {/* 6. OPERATOR & RESEARCHER CONSOLE ACCESS (Clean, Distinct) */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="border border-[#27272A] rounded-xl p-5 sm:p-6 bg-[#09090B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Station Operators &amp; Environmental Researchers</span>
            </div>
            <p className="text-xs text-zinc-400">
              Authorized administrators can provision sensor nodes, calibrate telemetry, and inspect incident logs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!user ? (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-[#27272A] transition-colors"
              >
                Sign In to Console
              </button>
            ) : (
              <button
                onClick={() => onNavigateToConsole && onNavigateToConsole(isAdmin ? 'admin' : 'stations')}
                className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-[#27272A] transition-colors"
              >
                {isAdmin ? 'Open Admin Console' : 'Open Stations Directory'}
              </button>
            )}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium border border-[#27272A] transition-colors flex items-center gap-1.5"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
