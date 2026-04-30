import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../../components/navbar";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { mockAlerts } from "../data/mockData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BusinessSwitcher from "../../users/components/BusinessSwitcher";
import CreateBusinessForm from "../../users/components/CreateBusinessForm";

export default function Dashboard() {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const navigate = useNavigate();

  //const [data, setData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]); //metrics must be processed separately
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]); //monthly trend data
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]); //revenue by category data
  const [alertSnapshot, setAlertSnapshot] = useState<any[]>([]); //alert snapshot data
  const [total, setTotal] = useState(0); //for pie chart percentage calculation optimization
  const [activeBusiness, setActiveBusiness] = useState<any>(null);
  const [executionTime, setExecutionTime] = useState(0); //"last updated"
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080"
  let myActiveBusiness: { name: string, uid: string } = { name: "", uid: "" }; //for debug

  const loadBusiness = () => {
    const stored = localStorage.getItem("activeBusiness");
    if (!stored) {
      setActiveBusiness(null);
      myActiveBusiness = { name: "", uid: "" };
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setActiveBusiness(parsed);
      console.log("Obtained active business from local storage...", parsed);
      myActiveBusiness = parsed;
    } catch (err) {
      console.error("Invalid activeBusiness:", err);
      setActiveBusiness(null);
      myActiveBusiness = { name: "", uid: "" };
    }
  };


  useEffect(() => {
    loadBusiness();
    const fetchBusiness = async () => {
      try {
        const fetchBusiness = await fetch(`${api_url}/api/business`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })

        if (myActiveBusiness.name === "") { //if empty business 
          const fetchBusinessArray = await fetchBusiness.json();
          console.log("Fetched business(es): ", fetchBusinessArray);
          //redirect if no user business is detected
          if (!fetchBusinessArray || fetchBusinessArray.length === 0) {
            console.error("No valid business found, redirecting...", activeBusiness);
            navigate("/users");
            return;
          }

          setActiveBusiness(fetchBusinessArray[0]);
          localStorage.setItem("activeBusiness", JSON.stringify(fetchBusinessArray[0]));
          myActiveBusiness = fetchBusinessArray[0];
          console.log("Active business UID: ", myActiveBusiness.uid);
        }
        console.log("My active business: ", myActiveBusiness);
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchBusiness();
  }, [])

  useEffect(() => { //load and verify user session on dashboard load
    const auth = getAuth();
    const fetchData = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(); //identify user for requests

          //identify user business
          const activeBusinessUID = activeBusiness.uid;
          console.log("Active business UID: ", activeBusinessUID);
          const businessRes = await fetch(api_url + "/api/business/" + activeBusinessUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const businessData = await businessRes.json();
          console.log("Fetched active business data: ", businessData);

          const metricsRes = await fetch(api_url + "/api/dashboard/metrics/" + activeBusinessUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const monthlyTrendRes = await fetch(api_url + "/api/dashboard/monthly-trend/" + activeBusinessUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const revenueByCategoryRes = await fetch(api_url + "/api/dashboard/revenue-by-category/" + activeBusinessUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });
          const alertSnapshotRes = await fetch(api_url + "/api/alert/" + activeBusinessUID, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
          });

          const [metricsData, monthlyTrendData, revenueByCategoryData, alertSnapshotData] = await Promise.all([
            metricsRes.json(),
            monthlyTrendRes.json(),
            revenueByCategoryRes.json(),
            alertSnapshotRes.json()
          ]);
          if (Array.isArray(monthlyTrendData)) { //if failed fetches, set to empty arrays
            setMonthlyTrend(monthlyTrendData); } else { setMonthlyTrend([]); }
          if (Array.isArray(revenueByCategoryData)) {
            setRevenueByCategory(revenueByCategoryData); } else { setRevenueByCategory([]); }
          if (Array.isArray(alertSnapshotData)) {
            setAlertSnapshot(alertSnapshotData); } else { setAlertSnapshot([]); }
          console.log("Fetched metrics data: ", metricsData, 
            "\nFetched monthly trend data: ", monthlyTrendData,
            "\nFetched revenue by category data: ", revenueByCategoryData, 
            "\nFetched alert snapshot data: ", alertSnapshotData);

          const calculateChange = (current: number, previous: number) => { //for metrics
            if (!previous || previous === 0) return 0; //don't divide by zero, treat as no change
            return ((current - previous) / previous) * 100;
          };
          const metricsInput = metricsData ?? { current_revenue: 0, prev_revenue: 0, current_expenses: 0, prev_expenses: 0 };
          const revChange = calculateChange(metricsInput.current_revenue, metricsInput.prev_revenue);
          const expChange = calculateChange(metricsInput.current_expenses, metricsInput.prev_expenses);
          const netChange = calculateChange(
            (metricsInput.current_revenue ?? 0) - (metricsInput.current_expenses ?? 0),
            (metricsInput.prev_revenue ?? 0) - (metricsInput.prev_expenses ?? 0));
          setMetrics([
            {
              title: "Change in Revenue",
              value: metricsInput.current_revenue - metricsInput.prev_revenue,
              change: revChange,
              trend: revChange > 0 ? "up" : "down",
              isPositiveDesired: true
            },
            {
              title: "Change in Expenses",
              value: metricsInput.current_expenses - metricsInput.prev_expenses,
              change: expChange,
              trend: expChange > 0 ? "up" : "down",
              isPositiveDesired: false
            },
            {
              title: "Change in Net Profit",
              value: (metricsInput.current_revenue ?? 0) - (metricsInput.current_expenses ?? 0) - ((metricsInput.prev_revenue ?? 0) - (metricsInput.prev_expenses ?? 0)),
              change: netChange,
              trend: netChange > 0 ? "up" : "down",
              isPositiveDesired: true
            }
          ]);
          setTotal((revenueByCategory || [{ category: "Missing data!", value: 0 }]).reduce((sum: number, entryValue: any) => sum + Number(entryValue.value), 0)); //entry is initially a number string
        } catch (error) {
          console.log("Error fetching dashboard data: " + (error instanceof Error ? error.message : String(error)));
        }
        setExecutionTime(Date.now());
        window.addEventListener("businessChanged", loadBusiness);
      } else {
        // User is signed out
        alert("You must be logged in to access the dashboard.");
      }
    });
    return () => {
      window.removeEventListener("businessChanged", loadBusiness);
      fetchData(); //end on exit
    };
  }, [activeBusiness?.uid]);

  if (!metrics) {return <div>Loading metrics...</div>;}
  if (!monthlyTrend) {return <div>Loading monthly trends...</div>;}
  if (!revenueByCategory) {return <div>Loading revenues by category...</div>;}
  //if (!alertSnapshot) {return <div>Loading alert snapshot...</div>;}

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
            <div className="flex-1 flex justify-center">
              <BusinessSwitcher onCreateClick={() => setShowCreateBusiness(true)} />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium text-gray-900">
                {new Date(executionTime).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
                {" "}
                {new Date(executionTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          {alertSnapshot.length > 0 && (() => { //if there are any alerts, notify with banner at top
            //group alerts by type e.g.( critical: 2, warning: 1, info: 5 )
            const counts = alertSnapshot.reduce((acc: Record<string, number>, alert: any) => {
              acc[alert.severity] = (acc[alert.severity] || 0) + 1;
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
                    Check the alerts page from the sidebar for full details.
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
                    { style: "currency", currency: activeBusiness?.currency || "USD" })}</div>
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
                <LineChart data={monthlyTrend ?? []}>
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
                    data={(revenueByCategory || [{ category: "Missing data!", value: 0 }]).map((d: { category: string; value: string; }) => ({ ...d, value: Number(d.value) }))} // convert str to number for compat
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ payload, value }) => {
                      const percentage = ((Number(value) / total) * 100).toFixed(1);
                      return `${payload.category} ${percentage}%`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                  >
                    {(revenueByCategory || [{ category: "Missing data!", value: 0 }]).map((_: any, index: number) => (
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

      {/* Create Business Modal */}
      {showCreateBusiness && (
        <CreateBusinessForm
          onClose={() => setShowCreateBusiness(false)}
          onSuccess={() => {
            setShowCreateBusiness(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}