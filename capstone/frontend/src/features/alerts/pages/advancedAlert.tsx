import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar"

type Business = {
  uid: string;
  name: string;
}

type Expression = 
    | {
        type: "expression";
        operator: "+" | "-" | "*" | "/";
        left: Expression;
        right: Expression;
    }
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


type Condition = {
    left: Expression;
    operator: ">" | ">=" | "<" | "<=" | "=";
    right: Expression;
}

type Category = {
    uid: string,
    name: string;
}

const defaultCondition : Condition = {
    left: {
        type: "metric",
        field: "transaction_total"
    },
    operator: ">",
    right: {
        type: "value",
        value: 1000
    },
}

export default function AdvancedAlert() {
    const business = localStorage.getItem("activeBusiness");
    const businessID: string | null = business && business !== "undefined" ? (JSON.parse(business) as Business).uid : null;
    const [ruleName, setRuleName] = useState("");
    const [condition, setCondition] = useState<Condition>(defaultCondition);
    const [categories, setCategories] = useState<Category[]>([]);

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

    function getConditionType(condition: Condition) {
        if(condition.right.type === "value" || condition.left.type === "value") return "threshold";

        return "comparison"
    }

    const handleCreateAlertRule = async() => {
        setLoading(true)
        try{
            const type = getConditionType(condition);
            const res = await fetch(`${api_url}/api/alert/${businessID}`,{
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: ruleName,
                    condition,
                    type: type
                })
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.message || "Failed to create Alert Rule");
            }
            
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
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
        <div className="flex h-screen bg-surface">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                        <h1 className="text-3xl font-bold">
                            Advanced Alerts
                        </h1>
                        <p className="text-sm text-on-surface-variant mt-1">
                            Create customizable Alerts suited for your Business needs
                        </p>
                        </div>
                    </div>

                    {businessID && (
                        <div>
                            <div>
                                <label>Rule Title</label>
                                <input
                                    value={ruleName}
                                    type="text"
                                    onChange={(e) => setRuleName(e.target.value)}
                                    placeholder="Enter Rule title"
                                />
                            </div>
                            <div>
                                <h2>Alert Condition</h2>
                                <ConditionBuilder value={condition} onChange={setCondition} categories={categories}/>
                            </div>
                            <div>
                                <button
                                    onClick={handleCreateAlertRule}
                                    disabled={loading}
                                >
                                    {loading 
                                    ? "Saving Alert Rule..." 
                                    : "Save Alert"}
                                </button>
                            </div>
                        </div>
                    )
                    }

                </div>
            </main>
        </div> 
    )
}

function ExpressionBuilder({value, onChange, categories} : 
    {value: Expression, onChange: (value: Expression) => void, categories: Category[]})
{
    const expressionOptions = {
        value: {
            type: "value",
            value: 0,
        },
        transaction_total: {
            type: "metric",
            field: "transaction_total",
        },
        budget_total: {
            type: "budget_total"
        },
        category_total: {
            type: "category_total",
            category_id: "",
        },
        budget_item_allocated: {
            type: "budget_item_allocated",
            category_id: "",
        }
    } as const;

    if(value.type === "expression") {
        return(
            <div>
                <ExpressionBuilder
                    value={value.left}
                    onChange={(left: any) => onChange({...value, left})}
                    categories={categories}
                />

                <select
                    value={value.operator}
                    onChange={(e) => onChange({...value, operator: e.target.value as "+" | "-" | "*" | "/"})}
                >
                    <option value={"+"}>+</option>
                    <option value={"-"}>-</option>
                    <option value={"*"}>*</option>
                    <option value={"/"}>/</option>
                </select>

                <ExpressionBuilder
                    value={value.right}
                    onChange={(right: any) => onChange({...value, right})}
                    categories={categories}
                />
            </div>
        );
    }

    return(
        <div>
            <select
                value={getExpressionSelect(value)}
                onChange={(e) => {
                    const selected = expressionOptions[e.target.value as keyof typeof expressionOptions]
                    console.log(selected)
                    onChange(selected)
                }}
            >
                <option value={"value"}>Value</option>
                <option value={"transaction_total"}>Transaction Total</option>
                <option value={"budget_total"}>Budget Total</option>
                <option value={"category_total"}>Category Total</option>
                <option value={"budget_item_allocated"}>Category Budget</option>
            </select>
            {value.type === "value" && (
                <input
                    type="number"
                    value={value.value ?? 0}
                    onChange={(e) => onChange({...value, value: Number(e.target.value)})}
                    placeholder="Enter value"
                />
            )}

            {(value.type === "category_total" || value.type === "budget_item_allocated") && (
                <select
                    value={value.category_id}
                    onChange={(e) => onChange({...value, category_id: e.target.value})}
                >
                    <option value="">Select Category</option>
                    {(categories ?? []).map((category) => (
                        <option
                            key={category.uid}
                            value={category.uid}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            )}

            <button
                onClick={() => onChange({type: "expression", operator: "+", left: value, right: {type: "value", value: 0}})}
            >
                + Operation
            </button>
        </div>
    );
}

function ConditionBuilder({value, onChange, categories} : 
    {value: Condition, onChange: (value: Condition) => void, categories: Category[]}) {
    return(
        <div>
            <ExpressionBuilder
                value={value.left}
                onChange={(left: any) => onChange({...value, left})}
                categories={categories}
            />
            <select
                value={value.operator}
                onChange={(e) => onChange({...value, operator: e.target.value as ">" | ">=" | "<" | "<=" | "="})}    
            >
                <option value={">"}>{">"}</option>
                <option value={">="}>{">="}</option>
                <option value={"<"}>{"<"}</option>
                <option value={"<="}>{"<="}</option>
                <option value={"="}>{"="}</option>
            </select>
            <ExpressionBuilder
                value={value.right}
                onChange={(right: any) => onChange({...value, right})}
                categories={categories}
            />
        </div>
    )
}

function getExpressionSelect(value: any){
    if(value.type === "metric") return "transaction_total";
    return value.type;
}