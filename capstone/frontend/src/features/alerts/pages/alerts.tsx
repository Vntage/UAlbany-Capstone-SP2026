import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import { CreateAlertModal } from "../components/CreateAlertModal";

type Business = {
    uid: string;
    name: string;
}

export default function Alerts() {
  const business = localStorage.getItem("activeBusiness");
  const businessID: string | null =  business && business !== "undefined" ? (JSON.parse(business) as Business).uid : null;

  const [rules, setRules] = useState<any>([]);

  const [openModal, setOpenModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080"

  const fetchAlerts = async (businessId: string) => {
    try {
      const res = await fetch(`${api_url}/api/alert/${businessId}`,
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
    //fetch alerts
    fetchAlerts(businessID || "");
  }, []);
  
  const categoryMap: Record<string, string> = {};

  function renderCondition(condition: any): string {
    const left = renderExpression(condition.left);
    const right = renderExpression(condition.right);

    return `${left} ${condition.operator} ${right}`
  }

  function renderExpression(exp: any): string {
    switch(exp.type){
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
  

  useEffect(() => {

  })

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
                    <td>
                      No alert rules yet
                    </td>
                  </tr>
                ):(
                  rules.map((rule: any) => {
                    <tr key={rule.uid}>
                      <td className="px-6 py-4">
                        {rule.title}
                      </td>
                      <td className="px-6 py-4">
                        {renderCondition(rule.condition)}
                      </td>
                      <td className="px-6 py-4">
                        {rule.type}
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            rule.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        //edit rule
                      </td>
                    </tr>
                  })
                )}

              </tbody>

            </table>
          </div>


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
                  <th className="py-3 px-6 text-left">Message</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4 text-red-600 font-semibold">
                    Critical
                  </td>
                  <td className="px-6 py-4">
                    Expense spike detected
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    Today
                  </td>
                  <td className="px-6 py-4 text-right text-red-500">
                    Open
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 text-blue-600 font-semibold">
                    Insight
                  </td>
                  <td className="px-6 py-4">
                    Cash flow healthy
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    Yesterday
                  </td>
                  <td className="px-6 py-4 text-right text-green-600">
                    Resolved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
      {openModal && (
        <CreateAlertModal
          isOpen = {openModal}
          businessID={businessID || ""}
          //get categories and refresh on submit
          categories={[]}
          onSubmit={() => {}}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}