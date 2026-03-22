import { useState } from "react";
import { signup } from "../config/authService";
import { useNavigate } from "react-router-dom";

const signupForm = () => {
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
        headers: {
          'Content-Type' : "application/json"
        },
        body: JSON.stringify({
          idToken: token,
          username: username,
          firstName: firstName,
          lastName: lastName,
        })
      });

      if(!res.ok){
        console.log("Error in server");
      }
      alert("Account created successfully!");
      navigate("/"); // redirect to home
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="signup-form">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default signupForm;