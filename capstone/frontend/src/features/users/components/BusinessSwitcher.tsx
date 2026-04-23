import { useState, useEffect } from "react";

type Business = {
  uid: string;
  name: string;
};

type Props = {
  onCreateClick: () => void;
};

export default function BusinessSwitcher({ onCreateClick }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [open, setOpen] = useState(false);

  const fetchBusinesses = async () => {
    const res = await fetch("http://localhost:8080/api/business", {
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setBusinesses(data);

      const stored = localStorage.getItem("activeBusiness");

    if (stored) {
      const parsed = JSON.parse(stored);

      const exists = data.find((b: Business) => b.uid === parsed.uid);

      if (exists) {
        setActiveBusiness(parsed);
        return; // stop here if valid
      }
    }

    // fallback if invalid or doesn't exist
    if (data.length > 0) {
      setActiveBusiness(data[0]);
      localStorage.setItem("activeBusiness", JSON.stringify(data[0]));
    } else {
      setActiveBusiness(null);
      localStorage.removeItem("activeBusiness");
    }
  }};

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSelect = (biz: Business) => {
    setActiveBusiness(biz);
    localStorage.setItem("activeBusiness", JSON.stringify(biz));
    window.dispatchEvent(new Event("businessChanged"));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white border px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
      >
        <span className="font-semibold">
          {activeBusiness?.name || "Select Business"}
        </span>
        <span>▼</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
          <ul className="py-2">
            {businesses.map((biz) => (
              <li key={biz.uid}>
                <button
                  onClick={() => handleSelect(biz)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {biz.name}
                </button>
              </li>
            ))}

            <li className="border-t mt-2 pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  onCreateClick();
                }}
                className="w-full text-left px-4 py-2 text-sky-600 hover:bg-gray-100 font-semibold"
              >
                + Create Business
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}