import { useState } from "react";
import Navbar from "../../../components/navbar";
import { CreateAlertModal } from "../components/CreateAlertModal";

type Business = {
    uid: string;
    name: string;
}

export default function Alerts() {
  const business = localStorage.getItem("activeBusiness");
  const businessID: string | null =  business && business !== "undefined" ? (JSON.parse(business) as Business).uid : null;

  const [openModal, setOpenModal] = useState(false);

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

            <button className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm shadow hover:opacity-90 transition"
              onClick={() => setOpenModal(true)}
            >
              + Create Alert
            </button>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Critical Alert */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-lg">
                  ⚠️
                </div>

                <div>
                  <h3 className="font-semibold text-red-700">
                    Expense Spike Detected
                  </h3>
                  <p className="text-sm text-red-600 mt-1">
                    Cloud infrastructure costs increased by 45% compared to last month.
                  </p>

                  <button className="mt-3 text-xs font-semibold text-red-700 underline">
                    Investigate
                  </button>
                </div>
              </div>
            </div>

            {/* Positive Insight */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-lg">
                  📈
                </div>

                <div>
                  <h3 className="font-semibold text-primary">
                    Strong Cash Flow
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your runway is projected to last 14 months at current burn rate.
                  </p>

                  <button className="mt-3 text-xs font-semibold text-primary underline">
                    View Forecast
                  </button>
                </div>
              </div>
            </div>

            {/* Optimization Suggestion */}
            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-lg">
                  ⚡
                </div>

                <div>
                  <h3 className="font-semibold text-purple-700">
                    Optimization Opportunity
                  </h3>
                  <p className="text-sm text-purple-600 mt-1">
                    Consolidating vendor payments could save ~$240/month.
                  </p>

                  <button className="mt-3 text-xs font-semibold text-purple-700 underline">
                    Review Vendors
                  </button>
                </div>
              </div>
            </div>

            {/* Neutral Info */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-gray-400 text-white w-10 h-10 flex items-center justify-center rounded-lg">
                  ℹ️
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">
                    No New Risks
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your financial metrics are within expected ranges.
                  </p>

                  <button className="mt-3 text-xs font-semibold text-gray-700 underline">
                    View Details
                  </button>
                </div>
              </div>
            </div>

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