import { useState, useEffect } from "react";
import { CategoryDropDown } from "./categoryDropDown";

type TransactionType = "income" | "expense";

type ImportModal = {
    mode: "manual" | "csv";
    setMode: (m: "manual" | "csv") => void;
    onClose: () => void;
    businessID: string;
}

type TransactionCategory = {
    uid: string;
    name: string;
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
        category: "other",
    });
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);
    const[result, setResult] = useState<any>(null);

    const[catOpen, setCatOpen] = useState(false);
    const[categories, setCategories] = useState<TransactionCategory[]>([]);
    const[selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);
    const[newCategory, setNewCategory] = useState("");
    const[creating, setCreating] = useState(false);

    if (businessID === "") return;

    const handleManualSubmit = async() => {
        try{
            setLoading(true);

            const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

            const res = await fetch(api_url + `/api/transaction/${businessID}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    date: form.date,
                    amount: Number(form.amount),
                    type: form.type,
                    category: form.category,
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

            const res = await fetch(api_url + `/api/transaction/${businessID}/csv/validate`, {
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

    useEffect(() => {
        const fetchCategories = async() => {
            try{
                const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

                const res = await fetch(api_url + `/api/transaction/${businessID}/category`, {
                    method: "GET",
                })

                const data = await res.json();

                setCategories(data);
            }
            catch(error){
                console.error(error);
            }
        };
        if(businessID) fetchCategories();
    }, [businessID]);

    return(
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className = "bg-white rounded-2xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Import Data</h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setMode("manual")}
                        className={`px-4 py-1 rounded-md text-sm transition ${
                            mode === "manual" ? "bg-white shadow font-medium" : "text-gray-600"
                        }`}
                    >
                        Manual
                    </button>

                    <button
                        onClick={() => setMode("csv")}
                        className={`px-4 py-1 rounded-md text-sm transition ${
                            mode === "csv" ? "bg-white shadow font-medium" : "text-gray-600"
                        }`}
                    >
                        CSV Upload
                    </button>
                </div>

                {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
                )}

                {/* 🔁 SWITCH CONTENT */}
                {mode === "manual" ? (
                    <div className="space-y-3">

                    <input
                        placeholder="Name"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                        type="date"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />

                    <input
                        placeholder="Amount"
                        type="number"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />

                    <div className="flex gap-2">
                    {["expense", "income"].map((t) => (
                        <button
                        key={t}
                        onClick={() =>
                            setForm({ ...form, type: t as TransactionType })
                        }
                        className={`flex-1 py-2 rounded-lg border text-sm transition ${
                            form.type === t
                            ? "bg-black text-white"
                            : "bg-white hover:bg-gray-50"
                        }`}
                        >
                        {t}
                        </button>
                    ))}
                    </div>

                    <div>
                        <button
                            onClick= {() => setCatOpen(!catOpen)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {selectedCategory?.name || "Select Category"}
                        </button>

                        {catOpen && (
                            <CategoryDropDown
                                categories={categories}
                                onSelect={(cat) => {
                                    setSelectedCategory(cat);
                                    setCatOpen(false)
                                }}
                                creating= {creating}
                                setCreating = {setCreating}
                                newCategory = {newCategory}
                                setNewCategory = {setNewCategory}
                                businessID = {businessID}
                                refreshCategories = {setCategories}
                            />
                        )}
                    </div>

                    <button
                        onClick={handleManualSubmit}
                        disabled={loading}
                        className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
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
                        className="w-full border p-3 rounded-lg"
                    />

                    <button
                        onClick={handleCSVUpload}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        {loading ? "Uploading..." : "Validate CSV"}
                    </button>

                    {/* 🧠 Preview results */}
                    {result && (
                        <div className="bg-gray-50 border rounded-lg p-3 text-xs space-y-1 max-h-40 overflow-auto">
                            <div className="font-semibold mb-2">
                                CSV Summary
                            </div>
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