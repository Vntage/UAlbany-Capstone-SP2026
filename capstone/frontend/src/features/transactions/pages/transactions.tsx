import Navbar from "../../../components/navbar";
import { useState, useEffect } from "react";
import { ImportModal } from "../components/importModal";

export default function Transactions() {
      const [showImportModal, setShowImportModal] = useState(false);
      const [mode, setMode] = useState<"manual" | "csv">("manual");
    
      const business = localStorage.getItem("activeBusiness");
      const businessID =  business ? JSON.parse(business).uid : null;

      const[transactions, setTransactions] = useState<any[]>([]);
      const[logs, setLogs] = useState<any[]>([]);
      const[selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

      const[error, setError] = useState<string | null> (null);

      useEffect(() => {
        if(!businessID) return;
        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        fetch(api_url + `/api/transaction/${businessID}`, {
            method: "GET",
            credentials: "include",
        }).then((res) => {
            if(!res.ok) throw new Error("Failed to get transactions");
            return res.json();
        }).then((data) => {
            setTransactions(data);
        }).catch((error) => {
            setError(error.message)
        }).finally(() => {

        })
      }, [businessID])

    return (
        <div className="flex h-screen bg-surface">
          <Navbar />
          <main>

          </main>
          {showImportModal && (
            <ImportModal
            mode = {mode}
            setMode= {setMode}
            onClose={() => setShowImportModal(false)}
            businessID = {businessID || ""}
        />)}
        </div>
    )
}
