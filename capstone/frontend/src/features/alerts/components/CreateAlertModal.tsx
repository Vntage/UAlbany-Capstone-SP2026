import { useState } from "react";
import { Link } from "react-router-dom";

type Operator = "<" | "<=" | ">" | ">=" | "=";

type Expression =
    | {
        type: "value";
        value: number;
    }
    | {
        type: "metric";
        field: "transaction_total";
    }
    | { type: "budget_total" }
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
}: CreateAlertModal) {
    if (!isOpen) return;

    const [rule, setRule] = useState<SimpleRule>({
        metric: "transaction_total",
        operator: ">",
        value: 0,
        categoryID: categories[0]?.uid || ""
    });
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

    function mapSimpletoCondition(rule: SimpleRule): AlertCondition {
        let left: Expression;

        if (rule.metric === "transaction_total") {
            left = { type: "metric", field: "transaction_total" };
        }
        else {
            left = { type: "budget_total" };
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

    const handleCreateAlertRule = async () => {
        setLoading(true)
        try {
            console.log(mapSimpletoCondition(rule))
            const res = await fetch(`${api_url}/api/alert/${businessID}`, {
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

            if (!res.ok) {
                setError(data.message || "Failed to create Alert Rule");
            }
            onSubmit();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    const uniformStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none mb-2";
    const uniformStyle2 = "text-xs font-semibold text-gray-500 uppercase mb-1";
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Create Alert Rule</h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div className="flex flex-col">
                    <label className={uniformStyle2}>Rule Title</label>
                    <input
                        className={uniformStyle}
                        placeholder="Set title here..."
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={uniformStyle2}>Rule Metric</label>
                            <select
                                className={uniformStyle}
                                onChange={(e) => {
                                    setRule({ ...rule, metric: e.target.value as any })
                                }}
                            >
                                <option value="transaction_total">Transaction Total</option>
                                <option value="budget_total">Budget Total</option>
                                <option value="category_total">Category Total</option>
                            </select>
                        </div>
                        <div>
                            <label className={uniformStyle2}>Rule Operator</label>
                            <select
                                className={uniformStyle}
                                value={rule.operator}
                                onChange={(e) => {
                                    setRule({ ...rule, operator: e.target.value as any })
                                }}
                            >
                                <option value=">">{">"}</option>
                                <option value=">=">{">="}</option>
                                <option value="<">{"<"}</option>
                                <option value="<=">{"<="}</option>
                                <option value="=">{"="}</option>
                            </select>
                        </div>
                    </div>
                    {rule.metric === "category_total" && (
                        <>
                            <label className={uniformStyle2}>Select Category</label>
                            <select
                                className={uniformStyle}
                                value={rule.categoryID}
                                onChange={(e) =>
                                    setRule({ ...rule, categoryID: e.target.value })
                                }
                            >
                                {categories.map((c) => (
                                    <option key={c.uid} value={c.uid}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    <label className={uniformStyle2}>Rule Value</label>
                    <input
                        className={uniformStyle}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={rule.value}
                        onChange={(e) => {
                            setRule({ ...rule, value: Number(e.target.value) })
                        }}
                    />
                    <div className="flex items-center justify-evenly mt-2 mb-4">
                        <label className="text-sm text-gray-500 italic">Need stronger rules?</label>
                        <Link to="/advancedAlerts" className="text-sm text-blue-600 hover:underline font-medium">[ Advanced Rules ]</Link>
                    </div>
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