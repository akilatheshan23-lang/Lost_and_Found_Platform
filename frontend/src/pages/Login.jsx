import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const { api, saveSession } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email, password });
      saveSession(res.data.token, res.data.user);
      nav("/found");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h2>Login</h2>
      {err && <p style={{ color: "#fca5a5" }}>{err}</p>}
      <form onSubmit={onSubmit}>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label className="label" style={{ marginTop: 10 }}>Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
