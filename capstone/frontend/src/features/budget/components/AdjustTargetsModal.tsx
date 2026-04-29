import { useState } from "react";

type Category = {
  id: string;
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

    if(!isOpen || businessID === "") return;

    const handleCreateBudget = async() => {

    }

    const handleSaveAllocation = async() => {

    }

    return(
        <div>
            <div>
                <div>
                <h2>{budget ? "Adjust Targets" : "Create Budget"}</h2>
                <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>

                {!budget ? (
                    <>
                        <input
                            placeholder="Budget Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="date"
                            value={periodStart}
                            onChange={(e) => setPeriodStart(e.target.value)}
                        />
                        <input
                            type="date"
                            value={periodEnd}
                            onChange={(e) => setPeriodEnd(e.target.value)}
                        />
                        <button
                            onClick={handleCreateBudget}
                            disabled={loading}
                        >
                            {loading? "Creating" : "Create Budget"}
                        </button>
                    </>
                ): (
                    <>
                        <div>
                            {categories.map((cat) => (
                                <div key={cat.uid}>
                                    <span>{cat.name}</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => 
                                            setAllocations((prev)=> ({
                                                ...prev,
                                                [cat.id]: Number(e.target.value)
                                            }))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveAllocation}
                            disabled={loading}
                        >
                            {loading ? "Saving": "Save Targets"}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}