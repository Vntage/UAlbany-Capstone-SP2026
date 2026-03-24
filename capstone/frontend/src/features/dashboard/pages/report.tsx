import Navbar from "../components/navbar";

export default function report() {
  return (
    <div className="flex h-screen bg-surface">
            <Navbar />

      <h1 className="text-3xl font-bold">Report</h1>
      <p>View financial reports and analytics.</p>
    </div>
  );
}