import Navbar from "../../../components/navbar";
import { useState, useEffect } from "react";
import ReportModal from "../components/reportModal";
import { ReportRenderer } from "../components/reportRender";

type ReportType = 
  | "income_statement"
  | "expense_report"
  | "cash_flow"
  | "category_breakdown"

type Business = {
  uid: string;
  name: string;
}

type Period = "day" | "week" | "month" | "year";


export default function Reports() {
  const[reportType, setReportType] = useState<ReportType>("income_statement");
  const[period, setPeriod] = useState<Period>("month");

  const[startDate, setStartDate] = useState("");
  const[endDate, setEndDate] = useState("");

  const[data, setData] = useState<any>(null);

  const business = localStorage.getItem("activeBusiness");
  const businessName : string | null =  business && business !== "undefined" ? (JSON.parse(business) as Business).name : null;
  const businessID: string | null =  business && business !== "undefined" ? (JSON.parse(business) as Business).uid : null;
  const currency = localStorage.getItem("currency");

  const [lastSync, setLastSync] = useState("--");
  const [loading, setLoading] = useState(false);

  const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchPreview = async() => {
    if(!businessID) return;

    setLoading(true);

    try{
      const res = await fetch(`${api_url}/api/report/${businessID}/preview`,{
        method: "POST",
        credentials: "include",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ 
          reportType, 
          startDate, 
          endDate, 
          periodType: period,
        })
      })

      const result = await res.json();

      console.log(result)

      setData(result.data);
    }
    catch(error){
      console.log("Failed to load report: ", error);
    }
    finally{
      setLoading(false);
    }
  }

  const exportPDF = async() => {
    if(!businessID) return;

    setLoading(true);

    try{
      const res = await fetch(`${api_url}/api/report/${businessID}/export`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ 
          reportType, 
          startDate, 
          endDate, 
          periodType: period,
        })
      })

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${reportType}-${Date.now()}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    }
    catch(error){
      console.log("Failed to get PDF: ", error);
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreview();
    setLastSync(new Date().toLocaleDateString([], {hour: "2-digit", minute: "2-digit"}));
  }, [period, startDate, endDate, reportType])

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
                {business && (
                <button 
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm shadow 
                  hover:bg-purple-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
                  📄 Export
                </button>
                )}
              </div>
            </div>
          </div>

          {!business && (
            <div className="text-center py-20 text-gray-400">
            No business selected. Please create or switch a business.
            </div>
          )}
          {business && (
          <>
          

          {/* Filters */}
          <div className="bg-white p-2 rounded-xl shadow-sm border mb-8 flex justify-between items-center">
            <div className="flex gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100"
              >
                {[
                  {
                    label: "Income Statement",
                    value: "income_statement",
                  },
                  {
                    label: "Expense Report",
                    value: "expense_report",
                  },
                  {
                    label: "Cash Flow Report",
                    value: "cash_flow",
                  },
                  {
                    label: "Category Breakdown Report",
                    value: "category_breakdown",
                  }
                ].map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}

              </select>

              <select
                value={period}
                onChange={(e)=> setPeriod(e.target.value as Period)}
                className="px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100"
              >
                {[
                  { label: "Days", value: "day" },
                  { label: "Weeks", value: "week"},
                  { label: "Months", value: "month" },
                  { label: "Years", value: "year" }
                ].map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              
            </div>

            <div>
              <label>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <span className="text-xs text-gray-400">
              Last Sync: {lastSync}
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
                    {businessName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {reportType} Report
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
            {!loading && data && (
              <ReportRenderer
                reportType = {reportType}
                data = {data}
                currency = {currency || "$"} 
                />
            )}
            
            
          </div>

          {/* Footer */}
          <div className="mt-10 flex justify-between text-xs text-gray-400">
            <span>Report ID</span>
            <span>Generated by System</span>
          </div>
          </>
          )}

        </div>
      </main>
    </div>
  );
}