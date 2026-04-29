import Navbar from "../../../components/navbar";
import { useState, useEffect } from "react";
import ReportModal from "../components/reportModal";

type ReportType = 
    | "Income"
    | "Expense"
    | "Cashflow"
    | "Category Breakdown";


export default function Reports() {
  const[reportType, setReportType] = useState<ReportType>("Income");
  const[period, setPeriod] = useState("month");
  const[data, setData] = useState<any>(null);
  const[open, setOpen] = useState(false);

  const business = localStorage.getItem("activeBusiness");
  const businessID =  business ? JSON.parse(business).uid : null;
  const currency = localStorage.getItem("currency");

  const getDateRange = () => {
    const now = new Date();
    
    if(period === "month"){
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10),
        endDate: now.toISOString().slice(0,10)
      }
    }
    if(period === "ytd"){
      return {
        startDate: `${now.getFullYear()}-01-01`,
        endDate: now.toISOString().slice(0,10)
      }
    }
    return{};
  }

  const generateReport = async() => {
    const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const report = reportType.toLowerCase().replace(/\s/g, "");

    const params = new URLSearchParams();

    const { startDate, endDate } = getDateRange();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await fetch(`${api_url}/api/report/${businessID}/${report}/?${params.toString()}`, 
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await res.json();

    setData(result);
    setOpen(true);
  }

  const exportPDF = () => {
    if(!data) return;

    window.open(`/api/reports/${reportType}/${businessID}?format=pdf`,
      "_blank");
  }

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
                Financial Reports
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                {/* dynamic */}
                Profit & Loss Overview
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={generateReport}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow 
                  hover:bg-purple-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
                  📄 Export
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-2 rounded-xl shadow-sm border mb-8 flex justify-between items-center">
            <div className="flex gap-2">

              {[
                { label: "Last Month", value: "month" },
                { label: "Select Period", value: "custom" },
                { label: "Year to Date", value: "ytd" }
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className="px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100"
                >
                  {p.label}
                </button>
              ))
              }
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
                    {period.toUpperCase()} Report
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {currency}
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

      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        reportType={reportType}
        data = {data}
        onExport={exportPDF}
        currency={currency || "USD"}
      />
    </div>
  );
}