import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form,[e.target.name]: e.target.value})
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const cred = await signInWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            const token = await cred.user.getIdToken();

            //finish api
            const res = await fetch("http://localhost:8080/api/users/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = await res.json();

            localStorage.setItem("user", JSON.stringify(userData))


            alert("Login successful");
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