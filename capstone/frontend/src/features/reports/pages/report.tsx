import Navbar from "../../../components/navbar";
import { useState, useEffect } from "react";

type IncomeData = {
  income: number;
  expense: number;
  netProfit: number;
  breakdown?: {category: string; total: number}[];
}
type ExpenseData = {

}

type CashFlowData = {

}

type CategoryBreakdownData = {

}

export default function Reports() {
  const[data, setData] = useState<IncomeData | ExpenseData | CashFlowData | CategoryBreakdownData | null>(null);
  const[loading, setLoading] = useState(false);

  const business = localStorage.getItem("activeBusiness");
  const businessID =  business ? JSON.parse(business).uid : null;

  const[range, setRange] = useState({
    startDate: "",
    endDate: ""
  });

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold">
                Financial Report
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                {/* dynamic */}
                Profit & Loss Overview
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow 
                     hover:bg-purple-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
                  📄 Export
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow 
                     hover:bg-green-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                  📊 Import 
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-2 rounded-xl shadow-sm border mb-8 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100">
                Last Month
              </button>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">
                Selected Period
              </button>
              <button className="px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100">
                Year to Date
              </button>
            </div>

            <span className="text-xs text-gray-400">
              Last Sync: --
            </span>
          </div>

          {/* Report Sheet */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            {/* Report Header */}
            <div className="p-8 border-b">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs uppercase text-primary mb-1">
                    Statement
                  </p>
                  <h2 className="text-xl font-bold">
                    Company Name
                  </h2>
                  <p className="text-sm text-gray-500">
                    Date Range
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    Currency
                  </p>
                  <p className="font-semibold">
                    USD
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-8">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-gray-400 border-b">
                  <tr>
                    <th className="pb-3 text-left">Category</th>
                    <th className="pb-3 text-right">Current</th>
                    <th className="pb-3 text-right">Previous</th>
                    <th className="pb-3 text-right">Change</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {/* Revenue */}
                  <tr>
                    <td className="py-4 font-semibold">
                      Total Revenue
                    </td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right text-green-600">--</td>
                  </tr>

                  {/* COGS */}
                  <tr>
                    <td className="py-3 pl-4 text-gray-500">
                      Cost of Goods Sold
                    </td>
                    <td className="py-3 text-right">--</td>
                    <td className="py-3 text-right">--</td>
                    <td className="py-3 text-right text-red-500">--</td>
                  </tr>

                  {/* Gross Profit */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-4">
                      Gross Profit
                    </td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right text-green-600">--</td>
                  </tr>

                  {/* Section Header */}
                  <tr>
                    <td colSpan={4} className="pt-6 text-xs uppercase text-gray-400">
                      Operating Expenses
                    </td>
                  </tr>

                  {/* Expense Row Template */}
                  <tr>
                    <td className="py-3 pl-4">
                      Expense Category
                    </td>
                    <td className="py-3 text-right">--</td>
                    <td className="py-3 text-right">--</td>
                    <td className="py-3 text-right">--</td>
                  </tr>

                  {/* Total Expenses */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-4">
                      Total Expenses
                    </td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right">--</td>
                    <td className="py-4 text-right text-red-500">--</td>
                  </tr>

                  {/* Net Income */}
                  <tr className="bg-blue-50">
                    <td className="py-5 font-bold text-blue-700">
                      Net Income
                    </td>
                    <td className="py-5 text-right font-bold">--</td>
                    <td className="py-5 text-right">--</td>
                    <td className="py-5 text-right text-green-600 font-bold">--</td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <p className="text-xs text-gray-400">Profit Margin</p>
                <p className="text-2xl font-bold">--</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Efficiency Ratio</p>
                <p className="text-2xl font-bold">--</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Burn Rate</p>
                <p className="text-2xl font-bold">--</p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex justify-between text-xs text-gray-400">
            <span>Report ID</span>
            <span>Generated by System</span>
          </div>

        </div>
      </main>
    </div>
  );
}