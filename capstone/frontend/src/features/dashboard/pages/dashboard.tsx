import Navbar from "../components/navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-surface">
            <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to Your Dashboard</h1>
        <p className="text-on-surface-variant">
          Dashboard Area
        </p>
      </main>
    </div>
  );
}