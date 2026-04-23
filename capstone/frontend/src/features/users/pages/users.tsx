import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar";
import BusinessSwitcher from "../components/BusinessSwitcher";
import CreateBusinessForm from "../components/CreateBusinessForm";

type User = {
  firebase_uid: string;
  first_name: string;
  last_name: string;
  username?: string;
  role?: string;
};

export default function Users() {
  const [showCreate, setShowCreate] = useState(false);
  const [business, setBusiness] = useState<any>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async (businessID: string) => {
    try {
      setLoadingUsers(true);

      const res = await fetch(
        `http://localhost:8080/api/business/${businessID}/member`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        console.error(data.message);
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadBusiness = () => {
    const stored = localStorage.getItem("activeBusiness");

    if (!stored) {
      setBusiness(null);
      setUsers([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setBusiness(parsed);

      if (parsed?.uid) {
        fetchUsers(parsed.uid);
      }
    } catch (err) {
      console.error("Invalid activeBusiness:", err);
      setBusiness(null);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadBusiness();

    window.addEventListener("businessChanged", loadBusiness);
    return () =>
      window.removeEventListener("businessChanged", loadBusiness);
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!business?.uid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/business/${business.uid}/member/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        console.error("Failed to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.firebase_uid === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const currentUserRole = "owner";
  const canEditRoles =
    currentUserRole === "owner" || currentUserRole === "admin";

  const totalUsers = users.length;
  const admins = users.filter(
    (u) => u.role === "admin" || u.role === "owner"
  ).length;

  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-8">
            <BusinessSwitcher onCreateClick={() => setShowCreate(true)} />

            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm shadow hover:bg-gray-800">
              Invite Member
            </button>
          </div>

          {/* HEADER */}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" value={totalUsers} sub="Members" />
                <StatCard title="Admins" value={admins} sub="Elevated Access" />
                <StatCard title="Active Now" value="--" sub="Coming Soon" />
                <StatCard title="Pending Invites" value="--" sub="Coming Soon" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <span className="text-sm font-semibold">All Users</span>
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
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={3} className="text-center py-10 text-gray-400">
                            Loading users...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-10 text-gray-400">
                            No users yet
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.firebase_uid}>

                            {/* NAME */}
                            <td className="px-6 py-4">
                              {user.first_name} {user.last_name}
                            </td>

                            {/* ROLE */}
                            <td className="px-6 py-4">
                              {canEditRoles ? (
                                <select
                                  value={user.role || "member"}
                                  onChange={(e) =>
                                    updateUserRole(
                                      user.firebase_uid,
                                      e.target.value
                                    )
                                  }
                                  className="
                                    border rounded-lg px-2 py-1 text-sm
                                    bg-white hover:border-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                  "
                                >
                                  <option value="member">Member</option>
                                  <option value="admin">Admin</option>
                                  <option value="owner">Owner</option>
                                </select>
                              ) : (
                                <span className="capitalize">
                                  {user.role || "member"}
                                </span>
                              )}
                            </td>

                            {/* EMAIL */}
                            <td className="px-6 py-4">
                              {user.username || "—"}
                            </td>

                          </tr>
                        ))
                      )}

                    </tbody>
                  </table>
                </div>

              </div>
            </>
          )}

        </div>
      </main>

      {/* CREATE BUSINESS MODAL */}
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

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-black mt-1">{sub}</p>
    </div>
  );
}