import { useState } from "react";

type BusinessInviteModal = {
    businessID: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EXPIRE_OPTIONS = [
    { label: "1 Day", value: "1d", ms: 1 * 24 * 60 * 60 * 1000 },
    { label: "3 Day", value: "3d", ms: 3 * 24 * 60 * 60 * 1000 },
    { label: "5 Day", value: "5d", ms: 5 * 24 * 60 * 60 * 1000 },
    { label: "7 Day", value: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
    { label: "2 Weeks", value: "2w", ms: 14 * 24 * 60 * 60 * 1000 },
    { label: "1 Month", value: "1m", ms: 30 * 24 * 60 * 60 * 1000 }
]

const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BusinessInviteModal({
    businessID,
    isOpen,
    onClose,
    onSuccess
}: BusinessInviteModal){
    const[username, setUsername] = useState("");
    const[role, setRole] = useState("member");
    const[expire, setExpire] = useState("7d");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState("");

    if(!isOpen || !businessID) return;

    const handleSubmit = async() => {
        setLoading(true);
        setError("");

        try{
            const selected = EXPIRE_OPTIONS.find((o) => o.value === expire);
            const expiresAt = selected ? new Date(Date.now() + selected.ms).toISOString() : null;

            const checkUser = await fetch(`${api_url}/api/auth/username?username=${encodeURIComponent(username)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const user = await checkUser.json();

            if(user.ok) return; 

            const res = await fetch(`${api_url}/api/business/${businessID}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    role,
                    expiresAt,
                })
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data?.message || "Failed to invite");
            }

            setUsername("");
            setRole("member");
            setExpire("7d");

            onSuccess?.();
            onClose();
        }
        catch(err: any){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className = "bg-white rounded-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Invite User</h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        placeholder="Username"
                        value={username}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={expire}
                        onChange={(e) => setExpire(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >   
                        {EXPIRE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                
                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                        >
                            {loading ? "Saving..." : "Invite User"}
                        </button>
                    </div>
                
                </div>
            </div>
        </div>
    )
}