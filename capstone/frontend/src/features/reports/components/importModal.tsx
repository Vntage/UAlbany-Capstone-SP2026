import { useState } from "react";

type TransactionType = "income" | "expense";

type ImportModal = {
    mode: "manual" | "csv";
    setMode: (m: "manual" | "csv") => void;
    onClose: () => void;
    businessID: string;
}

export function ImportModal({
    mode,
    setMode,
    onClose,
    businessID,
}: ImportModal) {
    const[file, setFile] = useState<File | null> (null);
    const [form, setForm] = useState({
        name: "",
        date: "",
        amount: "",
        type: "expense" as TransactionType,
    });
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);
    const[result, setResult] = useState<any>(null);

    if (businessID === "") return;

    const handleManualSubmit = async() => {
        try{
            setLoading(true);

            const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

            const res = await fetch(api_url + `/${businessID}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    date: form.date,
                    amount: Number(form.date),
                    type: form.type,
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to create transaction");
                return;
            }
            onClose();
        }
        catch(error){
            console.error(error);
        }
        finally{
            setLoading(false)
        }
    }

    const handleCSVUpload = async() => {
        if(!file) return;

        try{
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);


            const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

            const res = await fetch(api_url + `/${businessID}/csv/validate`, {
                method: "POST",
                body: formData,
            })

            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Failed to validate CSV");
                return;
            }
            onClose();
        }
        catch(error){
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div className = "fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className = "bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Import Data</h2>
                    <button className="text-gray-400 hover:text-black text-lg" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="">
                    <button
                        onClick={() => setMode("manual")}
                        className={`px-3 py-1 rounded ${
                            mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100"
                        }`}
                    >
                        Manual
                    </button>

                    <button
                        onClick={() => setMode("csv")}
                        className={`px-3 py-1 rounded ${
                            mode === "csv" ? "bg-blue-600 text-white" : "bg-gray-100"
                        }`}
                    >
                        CSV Upload
                    </button>
                </div>

                {/* 🔁 SWITCH CONTENT */}
                {mode === "manual" ? (
                    <div className="space-y-3">

                    <input
                        placeholder="Name"
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                        type="date"
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />

                    <input
                        placeholder="Amount"
                        type="number"
                        className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />

                        <div className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            {["expense", "income"].map((t) => (
                                <button
                                key={t}
                                onClick={() =>
                                    setForm({ ...form, type: t as "income" | "expense" })
                                }
                                className={` ${form.type === t}`}
                                >
                                {t}
                                </button>
                            ))}
                            </div>

                    <button
                        onClick={handleManualSubmit}
                        disabled={loading}
                        className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                    >
                        {loading ? "Saving..." : "Add Transaction"}
                    </button>
                </div>
                ) : (
                <div className="space-y-4">

                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />

                    <button
                        onClick={handleCSVUpload}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        {loading ? "Uploading..." : "Validate CSV"}
                    </button>

                    {/* 🧠 Preview results */}
                    {result && (
                        <div className="text-xs bg-gray-50 p-3 rounded max-h-40 overflow-auto">
                            <p>Total: {result.summary.total}</p>
                            <p>Valid: {result.summary.valid}</p>
                            <p>Invalid: {result.summary.invalid}</p>
                            <p>Duplicates: {result.summary.duplicate}</p>
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    )
}