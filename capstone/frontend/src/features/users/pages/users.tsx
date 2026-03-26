import Navbar from "../../../components/navbar";

export default function Users() {
  return (
    <div className="flex h-screen bg-surface">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-bold">Users & Permissions</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage team access and roles
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 border rounded-lg text-sm bg-white shadow-sm">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm shadow">
                Invite Member
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Users" value="--" sub="--" />
            <StatCard title="Admins" value="--" sub="--" />
            <StatCard title="Active Now" value="--" sub="--" />
            <StatCard title="Pending Invites" value="--" sub="--" />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            {/* Tabs / Filters */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div className="flex gap-6">
                <button className="text-sm font-semibold text-primary border-b-2 border-primary pb-2">
                  All
                </button>
                <button className="text-sm text-gray-500 hover:text-black">
                  Admins
                </button>
                <button className="text-sm text-gray-500 hover:text-black">
                  Analysts
                </button>
                <button className="text-sm text-gray-500 hover:text-black">
                  Viewers
                </button>
              </div>

              <select className="text-sm border rounded-lg px-3 py-1">
                <option>Name (A-Z)</option>
                <option>Recent Activity</option>
                <option>Role</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Activity</th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No users found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex justify-between items-center text-sm text-gray-500">
              <span>Showing 0 users</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded opacity-50 cursor-not-allowed">1</button>
              </div>
            </div>
          </div>

          {/* Roles Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <InfoCard
              title="Admin"
              description="Full system access, including user management and settings."
            />
            <InfoCard
              title="Analyst"
              description="Can build models and reports but cannot manage users."
            />
            <InfoCard
              title="Viewer"
              description="Read-only access to dashboards and reports."
            />
          </div>

        </div>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, sub }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-primary mt-1">{sub}</p>
    </div>
  );
}

function InfoCard({ title, description }: any) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border">
      <h4 className="text-sm font-bold mb-2">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
