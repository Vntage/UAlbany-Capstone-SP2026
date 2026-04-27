import { useState, useEffect } from "react";
import { CategoryDropDown } from "./categoryDropDown";

type TransactionCategory = {
    uid: string;
    name: string;
}

type TransactionType = "income" | "expense";

export default function EditTransactionModal({
    transaction,
    businessID,
    onClose,
    onUpdate,
}: {
    transaction: any;
    businessID: string;
    onClose: () => void;
    onUpdate: () => void;
}) {
    const[name, setName] = useState(transaction.name);
    const[amount, setAmount] = useState(transaction.amount);
    const[category, setCategory] = useState(transaction.category);
    const[type, setType] = useState(transaction.type);
    const[description, setDescription] = useState(transaction.description);
    const[date, setDate] = useState(transaction.date);

    const[catOpen, setCatOpen] = useState(false);
    const[categories, setCategories] = useState<TransactionCategory[]>([]);
    const[newCategory, setNewCategory] = useState("");
    const[creating, setCreating] = useState(false);
    
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState<string | null>(null);

    function handleSave(){
        setLoading(true);
        setError(null);

        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        fetch(api_url + `api/transaction/${businessID}/${transaction.uid}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    amount,
                    category,
                    type,
                    description,
                    date
                })
            }
        ).then((res) => {
            if(!res.ok) throw new Error("Failed to update transaction");
        }).then(() => {
            onUpdate();
            onClose();
        }).catch((error) => setError(error.message))
        .finally(()=> setLoading(false))
    }

    useEffect(() => {
        const fetchCategories = async() => {
            try{
                const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

                const res = await fetch(api_url + `/api/transaction/${businessID}/category`, {
                    method: "GET",
                    credentials: "include",
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
                    <h2 className="text-xl font-bold">Update Transaction</h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>
        
                {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
                )}
                <div className="space-y-3">

                <input
                    value={name}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    value={date}
                    type="date"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setDate(e.target.value)}
                />

                <input
                    value={amount}
                    placeholder="Amount"
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setAmount(Number(e.target.value))}
                />

                <textarea
                    value={description}
                    placeholder="Description (optional)"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex gap-2">
                {["expense", "income"].map((t) => (
                    <button
                    value={type}
                    key={t}
                    onClick={() =>
                        setType(t as TransactionType)
                    }
                    className={`flex-1 py-2 rounded-lg border text-sm transition ${
                        type === t
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
                        value={category}
                        onClick= {() => setCatOpen(!catOpen)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {category?.name || "Select Category"}
                    </button>

                    {catOpen && (
                        <CategoryDropDown
                            categories={categories}
                            onSelect={(cat) => {
                                setCategory(cat);
                                setCatOpen(false);
                                setCategory(cat.uid)
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
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                    {loading ? "Saving..." : "Add Transaction"}
                </button>
                </div>
            </div>
        </div> 
    )
}