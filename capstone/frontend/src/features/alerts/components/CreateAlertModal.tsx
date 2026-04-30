import { useState } from "react";

type Operator =  "<" | "<=" | ">" | ">=" | "=" ;    

type Expression = 
    | {
        type: "value"; 
        value: number;
    }
    | {
        type: "metric"; 
        field: "transaction_total";
    }
    | {type: "budget_total"}
    | {
        type: "category_total"; 
        category_id: string;
    }
    | {
        type: "budget_item_allocated";
        category_id: string;
    }
    | {
        type: "expression";
        operator: "*" | "/" | "+" | "-";
        left: Expression;
        right: Expression;
    };

type AlertCondition = {
    left: Expression;
    operator: Operator;
    right: Expression;
};

type SimpleRule = {
    metric: "transaction_total" | "budget_total" | "category_total";
    categoryID?: string;
    operator: "<" | "<=" | ">" | ">=" | "="
    value: number;
}

type CreateAlertModal = {
    isOpen: boolean;
    businessID: string;
    categories: any[];
    onSubmit: () => void;
    onClose: () => void;
}

export function CreateAlertModal({ 
    isOpen,
    businessID,
    categories, 
    onSubmit,
    onClose
}: CreateAlertModal){
    if(!isOpen) return;

    const [rule, setRule] = useState<SimpleRule>({
        metric: "transaction_total",
        operator: ">",
        value: 0
    });
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

    function mapSimpletoCondition(rule: SimpleRule): AlertCondition {
        let left: Expression;

        if(rule.metric === "transaction_total"){
            left = {type: "metric", field: "transaction_total"};
        }
        else if(rule.metric === "budget_total"){
            left = {type: "budget_total"};
        }
        else{
            left = 
            {
                type: "category_total",
                category_id: rule.categoryID || ""
            };
        }   

        return {
            left,
            operator: rule.operator,
            right: 
            {
                type: "value",
                value: rule.value
            }
        }
    }

    const handleCreateAlertRule = async() => {
        setLoading(true)
        try{
            console.log(mapSimpletoCondition(rule))
            const res = await fetch(`${api_url}/api/alert/${businessID}`,{
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    condition: mapSimpletoCondition(rule),
                    type: "threshold"
                })
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.message || "Failed to create Alert Rule");
            }
            onSubmit();
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }


    return(
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className = "bg-white rounded-2xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Create Alert Rule</h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>
                {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
                )}

                <div>
                    <input
                        placeholder="Set Title"
                        value={title}
                        onChange={(e) => {setTitle(e.target.value)}}
                    />
                    <select
                        onChange={(e) => {
                            setRule({ ...rule, metric: e.target.value as any})
                        }}
                    >
                        <option value="transaction_total">Transaction Total</option>
                        <option value="budget_total">Budget Total</option>
                        <option value="category_total">Category Total</option>
                    </select>

                    {rule.metric === "category_total" && (
                        <select
                            onChange={(e) => 
                                setRule({ ...rule, categoryID: e.target.value})
                            }
                        >
                            {categories.map((c) => (
                                <option key={c.uid} value={c.uid}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        onChange={(e) => {
                            setRule({ ...rule, operator: e.target.value as any})
                        }}
                    >
                        <option value=">">{">"}</option>
                        <option value=">=">{">="}</option>
                        <option value="<">{"<"}</option>
                        <option value="<=">{"<="}</option>
                        <option value="=">{"="}</option>
                    </select>

                    <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                            setRule({ ...rule, value: Number(e.target.value)})
                        }}
                    />
                    <button 
                        onClick={() => handleCreateAlertRule()}
                        disabled={loading}
                        className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                    >
                        {loading ? "Saving..." : "Create Alert"}
                    </button>
                </div>
            </div>
        </div>
    )
}