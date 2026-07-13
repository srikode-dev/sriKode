import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { BarChart2, Globe, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function Analytics() {
  const [data, setData] = useState({ dailyViews: [], countryViews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/blogs/admin/analytics");
        setData({
          dailyViews: res.data.dailyViews.map((d) => ({ date: d._id, views: d.views })),
          countryViews: res.data.countryViews.map((d) => ({ country: d._id, views: d.views })),
        });
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Calculate percentages for countries
  const totalViews = data.countryViews.reduce((sum, c) => sum + c.views, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            Blog Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track views, engagement, and global readership locations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Daily Views</h3>
          {data.dailyViews.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400">No data available yet</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Global Readership Map */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Global Readership
          </h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-700">
              <strong>Privacy Notice:</strong> Location data is inferred securely and anonymously via edge servers. No IP addresses are stored or logged to ensure compliance with privacy laws.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-h-[200px] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
              <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryData = data.countryViews.find(c => c.country === geo.id || c.country === geo.properties.name);
                      const isHigh = countryData && countryData.views > (totalViews * 0.1);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isHigh ? "#bfdbfe" : countryData ? "#dbeafe" : "#e2e8f0"}
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#93c5fd", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Regions</h4>
              {data.countryViews.length === 0 && <p className="text-sm text-slate-400">No data</p>}
              {data.countryViews.slice(0, 5).map((loc, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700 text-sm truncate pr-2">{loc.country}</span>
                    <span className="font-bold text-blue-600 text-sm">{loc.views}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(2, (loc.views / totalViews) * 100))}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
