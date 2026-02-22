import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"

export default function Signup(){
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: ""
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value})
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        const cred = await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
        );

        const token = await cred.user.getIdToken();

        //finish api call
        await fetch("http://localhost:8080/api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username
            })
        });

        //needs to change
        alert("Account created")
    };

    return(
        <form onSubmit={handleSignup}>
            <input name="firstName" placeholder="First Name" onChange={handleChange}/>
            <input name="lastName" placeholder="Last Name" onChange={handleChange}/>
            <input name="username" placeholder="Username" onChange={handleChange}/>
            <input name="email" type="email" placeholder="Email" onChange={handleChange}/>
            <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
            <button type="submit"> Sign Up </button>
        </form>
    )
}