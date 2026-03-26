import Navbar from "../../../components/navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-bold">
                Financial Dashboard
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                {/* dynamic later */}
                Organization Overview
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2 bg-surface-container-highest rounded-lg text-sm shadow-sm">
                New Budget
              </button>
              <button className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm shadow">
                Run Forecast
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-12 gap-6 mb-10">

            {/* Revenue */}
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between mb-3">
                <span className="text-xs uppercase text-gray-500">
                  Revenue
                </span>
                <span className="text-xs text-green-600">
                  {/* dynamic */}
                  --
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                --
              </h2>

              {/* Placeholder graph */}
              <div className="flex gap-1 h-10">
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Expenses */}
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between mb-3">
                <span className="text-xs uppercase text-gray-500">
                  Expenses
                </span>
                <span className="text-xs text-red-600">
                  --
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                --
              </h2>

              <div className="flex gap-1 h-10">
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Cash Flow */}
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between mb-3">
                <span className="text-xs uppercase text-gray-500">
                  Cash Flow
                </span>
                <span className="text-xs text-blue-600">
                  --
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                --
              </h2>

              <div className="flex gap-1 h-10">
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-12 gap-8">

            {/* Recent Activity */}
            <div className="col-span-12 xl:col-span-8">

              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Recent Activity
                </h2>
                <button className="text-sm text-primary">
                  View All
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {/* TEMPLATE ROW */}
                    <tr>
                      <td className="px-6 py-4">
                        Transaction
                      </td>
                      <td className="px-6 py-4">--</td>
                      <td className="px-6 py-4">--</td>
                      <td className="px-6 py-4 text-right">--</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights / Alerts */}
            <div className="col-span-12 xl:col-span-4">

              <h2 className="text-lg font-semibold mb-6">
                Financial Insights
              </h2>

              <div className="space-y-4">

                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                  <p className="text-sm font-medium">
                    Alert message
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm font-medium">
                    Insight message
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-400">
                  <p className="text-sm font-medium">
                    Suggestion message
                  </p>
                </div>

                {/* Optional Promo Card */}
                <div className="bg-gradient-to-br from-primary to-primary-dim text-white p-5 rounded-xl mt-4">
                  <h3 className="font-bold mb-1">
                    Upgrade Feature
                  </h3>
                  <p className="text-xs opacity-80">
                    Additional analytics tools available
                  </p>
                  <button className="mt-3 bg-white text-primary px-3 py-1 rounded text-xs font-semibold">
                    Upgrade
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}