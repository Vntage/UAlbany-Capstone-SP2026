import Navbar from "../../../components/navbar";

export default function Budget() {
  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Monthly Operating Budget
              </h1>
              <p className="text-sm text-on-surface-variant">
                Fiscal Period
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-surface-container-high rounded-lg text-sm shadow-sm hover:shadow">
                Export
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm shadow hover:opacity-90">
                Adjust Targets
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-6 mb-10">

            {/* Utilization */}
            <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between mb-4">
                <span className="text-xs font-semibold text-primary uppercase">
                  Budget Utilization
                </span>
                <span className="text-2xl font-bold">--</span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[0%]"></div>
              </div>

              <div className="flex justify-between text-xs mt-3 text-gray-500">
                <span>Expended</span>
                <span>Total</span>
              </div>
            </div>

            {/* Runway */}
            <div className="col-span-4 bg-primary text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-80">Available Runway</p>
              <h2 className="text-3xl font-bold mt-2">--</h2>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            {/* Table Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <h2 className="font-semibold text-lg">
                Expense Categories
              </h2>

              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                  Filter
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                  More
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-right">Budgeted</th>
                  <th className="px-6 py-4 text-right">Actual</th>
                  <th className="px-6 py-4 text-right">Variance</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {/* TEMPLATE ROW */}
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">
                    Category Name
                  </td>
                  <td className="px-6 py-4 text-right">--</td>
                  <td className="px-6 py-4 text-right">--</td>
                  <td className="px-6 py-4 text-right">--</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
                      Status
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div className="px-6 py-4 flex justify-between border-t bg-gray-50">
              <span className="font-semibold">
                Gross Operating Expenses
              </span>

              <div className="flex gap-10 text-sm">
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-semibold">--</p>
                </div>
                <div>
                  <p className="text-gray-500">Actual</p>
                  <p className="font-semibold">--</p>
                </div>
                <div>
                  <p className="text-gray-500">Variance</p>
                  <p className="font-semibold">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-10 grid grid-cols-3 gap-6">

            <div className="p-5 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-sm font-medium">
                Insight message
              </p>
            </div>

            <div className="p-5 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <p className="text-sm font-medium">
                Insight message
              </p>
            </div>

            <div className="p-5 bg-gray-100 border-l-4 border-gray-400 rounded-lg">
              <p className="text-sm font-medium">
                Insight message
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}