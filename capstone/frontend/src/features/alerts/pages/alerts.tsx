import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import { CreateAlertModal } from "../components/CreateAlertModal";

type Business = {
  uid: string;
  name: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: "text-red-600 bg-red-50",
  medium: "text-amber-600 bg-amber-50",
  low: "text-blue-600 bg-blue-50", //not sure about this color so feel free to change it
}; //alert_severity AS ENUM ('low', 'medium', 'high');

export default function Alerts() {
  const business = localStorage.getItem("activeBusiness");
  const businessID: string | null = business && business !== "undefined" ? (JSON.parse(business) as Business).uid : null;

  const [rules, setRules] = useState<any>([]);

  const [openModal, setOpenModal] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(false);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080"

  const fetchRules = async () => {
    if (!businessID) return;

    setLoading(true);
    try {
      const res = await fetch(`${api_url}/api/alert/${businessID}/rules`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (Array.isArray(data)) { 
        setRules(data);
        console.log("Fetched rules: ", data);
      } else { //avoid crash if user has no valid session (i.e. auto-logged out)
        setRules([]);
        console.error("Incorrect rules response format: ", data);
        if (data.message === "No Session") { //handled here since rules are fetched first
          alert("No session found. Please log in again.");
        }
      }

    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }

  const toggleRule = async (uid: any) => {
    console.log(uid)
    try {
      await fetch(`${api_url}/api/alert/${businessID}/rule`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_rule_id: uid })
      });

      await fetchRules();
    }
    catch (error) {
      console.log(error)
    }
  }

  const fetchAlerts = async () => {
    if (!businessID) return;
    try {
      const res = await fetch(`${api_url}/api/alert/${businessID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("Fetched alerts: ", data);
      if (res.ok) {
        setAlerts(data || []);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching alerts! Did you join any businesses?");
    }
  };
  useEffect(() => {
    //fetch rules before alerts
    fetchRules();
    fetchAlerts();

    /*
    //POLL EVERY 15 MINUTES FOR NEW ALERTS (really only useful if multiple users are on)
    //not necessary for now but might be useful in a practical environment
    const alertInterval = setInterval(() => {
      fetchAlerts();
    }, 900000); //15m * 60s * 1000ms = 900000

    return () => clearInterval(alertInterval);
    */
  }, []);

  const categoryMap: Record<string, string> = {};

  function renderCondition(condition: any): string {
    const left = renderExpression(condition.left);
    const right = renderExpression(condition.right);

    return `${left} ${condition.operator} ${right}`
  }

  function renderExpression(exp: any): string {
    if (!exp || !exp.type) {
      return "Missing expression type"
    }
    switch (exp.type) {
      case "value":
        return exp.value.toString();

      case "metric":
        return exp.field.replace("_", " ");

      case "budget_total":
        return "Budget Total";

      case "category_total":
        return `Category (${categoryMap[exp.category_id] || ""})`;

      case "budget_item_allocated":
        return `Budget (${exp.budget_id})`;

      case "expression":
        return `(${renderExpression(exp.left)} ${exp.operator} ${renderExpression(exp.right)})`;

      default:
        return "";
    }
  }

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold">
                Financial Alerts
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Monitor risks, anomalies, and insights in real-time
              </p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow 
                  hover:bg-purple-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              + Create Alert Rule
            </button>
          </div>
          {businessID &&
            <>
              {/*Change to only seen by owner or admin*/}
              <div className="mt-10 bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">
                    Alert Rules
                  </h2>
                </div>

                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-400 uppercase border-b">
                    <tr>
                      <th className="py-3 px-6 text-left">Title</th>
                      <th className="py-3 px-6 text-left">Condition</th>
                      <th className="py-3 px-6 text-left">Type</th>
                      <th className="py-3 px-6 text-right">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No alert rules yet
                        </td>
                      </tr>
                    ) : (
                      rules.map((rule: any) => (
                        <tr key={rule.uid}>
                          <td className="px-6 py-4 font-semibold">
                            {rule.title}
                          </td>
                          <td className="px-6 py-4">
                            {renderCondition(rule.condition)}
                          </td>
                          <td className="px-6 py-4">
                            {rule.type}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${rule.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                              }`}>
                              {rule.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              disabled={false}
                              onClick={() => toggleRule(rule.uid)}
                            >
                              [Toggle]
                            </button>
                          </td>
                        </tr>
                      ))
                    )}

                  </tbody>

                </table>
              </div>
            </>
          }

          {/* Alerts Table */}
          <div className="mt-10 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">
                Alert History
              </h2>
            </div>

            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase border-b">
                <tr>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Message</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>

              {/* following old format */}
              <tbody className="divide-y">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No alerts yet
                    </td>
                  </tr>
                ) : (alerts.map((alert: any) => (
                  <tr key={alert.alert_id}>
                    <td className="px-6 py-4 font-semibold">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${SEVERITY_COLORS[alert.severity] || "text-gray-600 bg-gray-50"
                        }`}>{alert.severity}</span>

                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {alert.title}
                    </td>

                    <td className="px-6 py-4">
                      {alert.message}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(alert.triggered_at).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.read_at
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {alert.read_at ? `Read at ${alert.read_at}` : "Unread"}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
      {openModal && (
        <CreateAlertModal
          isOpen={openModal}
          businessID={businessID || ""}
          //get categories and refresh on submit
          categories={[]}
          onSubmit={() => { fetchRules(); fetchAlerts(); }}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}