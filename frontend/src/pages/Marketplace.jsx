import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

export default function Marketplace() {
  const { api, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ title:"", category:"", price:"", condition:"", description:"" });

  async function load() {
    const res = await api.get("/marketplace");
    setListings(res.data);
  }

  useEffect(() => { load().catch(()=>{}); }, []);

  async function create(e) {
    e.preventDefault();
    if (!token) { setErr("Please login to create a listing."); return; }
    setErr("");
    try {
      await api.post("/marketplace", form);
      setForm({ title:"", category:"", price:"", condition:"", description:"" });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Create failed");
    }
  }

  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h2>Marketplace</h2>
        <small>Campus buy/sell listings (basic).</small>
        <div style={{ marginTop: 10 }}>
          {listings.map((l) => (
            <div key={l._id} className="card" style={{ marginTop: 10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap: 10 }}>
                <b>{l.title}</b>
                <span className="badge">{l.status}</span>
              </div>
              <div><small>{l.category} • {l.condition}</small></div>
              <div><b>Rs. {l.price}</b></div>
              <div style={{ marginTop: 6 }}>{l.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ width: 360 }}>
        <h3>Create Listing</h3>
        {!token && <p style={{ color:"#fca5a5" }}>Login required to create listings.</p>}
        {err && <p style={{ color:"#fca5a5" }}>{err}</p>}
        <form onSubmit={create}>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Category</label>
          <input className="input" value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Price</label>
          <input className="input" value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Condition</label>
          <input className="input" value={form.condition} onChange={(e)=>setForm({ ...form, condition: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Description</label>
          <textarea className="input" rows="4" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
