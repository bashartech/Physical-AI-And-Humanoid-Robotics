
import React, { useState } from "react";
import { createAuthClient } from "better-auth/client";

const client = createAuthClient({
  baseURL: "http://localhost:4000",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await client.signIn.email({
        email,
        password,
      });
      alert("Logged in!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        value={email}
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        value={password}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
