import Navbar from "../components/navbar";

export default function budget() {
  return (
    <div className="flex h-screen bg-surface">
            <Navbar />

      <h1 className="text-3xl font-bold">Budget</h1>
      <p>Track your budgets here.</p>
    </div>
  );
}