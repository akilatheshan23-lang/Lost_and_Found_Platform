import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

export default function Admin() {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    const [u, c] = await Promise.all([api.get("/admin/users"), api.get("/claims")]);
    setUsers(u.data);
    setClaims(c.data);
  }

  useEffect(() => { load().catch(()=>setErr("Failed to load admin data")); }, []);

  async function decide(id, status) {
    try {
      await api.put(`/claims/${id}/decide`, { status });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Decision failed");
    }
  }

  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h2>Admin Panel</h2>
        {err && <p style={{ color:"#fca5a5" }}>{err}</p>}

        <h3>Claims (Review)</h3>
        {claims.map((c) => (
          <div key={c._id} className="card" style={{ marginTop: 10 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <b>Claim</b>
              <span className="badge">{c.status}</span>
            </div>
            <small>{new Date(c.createdAt).toLocaleString()}</small>
            <div style={{ marginTop: 6 }}>{c.proof}</div>
            {c.status === "PENDING" && (
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn" onClick={()=>decide(c._id, "ACCEPTED")}>Accept</button>
                <button className="btn secondary" onClick={()=>decide(c._id, "REJECTED")}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ width: 420 }}>
        <h3>Users</h3>
        <small>Basic user listing (role/active controls can be added).</small>
        <div style={{ marginTop: 10 }}>
          {users.map((u) => (
            <div key={u._id} className="card" style={{ marginTop: 10 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <b>{u.name}</b>
                <span className="badge">{u.role}</span>
              </div>
              <small>{u.email}</small><br/>
              <small>Active: {String(u.isActive)}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
