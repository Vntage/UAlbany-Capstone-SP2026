import { useState } from "react";

type Category = {
  uid: string;
  name: string;
  budgeted: number;
  actual?: number;
  variance?: number;
  status?: string;
};

type AdjustTargetsModal = {
    isOpen: boolean;
    onClose: () => void;
    businessID: string;
    budget: any;
    categories: Category[];
    onSuccess: () => void;
}

export default function AdjustTargetsModal({
    isOpen,
    onClose,
    businessID,
    budget,
    categories,
    onSuccess,
}: AdjustTargetsModal) {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");

    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

    if(!isOpen || businessID === "") return;

    const handleCreateBudget = async() => {
        try{
            console.log(periodStart)
            setLoading(true);
            const res = await fetch(`${api_url}/api/budget/${businessID}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    periodStart,
                    periodEnd,
                }),
            });
            if(!res.ok) throw new Error("Failed to create Budget");

            onSuccess();
            onClose();
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    const handleSaveAllocation = async() => {
        try{
            setLoading(true);

            const requests = Object.entries(allocations).map(
                ([categoryID, amount]) => {
                    fetch(`${api_url}/api/budgets/${businessID}/item`,{
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            budgetId: budget.uid, 
                            transactionCategoryId: categoryID, 
                            allocatedAmount: amount,
                        }),
                    })
                }
            );

            await Promise.all(requests);

            onSuccess();
            onClose();
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold">{budget ? "Adjust Targets" : "Create Budget"}</h2>
                <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>

                {!budget ? (
                    <div className="space-y-3">
                        <input
                            placeholder="Budget Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="date"
                            value={periodStart}
                            onChange={(e) => setPeriodStart(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="date"
                            value={periodEnd}
                            onChange={(e) => setPeriodEnd(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleCreateBudget}
                            disabled={loading}
                            className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                        >
                            {loading? "Creating" : "Create Budget"}
                        </button>
                    </div>
                ): (
                    <div className="space-y-4">
                        <div className="max-h-64 overflow-y-auto space-y-3">
                            {categories.map((cat) => (
                                <div key={cat.uid} 
                                className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-medium">{cat.name}</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-32 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) => 
                                            setAllocations((prev)=> ({
                                                ...prev,
                                                [cat.uid]: Number(e.target.value)
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveAllocation}
                            disabled={loading}
                            className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                        >
                            {loading ? "Saving": "Save Targets"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}