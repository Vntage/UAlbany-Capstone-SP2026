import { useState } from "react";
import { signup } from "../../../config/authService";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth"

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const params = new URLSearchParams();

      params.append("username", username);

      const usernameCheck = await fetch(api_url + `/api/auth/username?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if(!usernameCheck.ok){
        alert("Username Taken")
        return;
      }

      const user = await signup(email, password);
      const token = await user.user.getIdToken(true);
      const res = await fetch(api_url + "/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: token,
          username: username,
          firstName: firstName,
          lastName: lastName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Signup failed");
        return;
      }

      const login = await fetch(api_url + "/api/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token })
      });

      const data = await login.json();
      
      if(!login.ok){
          alert(data.message || "Login unsuccessful");
          return;
      }

      navigate("/dashboard");

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-12 w-full max-w-md text-black">
        <h1 className="text-3xl font-headline font-extrabold text-primary mb-6 text-center">
          Create an Account
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            type="submit"
            className="bg-black text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 w-full cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-on-surface-variant mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-secondary font-bold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}