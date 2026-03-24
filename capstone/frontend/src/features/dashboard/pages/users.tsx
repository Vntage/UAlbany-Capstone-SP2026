import Navbar from "../components/navbar";

export default function users() {
  return (
    <div className="flex h-screen bg-surface">
        <Navbar />

      <h1 className="text-3xl font-bold">Users</h1>
      <p>Manage your users here.</p>
    </div>
  );
}