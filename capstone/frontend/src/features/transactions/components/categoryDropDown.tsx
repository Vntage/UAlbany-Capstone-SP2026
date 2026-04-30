import { useState } from "react";
type TransactionCategory = {
    uid: string;
    name: string;
}

type Props = {
  categories: TransactionCategory[];
  onSelect: (cat: TransactionCategory) => void;
  creating: boolean;
  setCreating: (v: boolean) => void;
  newCategory: string;
  setNewCategory: (v: string) => void;
  businessID: string;
  refreshCategories: React.Dispatch<React.SetStateAction<TransactionCategory[]>>;
};


export function CategoryDropDown({
    categories, 
    onSelect,
    creating,
    setCreating,
    newCategory,
    setNewCategory,
    businessID,
    refreshCategories
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateCategory = async () => {
        if (!newCategory || isSubmitting) return;
        setIsSubmitting(true);
        const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

        // 1. Create temp category (optimistic UI)
        const tempId = `temp-${Date.now()}`;

        const optimisticCategory = {
            uid: tempId,
            name: newCategory,
        };

        refreshCategories((prev: any[]) => [...prev, optimisticCategory]);

        setNewCategory("");
        setCreating(false);
        

        try {
            
            // 2. Send request
            const res = await fetch(api_url + `/api/transaction/${businessID}/category`,{
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: optimisticCategory.name }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error("Failed");

            // 3. Replace temp with real category
            refreshCategories((prev: any[]) =>
            prev.map((cat) =>
                cat.uid === tempId ? data : cat
            ));


        } catch (err) {
            // 4. Rollback on error
            refreshCategories((prev: any[]) =>
            prev.filter((cat) => cat.uid !== tempId)
            );

            console.error("Category creation failed:", err);
        }
        finally{
            setIsSubmitting(false)
        }
    };
    return(
        <div className="relative">
            <ul className="py-2 max-h-60 overflow-auto">

                {/* Category List */}
                {categories.map((cat) => (
                    <li key={cat.uid}>
                        <button
                            onClick={() => onSelect(cat)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                            {cat.name}
                        </button>
                    </li>
                ))}

                {/* Divider */}
                <li className="border-t mt-2 pt-2 px-2">

                {!creating ? (
                    <button
                        onClick={() => setCreating(true)}
                        className="w-full text-left px-2 py-2 text-sky-600 hover:bg-gray-100 font-semibold"
                    >
                    + Create Category
                    </button>
                ) : (
                    <div className="flex gap-2 p-2">
                        <input
                            autoFocus
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category"
                            className="flex-1 border p-1 rounded text-sm"
                        />

                        <button
                            onClick={handleCreateCategory}
                            disabled={isSubmitting}
                            className="px-2 bg-blue-600 text-white rounded text-sm"
                        >
                            Add
                        </button>

                        <button
                            onClick={() => setCreating(false)}
                            className="px-2 text-gray-500"
                        >
                            ✕
                        </button>
                    </div>
                )}

                </li>
            </ul>
        </div>
    )
}