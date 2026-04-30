import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar";
import AdjustTargetsModal from "../components/AdjustTargetsModal";

type Category = {
  uid: string;
  name: string;
  budgeted: number;
  actual?: number;
  variance?: number;
  status?: string;
};

type BudgetSummary = {
  utilization: number;
  runway: number;
};

export default function Budget() {
  const [business, setBusiness] = useState<any>(null);

  const [budget, setBudget] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);

  const [loading, setLoading] = useState(false);

  const [showAdjust, setShowAdjust] = useState(false);
  const [editCategories, setEditCategories] = useState<Category[]>([]);

  const role = localStorage.getItem("role");

  const canEdit = role === "owner" || role === "admin"

  const openAdjustTargets = () => {
  setEditCategories(categories.map(c => ({ ...c })));
  setShowAdjust(true);
  };

  const loadBusiness = () => {
    const stored = localStorage.getItem("activeBusiness");

    if (!stored) {
      setBusiness(null);
      setCategories([]);
      setBudgetSummary(null);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setBusiness(parsed);

      if (parsed?.uid) {
        fetchBudget(parsed.uid);
      }
    } catch (err) {
      console.error("Invalid activeBusiness:", err);
      setBusiness(null);
      setCategories([]);
      setBudgetSummary(null);
    }
  };

  const fetchBudget = async (businessId: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/budget/${businessId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log(data)

      if (res.ok) {
        setCategories(data.categories || []);
        setBudgetSummary(data.summary || null);
        setBudget(data.budget || null)
      } else {
        setCategories([]);
        setBudgetSummary(null);
        setBudget(null);
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
      setBudgetSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();

    window.addEventListener("businessChanged", loadBusiness);

    return () =>
      window.removeEventListener("businessChanged", loadBusiness);
  }, []);

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold">
                Monthly Operating Budget
              </h1>
              <p className="text-sm text-on-surface-variant">
                {business?.name || "No Business Selected"}
              </p>
            </div>

            <div className="flex gap-3">
              {canEdit && (
                <button onClick={openAdjustTargets}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow hover:bg-blue-700 transition">
                  Adjust Targets
                </button>
              )}
            </div>
          </div>

          {!business && (
            <div className="text-center py-20 text-gray-400">
              No business selected. Please create or switch a business.
            </div>
          )}

          {business && (
            <>
              <div className="grid grid-cols-12 gap-6 mb-10">

                <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-semibold text-primary uppercase">
                      Budget Utilization
                    </span>

                    <span className="text-2xl font-bold">
                      {budgetSummary?.utilization ?? "--"}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${budgetSummary?.utilization ?? 0}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs mt-3 text-gray-500">
                    <span>Expended</span>
                    <span>Total</span>
                  </div>
                </div>

                <div className="col-span-4 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
                  <p className="text-sm opacity-80">Available Runway</p>
                  <h2 className="text-3xl font-bold mt-2">
                    ${budgetSummary?.runway ?? "--"}
                  </h2>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                <div className="px-6 py-4 flex justify-between items-center border-b">
                  <h2 className="font-semibold text-lg">
                    Expense Categories
                  </h2>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                      More
                    </button>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-right">Budgeted</th>
                      <th className="px-6 py-4 text-right">Actual</th>
                      <th className="px-6 py-4 text-right">Variance</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          Loading budget...
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-gray-400"
                        >
                          No budget categories yet
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.uid} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {cat.budgeted}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {cat.actual ?? "--"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {cat.variance ?? "--"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
                              {cat.status ?? "OK"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="px-6 py-4 flex justify-between border-t bg-gray-50">
                  <span className="font-semibold">
                    Gross Operating Expenses
                  </span>

                  <div className="flex gap-10 text-sm">
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p className="font-semibold">--</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Actual</p>
                      <p className="font-semibold">--</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Variance</p>
                      <p className="font-semibold">--</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="p-5 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-sm font-medium">Insight message</p>
                </div>

                <div className="p-5 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <p className="text-sm font-medium">Insight message</p>
                </div>

                <div className="p-5 bg-gray-100 border-l-4 border-gray-400 rounded-lg">
                  <p className="text-sm font-medium">Insight message</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      {showAdjust && (
        <AdjustTargetsModal
        isOpen={showAdjust}
        onClose={() => setShowAdjust(false)}
        businessID={business?.uid}
        budget={budget}
        categories={categories}
        onSuccess={() => fetchBudget(business.uid)}
      />)}
    </div>
  );
}