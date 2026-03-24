import { useState } from "react";
import { signup } from "../../../config/authService";
import { useNavigate } from "react-router-dom";

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
      const user = await signup(email, password);
      const token = await user.user.getIdToken(true);

      const res = await fetch("http://localhost:8080/api/users/signup", {
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
        console.log("Error in server");
      }

      alert("Account created successfully!");
      navigate("/"); // redirect to home
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
            className="cta-gradient text-on-primary font-bold py-3 rounded shadow-ambient hover:brightness-110 transition-all mt-2 text-white"
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