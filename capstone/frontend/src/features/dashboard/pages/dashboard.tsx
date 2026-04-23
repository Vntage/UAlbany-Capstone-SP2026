import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../../components/navbar";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { mockAlerts } from "../data/mockData";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const [data, setData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null); //metrics must be processed separately
  const [total, setTotal] = useState(0); //for pie chart percentage calculation optimization

  useEffect(() => { //load and verify user session on dashboard load
    const auth = getAuth();
    const fetchData = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080"

          const fetchBusinessOne = await fetch(api_url + "/api/fetchBusinessOne", { //FOR TESTING
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const businessOneData = await fetchBusinessOne.json();
          const businessOneUID = businessOneData.uid; //for later fetching
          console.log("Fetched business one: ", businessOneData); //END [FOR TESTING]

          const res = await fetch(api_url + "/api/dashboard/" + businessOneUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const data = await res.json();
          setData(data);
          console.log("Dashboard data: ", data);

          const calculateChange = (current: number, previous: number) => { //for metrics
            if (!previous || previous === 0) return 0; //don't divide by zero, treat as no change
            return ((current - previous) / previous) * 100;
          };
          const revChange = calculateChange(data.metrics.current_revenue, data.metrics.prev_revenue);
          const expChange = calculateChange(data.metrics.current_expenses, data.metrics.prev_expenses);
          const netChange = calculateChange(
            (data.metrics.current_revenue ?? 0) - (data.metrics.current_expenses ?? 0),
            (data.metrics.prev_revenue ?? 0) - (data.metrics.prev_expenses ?? 0));
          setMetrics([
            {
              title: "Change in Revenue",
              value: data.metrics.current_revenue - data.metrics.prev_revenue,
              change: revChange,
              trend: revChange > 0 ? "up" : "down",
              isPositiveDesired: true
            },
            {
              title: "Change in Expenses",
              value: data.metrics.current_expenses - data.metrics.prev_expenses,
              change: expChange,
              trend: expChange > 0 ? "up" : "down",
              isPositiveDesired: false
            },
            {
              title: "Change in Net Profit",
              value: (data.metrics.current_revenue ?? 0) - (data.metrics.current_expenses ?? 0) - ((data.metrics.prev_revenue ?? 0) - (data.metrics.prev_expenses ?? 0)),
              change: netChange,
              trend: netChange > 0 ? "up" : "down",
              isPositiveDesired: true
            }
          ]);
          setTotal(data.revenueByCategory.reduce((sum: number, entryValue: any) => sum + Number(entryValue.value), 0)); //entry is initially a number string
        } catch (error) {
          alert("Error fetching dashboard data:" + (error instanceof Error ? error.message : String(error)));
        }
      } else {
        // User is signed out
        alert("You must be logged in to access the dashboard.");
      }
    });
    return () => fetchData();
  }, []);

  if (!data) return <div>Loading data...</div>; //wait until data is done loading before rendering
  if (!metrics) return <div>Loading metrics...</div>;
  console.log("Processed metrics: ", metrics);

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your business financial performance</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium text-gray-900">March 3, 2026</div>
            </div>
          </div>

          {/* Alert Banner */}
          {data?.alerts?.length > 0 && (() => { //if there are any alerts, notify with banner at top
            //group alerts by type e.g.( critical: 2, warning: 1, info: 5 )
            const counts = data.alerts.reduce((acc: Record<string, number>, alert: any) => {
              acc[alert.type] = (acc[alert.type] || 0) + 1;
              return acc;
            }, {});

            return (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-red-900">Business Alerts require your attention:</div>
                  <div className="text-sm text-red-700 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {Object.entries(counts).map(([type, count]) => (
                      <span key={type} className="capitalize">
                        <strong>{type}:</strong> {count as number}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-red-600 mt-2 italic">
                    Check the alerts section below for full details.
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric: { title: string; value: number; change: number; trend: string; isPositiveDesired: boolean }) => (
              <div key={metric.title} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-600">{metric.title}</div>
                  <div
                    className={`flex items-center gap-1 text-sm ${metric.trend === "up"
                        ? metric.isPositiveDesired
                          ? "text-green-600"
                          : "text-red-600"
                        : metric.isPositiveDesired
                          ? "text-red-600"
                          : "text-green-600"
                      }`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(metric.change).toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString("en-US",
                    { style: "currency", currency: data.businesses[0]?.currency || "USD" })}</div>
                <div className="text-xs text-gray-500 mt-1">vs. last month</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" tickFormatter={(month) =>
                    new Date(0, month - 1).toLocaleString("en-US", { month: "short" })} />
                  <YAxis stroke="#666" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => `$${(value as number).toLocaleString()}`}
                    labelFormatter={(month) =>
                      new Date(0, month - 1).toLocaleString("en-US", { month: "long" })}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Category */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.revenueByCategory.map((d: { category: string; value: string; }) => ({ ...d, value: Number(d.value) }))} // convert str to number for compat
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ payload, value }) => {
                      const percentage = ((Number(value) / total) * 100).toFixed(1);
                      return `${payload.category} ${percentage}%`; }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                  >
                    {data.revenueByCategory.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="p-6 flex items-start gap-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${alert.type === "critical"
                      ? "bg-red-500"
                      : alert.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                      }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">{alert.date}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {alert.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${alert.type === "critical"
                          ? "bg-red-100 text-red-700"
                          : alert.type === "warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Update Budget</div>
                  <div className="text-sm text-gray-600">Adjust allocations</div>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Run Forecast</div>
                  <div className="text-sm text-gray-600">Generate projections</div>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Review Alerts</div>
                  <div className="text-sm text-gray-600">View all notifications</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}