
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import type { ChangeEvent, SubmitEvent } from "react";
import { auth } from "../config/firebase"

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
    return(
        <form onSubmit={handleLogin}>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required/>
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
            <button type="submit"> Login </button>
        </form>
    );
}