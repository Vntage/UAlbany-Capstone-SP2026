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

        setLoading(true);
        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        fetch(api_url + `/api/transaction/${businessID}/logs`)
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

    return (
        <div className="flex h-screen bg-surface">
          <Navbar />
          <div>
            <div>
                <h3>Period Filter</h3>

                <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                />

                <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                style={{ marginLeft: 10 }}
                />
            </div>
            <div>
                <button onClick={() => setActiveTab("transactions")}>
                Transactions
                </button>

                {role === "owner" && (
                <button
                    onClick={() => setActiveTab("logs")}
                >
                    Transaction Logs
                </button>
                )}
            </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow 
                     hover:bg-green-700 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
                    
                    onClick={() => {
                        setShowImportModal(true)
                    }}
                    >
                    + Create Transaction
                </button>
            {activeTab === "transactions" && (
                <div>
                    <h2>Transactions</h2>

                    {loading && <p>Loading...</p>}

                    {transactions.map((transaction) => (
                        <div
                        key={transaction.uid}
                        onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowEditTransactionModal(true);
                        }}
                        >
                        <div>
                            <strong>{transaction.name}</strong>
                            <span>{transaction.type}</span>
                        </div>

                        <div>${transaction.amount}</div>

                        <div>
                            {truncate(transaction.description, 80)}
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            {activeTab === "logs" && role === "owner" && (
                    <div>
                    <h2>Transaction Logs</h2>

                    {loading && <p>Loading logs...</p>}

                    {logs.map((log) => (
                        <div
                        key={log.uid}
                        >
                        <div><strong>{log.name}</strong></div>
                        <div>${log.amount}</div>
                        <div>
                            Edited: {log.editedAt}
                        </div>
                    </div>
                ))}
                </div>
            )}
          </div>

          {showImportModal && (
            <ImportModal
            mode = {mode}
            setMode= {setMode}
            onClose={() => setShowImportModal(false)}
            businessID = {businessID || ""}
        />)}
          {showEditTransactionModal && (
            <EditTransactionModal
            transaction={selectedTransaction}
            businessID= {businessID}
            onClose={() => setShowEditTransactionModal(false)}
            onUpdate={() => {
                fetch(`/api/businesses/${businessID}/transactions`)
                    .then((res) => res.json())
                    .then((data) => setTransactions(data))
                    .finally(()=> setLoading(false))
                }
            }
        />)}
        </div>
    )
}
