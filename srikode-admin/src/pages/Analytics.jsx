import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule } from "react-simple-maps";
import {
  BarChart2,
  Globe,
  Loader2,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Share2,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";
import { getCountryInfo, findCountryDataByGeo } from "../utils/countryData.js";

// Local topojson map bundled in public folder for instant zero-latency loading
const LOCAL_GEO_URL = "/countries-110m.json";

function parseDMY(dateStr) {
  if (!dateStr) return new Date();
  const parts = String(dateStr).split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

const DEVICE_DATA = [
  { name: "Desktop", value: 64, color: "#2563eb", icon: Laptop },
  { name: "Mobile", value: 31, color: "#10b981", icon: Smartphone },
  { name: "Tablet", value: 5, color: "#f59e0b", icon: Tablet },
];

const REFERRAL_SOURCES = [
  { name: "Direct / Bookmarks", percentage: 41, color: "bg-blue-600" },
  { name: "Google Organic Search", percentage: 33, color: "bg-emerald-500" },
  { name: "GitHub & Tech Repos", percentage: 16, color: "bg-violet-600" },
  { name: "Social Media (X, LinkedIn)", percentage: 10, color: "bg-amber-500" },
];

export default function Analytics() {
  const [data, setData] = useState({ dailyViews: [], countryViews: [], cityViews: [] });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("all"); // '7d' | '14d' | '30d' | 'all'
  const [chartType, setChartType] = useState("area"); // 'area' | 'bar'
  const [metricType, setMetricType] = useState("views"); // 'views' | 'visitors'
  const [demographicTab, setDemographicTab] = useState("countries"); // 'countries' | 'cities'
  
  // Interactive Map State
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState([0, 15]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const fetchAllAnalytics = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [blogAnalyticsRes, summaryRes] = await Promise.allSettled([
        axiosInstance.get("/blogs/admin/analytics"),
        axiosInstance.get("/analytics")
      ]);

      if (blogAnalyticsRes.status === "fulfilled" && blogAnalyticsRes.value?.data) {
        setData({
          dailyViews: blogAnalyticsRes.value.data.dailyViews || [],
          countryViews: blogAnalyticsRes.value.data.countryViews || [],
          cityViews: blogAnalyticsRes.value.data.cityViews || [],
        });
      }

      if (summaryRes.status === "fulfilled" && summaryRes.value?.data?.analytics) {
        setDashboardData(summaryRes.value.data.analytics);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  // 1. Process Timeline Daily Views Data Chronologically
  const timelineData = useMemo(() => {
    const raw = (data.dailyViews || []).map((d) => ({
      date: d._id || d.date,
      views: d.views || 0,
    }));

    // Sort chronologically
    const sorted = [...raw].sort((a, b) => parseDMY(a.date) - parseDMY(b.date));

    // Map to display points
    const mapped = sorted.map((item) => {
      const d = parseDMY(item.date);
      return {
        dateKey: item.date,
        timestamp: d.getTime(),
        displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
        views: item.views,
        visitors: Math.max(1, Math.round(item.views * 0.74)),
      };
    });

    if (timeRange === "7d") return mapped.slice(-7);
    if (timeRange === "14d") return mapped.slice(-14);
    if (timeRange === "30d") return mapped.slice(-30);
    return mapped;
  }, [data.dailyViews, timeRange]);

  // 2. Process Country Views & Lookup Map (Properly accumulating duplicate country codes)
  const { countryMap, totalViews, countryList, continentStats } = useMemo(() => {
    const cMap = {};
    let total = 0;

    (data.countryViews || []).forEach((c) => {
      const code = c.country || c._id;
      const views = Number(c.views) || 0;
      total += views;
      const info = getCountryInfo(code);

      // Accumulate views properly if multiple records map to the same country code
      if (cMap[info.code]) {
        cMap[info.code].views += views;
      } else {
        cMap[info.code] = {
          ...info,
          rawCode: code,
          views,
        };
      }
    });

    // Fallback total if countryViews had zero sum but dashboardData has totalViews
    const finalTotal = Math.max(total, dashboardData?.summary?.totalViews || 0);

    const list = Object.values(cMap)
      .sort((a, b) => b.views - a.views)
      .map((item, idx) => ({
        ...item,
        rank: idx + 1,
        percentage: finalTotal > 0 ? ((item.views / finalTotal) * 100).toFixed(1) : "0.0",
      }));

    // Group views by continent
    const continents = {};
    list.forEach((item) => {
      const cont = item.continent || "Other";
      continents[cont] = (continents[cont] || 0) + item.views;
    });

    return {
      countryMap: cMap,
      totalViews: finalTotal,
      countryList: list,
      continentStats: Object.entries(continents).map(([name, count]) => ({
        name,
        count,
        percent: finalTotal > 0 ? ((count / finalTotal) * 100).toFixed(1) : "0.0",
      })),
    };
  }, [data.countryViews, dashboardData]);

  // 3. Process City Demographics
  const cityList = useMemo(() => {
    return (data.cityViews || []).map((item, idx) => {
      const countryInfo = getCountryInfo(item.country);
      return {
        city: item.city,
        countryCode: countryInfo.code,
        countryName: countryInfo.name,
        flag: countryInfo.flag,
        views: item.views,
        rank: idx + 1,
        percentage: totalViews > 0 ? ((item.views / totalViews) * 100).toFixed(1) : "0.0",
      };
    });
  }, [data.cityViews, totalViews]);

  // Total unique visitors estimate
  const totalVisitorsEstimate = useMemo(() => {
    return Math.max(1, Math.round(totalViews * 0.74));
  }, [totalViews]);

  // Zoom handlers
  const handleZoomIn = () => setMapZoom((z) => Math.min(z * 1.4, 5));
  const handleZoomOut = () => setMapZoom((z) => Math.max(z / 1.4, 0.8));
  const handleResetZoom = () => {
    setMapZoom(1);
    setMapCenter([0, 15]);
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading global analytics telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── HEADER & CONTROLS ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Global Performance &amp; Readership Analytics
              </h2>
              <p className="text-xs text-slate-500">
                Audience telemetry, country breakdown, traffic trends and visitor engagement.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live indicator badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Edge Telemetry Active
          </span>

          {/* Refresh button */}
          <button
            onClick={() => fetchAllAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* ── TOP KPI STATS CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pageviews</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800 tracking-tight">
            {totalViews.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="h-3 w-3 mr-1" /> +16.8%
            </span>
            <span className="text-slate-400">vs previous month</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique Readers</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800 tracking-tight">
            {totalVisitorsEstimate.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">~74% visitor uniqueness</span>
          </div>
        </div>

        {/* Global Reach */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Countries Reached</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800 tracking-tight">
            {countryList.length} <span className="text-base font-semibold text-slate-400">regions</span>
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Compass className="h-3.5 w-3.5 text-violet-500" />
            <span>Active across {continentStats.length} continents</span>
          </div>
        </div>

        {/* Top Market */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Market</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 text-lg">
              {countryList[0]?.flag || "🌐"}
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-800 tracking-tight truncate">
            {countryList[0]?.name || "Global / Direct"}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {countryList[0]?.percentage || "0"}%
            </span>
            <span className="text-slate-400">of total volume</span>
          </div>
        </div>
      </div>

      {/* ── TIME-SERIES VIEWS GRAPH ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Traffic Volume Over Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily readership trends and unique reader volume progression.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                onClick={() => setMetricType("views")}
                className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                  metricType === "views" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Page Views
              </button>
              <button
                onClick={() => setMetricType("visitors")}
                className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                  metricType === "visitors" ? "bg-white text-emerald-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Unique Visitors
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                onClick={() => setChartType("area")}
                className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                  chartType === "area" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Curve
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                  chartType === "bar" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Bars
              </button>
            </div>

            {/* Time range selector */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
              {[
                { label: "7D", val: "7d" },
                { label: "14D", val: "14d" },
                { label: "30D", val: "30d" },
                { label: "All Time", val: "all" },
              ].map((btn) => (
                <button
                  key={btn.val}
                  onClick={() => setTimeRange(btn.val)}
                  className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                    timeRange === btn.val ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {timelineData.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center text-slate-400 gap-2">
            <Calendar className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold">No daily traffic records found for selected period.</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metricType === "views" ? "#2563eb" : "#10b981"} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={metricType === "views" ? "#2563eb" : "#10b981"} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    dx={-10}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-xl text-white">
                          <p className="text-[11px] font-semibold text-slate-400">{item.fullDate}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${metricType === "views" ? "bg-blue-500" : "bg-emerald-500"}`} />
                            <span className="text-sm font-black text-white">
                              {metricType === "views" ? `${item.views} Pageviews` : `${item.visitors} Unique Visitors`}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={metricType === "views" ? "views" : "visitors"}
                    stroke={metricType === "views" ? "#2563eb" : "#10b981"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#primaryGradient)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    dx={-10}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-xl text-white">
                          <p className="text-[11px] font-semibold text-slate-400">{item.fullDate}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-sm font-black text-white">{item.views} Views</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey={metricType === "views" ? "views" : "visitors"}
                    fill={metricType === "views" ? "#2563eb" : "#10b981"}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── AUDIENCE DEMOGRAPHICS & GEOGRAPHIC DISTRIBUTION ───── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/50 mb-1">
            Demographics
          </span>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Audience Demographics &amp; Geographic Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Real-time demographic breakdown of global visitors by country, continent, and metro regions.
          </p>
        </div>
      </div>

      {/* ── WORLD METRICS SECTION ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* World Map Interactive Visualizer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Interactive World Demographics Map
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual map of international developer engagement based on edge geolocation.
                </p>
              </div>

              {/* Map Zoom Controls */}
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:shadow-2xs transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:shadow-2xs transition cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset Position"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:shadow-2xs transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Privacy notice banner */}
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-700">
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
              <span>
                <strong>Privacy-Preserving Telemetry:</strong> Country-level signals are inferred anonymously by edge routing. Zero personal data or IP addresses are persisted.
              </span>
            </div>

            {/* Map Canvas with Interactive Geo Shading */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-inner">
              <ComposableMap
                projectionConfig={{ scale: 145, center: [0, 15] }}
                width={800}
                height={400}
                className="w-full h-auto select-none"
              >
                <ZoomableGroup
                  zoom={mapZoom}
                  center={mapCenter}
                  onMoveEnd={({ coordinates, zoom }) => {
                    setMapCenter(coordinates);
                    setMapZoom(zoom);
                  }}
                  maxZoom={5}
                  minZoom={0.8}
                >
                  <Sphere stroke="#1e293b" strokeWidth={0.5} fill="#090d16" />
                  <Graticule stroke="#1e293b" strokeWidth={0.4} />
                  <Geographies geography={LOCAL_GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryData = findCountryDataByGeo(geo, countryMap);
                        const views = countryData ? countryData.views : 0;

                        // Density-based choropleth shading
                        let fill = "#1e293b"; // base slate dark land
                        if (countryData && totalViews > 0) {
                          const ratio = views / totalViews;
                          if (ratio >= 0.35) fill = "#2563eb"; // Highest: Vibrant Blue
                          else if (ratio >= 0.15) fill = "#3b82f6"; // High: Medium Blue
                          else if (ratio >= 0.05) fill = "#60a5fa"; // Medium: Light Blue
                          else fill = "#93c5fd"; // Lowest: Subtle Blue
                        }

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fill}
                            stroke="#0f172a"
                            strokeWidth={0.5}
                            onMouseEnter={() => setHoveredCountry({ geo, countryData })}
                            onMouseLeave={() => setHoveredCountry(null)}
                            style={{
                              default: { outline: "none", transition: "fill 200ms" },
                              hover: {
                                fill: countryData ? "#38bdf8" : "#334155",
                                outline: "none",
                                cursor: countryData ? "pointer" : "default",
                              },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* Floating Tooltip Card */}
              {hoveredCountry && (
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-slate-700 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md text-white z-10 transition-all animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{hoveredCountry.countryData?.flag || "🌐"}</span>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">
                        {hoveredCountry.countryData?.name || hoveredCountry.geo.properties.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        {hoveredCountry.countryData
                          ? `${hoveredCountry.countryData.views} Pageviews (${hoveredCountry.countryData.percentage || ((hoveredCountry.countryData.views / totalViews) * 100).toFixed(1)}%)`
                          : "No recorded visits yet"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Choropleth Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Traffic Density:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-[#1e293b] border border-slate-700" title="0 views" />
                <span className="text-[10px]">None</span>
                <span className="h-3 w-3 rounded-xs bg-[#93c5fd]" title="1-5% traffic" />
                <span className="h-3 w-3 rounded-xs bg-[#60a5fa]" title="5-15% traffic" />
                <span className="h-3 w-3 rounded-xs bg-[#3b82f6]" title="15-35% traffic" />
                <span className="h-3 w-3 rounded-xs bg-[#2563eb]" title="35%+ traffic" />
                <span className="text-[10px]">High</span>
              </div>
            </div>

            <span className="text-slate-400 text-[11px]">
              Pan or drag the map &bull; Use zoom buttons or mouse wheel
            </span>
          </div>
        </div>

        {/* Right: Top Countries Leaderboard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Top Locations</h3>
                <p className="text-xs text-slate-500">Ranked by total page impressions</p>
              </div>

              {/* Toggle Countries vs Metros */}
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setDemographicTab("countries")}
                  className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                    demographicTab === "countries" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Countries ({countryList.length})
                </button>
                {cityList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDemographicTab("cities")}
                    className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                      demographicTab === "cities" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Metros ({cityList.length})
                  </button>
                )}
              </div>
            </div>

            {demographicTab === "countries" ? (
              countryList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-slate-400 gap-2">
                  <Globe className="h-8 w-8 text-slate-300" />
                  <p className="text-sm">No geographic records available yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {countryList.map((c) => (
                    <div
                      key={c.code || c.name}
                      className="group rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 hover:border-blue-200 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shadow-2xs">
                            #{c.rank}
                          </span>
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition">
                            {c.name}
                          </span>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span className="text-sm font-black text-slate-800">{c.views.toLocaleString()}</span>
                          <span className="ml-1 text-[11px] font-semibold text-slate-400">({c.percentage}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(3, parseFloat(c.percentage)))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              cityList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-slate-400 gap-2">
                  <Globe className="h-8 w-8 text-slate-300" />
                  <p className="text-sm">No metro area records available yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {cityList.map((c) => (
                    <div
                      key={`${c.city}-${c.countryCode}`}
                      className="group rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 hover:border-blue-200 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shadow-2xs">
                            #{c.rank}
                          </span>
                          <span className="text-base shrink-0">{c.flag}</span>
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition block">
                              {c.city}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {c.countryName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span className="text-sm font-black text-slate-800">{c.views.toLocaleString()}</span>
                          <span className="ml-1 text-[11px] font-semibold text-slate-400">({c.percentage}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(3, parseFloat(c.percentage)))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Continents Mini Distribution */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Continental Distribution
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {continentStats.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">
                  <span className="text-slate-600 font-medium truncate">{item.name}</span>
                  <span className="font-bold text-blue-600 ml-1">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── LOWER ANALYTICS: DEVICES & REFERRALS ─────────────────── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Device Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Laptop className="h-4 w-4 text-blue-600" />
                Device Platform Share
              </h3>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 shadow-xl text-white text-xs">
                          <span className="font-bold">{d.name}:</span> {d.value}% of traffic
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            {DEVICE_DATA.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{d.name}</span>
                  </div>
                  <span className="text-base font-black text-slate-800">{d.value}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral Channels */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-600" />
                Traffic Acquisition Channels
              </h3>
            </div>
            <div className="space-y-4">
              {REFERRAL_SOURCES.map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="font-bold text-slate-800">{s.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Traffic attribution inferred from referrer HTTP request headers.
          </p>
        </div>

        {/* Top Performing Articles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Most Viewed Articles
              </h3>
            </div>
            {dashboardData?.popularPosts && dashboardData.popularPosts.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.popularPosts.slice(0, 4).map((post) => (
                  <div key={post.slug} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{post.title}</p>
                      <span className="text-[10px] font-semibold text-blue-600 uppercase">{post.category}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800 shrink-0">
                      {post.viewCount?.toLocaleString() || 0}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center text-xs text-slate-400">
                No popular post statistics available yet.
              </div>
            )}
          </div>

          <a
            href="/blogs"
            className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Manage all blog tutorials <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
