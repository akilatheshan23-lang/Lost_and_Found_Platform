import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

export default function Profile() {
  const { api, user } = useAuth();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/claims/mine");
      setClaims(res.data);
    })().catch(()=>{});
  }, []);

  return (
    <div className="card">
      <h2>Profile</h2>
      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {user?.role}</p>

      <h3 style={{ marginTop: 14 }}>My Claims</h3>
      {claims.length === 0 ? <small>No claims yet.</small> : claims.map((c) => (
        <div key={c._id} className="card" style={{ marginTop: 10 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <b>Claim</b>
            <span className="badge">{c.status}</span>
          </div>
          <small>{new Date(c.createdAt).toLocaleString()}</small>
          <div style={{ marginTop: 6 }}>{c.proof}</div>
        </div>
      ))}
      <small>Tip: Admin can review claims in Admin panel.</small>
    </div>
  );
}
