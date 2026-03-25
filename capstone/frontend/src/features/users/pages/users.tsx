import Navbar from "../../../components/navbar";

export default function users() {
  return (
    <div className="flex h-screen bg-surface">
        <Navbar />

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to Users</h1>
        <p className="text-on-surface-variant">
          Users Area
        </p>
      </main>
    </div>
  );
}