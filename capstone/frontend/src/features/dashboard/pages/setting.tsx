import Navbar from "../components/navbar";

export default function settings() {
  return (
    <div className="flex h-screen bg-surface">
            <Navbar />

      <h1 className="text-3xl font-bold">Settings</h1>
      <p>Configure your application settings.</p>
    </div>
  );
}