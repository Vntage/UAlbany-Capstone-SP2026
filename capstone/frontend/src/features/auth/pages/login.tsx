
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import type { ChangeEvent, SubmitEvent } from "react";
import { auth } from "../../../config/firebase"

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form,[e.target.name]: e.target.value})
    }

    const handleLogin = async (e: SubmitEvent) => {
        e.preventDefault();

        try{
            const cred = await signInWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            const token = await cred.user.getIdToken();

            //finish api
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token })
            });

            if(res.ok){
                alert("Login successful");
            }
            else{
                console.log(await res.json())
            }
        }
        catch(error){
            console.log(error)
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-12 w-full max-w-md">
        <h1 className="text-3xl font-headline font-extrabold text-primary mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <button
            type="submit"
            className="cta-gradient text-on-primary font-bold py-3 rounded shadow-ambient hover:brightness-110 transition-all mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-on-surface-variant mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-secondary font-bold hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}