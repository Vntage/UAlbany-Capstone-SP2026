import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreateBusinessForm({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    currency: "USD",
    createdMonth: "",
    createdYear: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/business", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          currency: form.currency,
          date_month: form.createdMonth || undefined,
          date_year: form.createdYear || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create business");
        return;
      }

      if (data.business) {
        localStorage.setItem(
          "activeBusiness",
          JSON.stringify(data.business)
        );

        // notify entire app
        window.dispatchEvent(new Event("businessChanged"));
      }

      // optional refresh
      if (onSuccess) onSuccess();

      onClose();
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Business</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Business Name"
            value={form.name}
            onChange={handleChange}
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            name="type"
            placeholder="Business Type (e.g. SaaS, Retail)"
            value={form.type}
            onChange={handleChange}
            required
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
          </select>

          <div className="flex gap-3">
            <input
              name="createdMonth"
              placeholder="Month (optional)"
              value={form.createdMonth}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 border rounded-lg"
            />
            <input
              name="createdYear"
              placeholder="Year (optional)"
              value={form.createdYear}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 border rounded-lg"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}