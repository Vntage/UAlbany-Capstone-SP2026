import Navbar from "../../../components/navbar";
import { useState, useEffect } from "react";
import { ImportModal } from "../components/importModal";
import EditTransactionModal from "../components/editTransactionModal";

export default function Transactions() {
      const [showImportModal, setShowImportModal] = useState(false);
      const [mode, setMode] = useState<"manual" | "csv">("manual");
    
      const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);

      const business = localStorage.getItem("activeBusiness");
      const businessID =  business ? JSON.parse(business).uid : null;

      const role = localStorage.getItem("role");

      const[transactions, setTransactions] = useState<any[]>([]);
      const[logs, setLogs] = useState<any[]>([]);

      const [periodStart, setPeriodStart] = useState("");
      const [periodEnd, setPeriodEnd] = useState("");

      const [activeTab, setActiveTab] = useState<"transactions" | "logs">("transactions")

      const[selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

      const[error, setError] = useState<string | null> (null);
      const[loading, setLoading] = useState(false)

      const canEdit = role === "owner" || role === "admin";

      useEffect(() => {
        if(!businessID) return;
        setLoading(true);

        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        const params = new URLSearchParams();

        if (periodStart) params.append("periodStart", periodStart);
        if (periodEnd) params.append("periodEnd", periodEnd);

        fetch(
        `${api_url}/api/transaction/${businessID}?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
        }
        ).then((res) => {
            if(!res.ok) throw new Error("Failed to get transactions");
            return res.json();
        }).then((data) => {
            setTransactions(data);
        }).catch((error) => {
            setError(error.message)
        }).finally(() => {
            setLoading(false)
        })
      }, [businessID, periodStart, periodEnd])

      useEffect(() => {
        if(!businessID || activeTab !== "logs") return;
        if(role !== "owner") return;
        console.log(localStorage)
        setLoading(true);
        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        fetch(api_url + `/api/transaction/${businessID}/logs`, 
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
          .then((res) => {
            if(!res.ok) throw new Error("Failed to fetch logs");
            return res.json();
          })
          .then((data) => setLogs(data))
          .finally(() => setLoading(false));
      }, [businessID, activeTab, role]);

      function truncate(text: string, max = 80) {
        if (!text) return "";
        return text.length > max ? text.slice(0, max) + "..." : text;
      }

      const formatDate = (iso: string) => {
        if(iso != null) return iso.split("T")[0];
        return;
      }

    return (
        <div className="flex h-screen bg-surface">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                        Transactions
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                        Transaction history overview
                        </p>
                    </div>

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow 
                        hover:bg-green-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => setShowImportModal(true)}
                    >
                        + Create Transaction
                    </button>

                    </div>

                    {/* FILTER BAR */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">

                    {/* DATE FILTERS */}
                    <div className="flex gap-4">

                    {/* START DATE */}
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                        Start Date
                        </label>

                        <input
                        type="date"
                        value={periodStart}
                        onChange={(e) => setPeriodStart(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* END DATE */}
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                        End Date
                        </label>

                        <input
                        type="date"
                        value={periodEnd}
                        onChange={(e) => setPeriodEnd(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    </div>

                    {/* TABS */}
                    <div className="flex gap-2">

                        <button
                        onClick={() => setActiveTab("transactions")}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                            activeTab === "transactions"
                            ? "bg-blue-600 text-white shadow"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                        >
                        Transactions
                        </button>

                        {role === "owner" && (
                        <button
                            onClick={() => setActiveTab("logs")}
                            className={`px-4 py-2 rounded-lg text-sm transition ${
                            activeTab === "logs"
                                ? "bg-blue-600 text-white shadow"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            Logs
                        </button>
                        )}

                    </div>

                    </div>

                    {/* CONTENT CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                    {/* HEADER */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                        {activeTab === "transactions" ? "Transaction Ledger" : "Transaction Logs"}
                        </h2>
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-4">

                        {/* LOADING */}
                        {loading && (
                        <p className="text-sm text-gray-500">Loading...</p>
                        )}

                        {/* TRANSACTIONS */}
                        {activeTab === "transactions" && (
                        <div className="space-y-3">

                            {transactions.map((transaction) => (
                            <div
                                key={transaction.uid}
                                onClick={() => {
                                if(!canEdit) return;
                                setSelectedTransaction(transaction);
                                setShowEditTransactionModal(true);
                                }}
                                className="p-4 border rounded-lg hover:shadow-md hover:border-blue-300 cursor-pointer transition"
                            >
                                <div className="flex justify-between items-center">

                                <div>
                                    <strong className="text-gray-900">
                                    {transaction.name}
                                    </strong>

                                    <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                    {transaction.type}
                                    </span>
                                </div>

                                <div className="font-semibold text-gray-900">
                                    ${transaction.amount}
                                </div>

                                </div>

                                <div className="text-sm text-gray-500 mt-2">
                                {truncate(transaction.description, 80)}
                                </div>
                            </div>
                            ))}

                        </div>
                        )}

                        {/* LOGS */}
                        {activeTab === "logs" && role === "owner" && (
                        <div className="space-y-3">

                            {logs.map((log) => (
                            <div
                                key={log.uid}
                                className="p-4 border rounded-lg bg-gray-50"
                            >
                                <div className="flex justify-between">

                                <strong className="text-gray-900">
                                    {log.name}
                                </strong>

                                <span className="font-semibold text-gray-800">
                                    ${log.amount}
                                </span>

                                </div>

                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <div> 
                                        Edited by: {log.first_name} {log.last_name}
                                    </div>
                                    <div className="flex justify-end"> 
                                        Edited at: {formatDate(log.edited_at)}
                                    </div>
                                </div>

                            </div>
                            ))}

                        </div>
                        )}

                    </div>
                    </div>

                </div>
            </main>

            {showImportModal && (
            <ImportModal
                mode={mode}
                setMode={setMode}
                onClose={() => setShowImportModal(false)}
                businessID={businessID || ""}
            />
            )}

            {showEditTransactionModal && (
            <EditTransactionModal
                transaction={selectedTransaction}
                businessID={businessID}
                onClose={() => setShowEditTransactionModal(false)}
                onUpdate={() => {
                fetch(`/api/businesses/${businessID}/transactions`)
                    .then((res) => res.json())
                    .then((data) => setTransactions(data))
                    .finally(() => setLoading(false));
                }}
            />
            )}

        </div>
    )};