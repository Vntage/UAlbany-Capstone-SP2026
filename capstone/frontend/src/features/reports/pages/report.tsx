import Navbar from "../../../components/navbar";

export default function report() {
  return (
    <div className="flex h-screen bg-surface">
            <Navbar />

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to Reports</h1>
        <p className="text-on-surface-variant">
          Reports Area
        </p>
      </main>
    </div>
  );
}