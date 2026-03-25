
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import type { ChangeEvent, SubmitEvent } from "react";
import { auth } from "../../../config/firebase"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate()

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

            const api_url = import.meta.env.VITE_API_URL || "http://localhost:8080"
            //finish api
            const res = await fetch(api_url + "/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token })
            });

            const data = await res.json();
            
            if(!res.ok){
                alert(data.message || "Login unsuccessful");
                return;
            }
            
        alert("Login successful");
        navigate("/dashboard");
          } catch (error: any) {
              // Firebase error or network issue
              
            let msg = "Login failed. Please check your credentials.";
            if (error.code) {

              // Firebase error codes
            switch (error.code) {
                case "auth/user-not-found":
                    msg = "No user found with this email.";
                    break;

                case "auth/wrong-password":
                    msg = "Incorrect password.";
                    break;

                case "auth/invalid-email":
                    msg = "Invalid email address.";
                    break;
            }
        }
        alert(msg);
        console.error(error);
    }
};

    return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-12 w-full max-w-md">
        <h1 className="text-3xl font-headline font-extrabold text-black mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-black">
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
            className="bg-black text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 w-full cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-on-surface-variant mt-6 text-black">
          Don’t have an account?{" "}
          <a href="/signup" className="text-secondary font-bold hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}