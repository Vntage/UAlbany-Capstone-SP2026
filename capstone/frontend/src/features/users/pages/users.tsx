import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar";
import BusinessSwitcher from "../components/BusinessSwitcher";
import CreateBusinessForm from "../components/CreateBusinessForm";

export default function Users() {
  const [showCreate, setShowCreate] = useState(false);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const loadBusiness = () => {
      const stored = localStorage.getItem("activeBusiness");
      if (stored) setBusiness(JSON.parse(stored));
    };

    loadBusiness();

    window.addEventListener("businessChanged", loadBusiness);
    return () => window.removeEventListener("businessChanged", loadBusiness);
  }, []);

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <BusinessSwitcher onCreateClick={() => setShowCreate(true)} />

            <div className="flex gap-3">
              <button className="px-4 py-2 border rounded-lg text-sm bg-white shadow-sm">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm shadow hover:bg-gray-800">
                Invite Member
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">
              {business?.name || "Users & Permissions"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage team access and roles
            </p>
          </div>

          {!business && (
            <div className="text-center py-20 text-gray-400">
              No business selected. Create or select one to continue.
            </div>
          )}

          {business && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value="--" sub="--" />
                <StatCard title="Admins" value="--" sub="--" />
                <StatCard title="Active Now" value="--" sub="--" />
                <StatCard title="Pending Invites" value="--" sub="--" />
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <div className="flex gap-6">
                    <button className="text-sm font-semibold text-black border-b-2 border-black pb-2">
                      All
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-6 py-3 text-left">User</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Email</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-400">
                          No users yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {showCreate && (
        <CreateBusinessForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            window.dispatchEvent(new Event("businessChanged"));
          }}
        />
      )}
    </div>
  );
}

/* Components */
function StatCard({ title, value, sub }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-black mt-1">{sub}</p>
    </div>
  );
}