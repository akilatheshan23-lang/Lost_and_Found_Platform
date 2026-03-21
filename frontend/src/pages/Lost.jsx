import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

export default function Lost() {
  const { api, token } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ title:"", category:"", location:"", dateTime:"", description:"" });

  async function load() {
    const res = await api.get("/lost");
    setItems(res.data);
  }

  useEffect(() => { load().catch(()=>{}); }, []);

  async function create(e) {
    e.preventDefault();
    if (!token) { setErr("Please login to create a Lost report."); return; }
    setErr("");
    try {
      await api.post("/lost", form);
      setForm({ title:"", category:"", location:"", dateTime:"", description:"" });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Create failed");
    }
  }

  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h2>Lost Reports</h2>
        <small>Lost item reports (search/filter can be added).</small>
        <div style={{ marginTop: 10 }}>
          {items.map((it) => (
            <div key={it._id} className="card" style={{ marginTop: 10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap: 10 }}>
                <b>{it.title}</b>
                <span className="badge">{it.status}</span>
              </div>
              <div><small>{it.category} • {it.location}</small></div>
              <div><small>{new Date(it.dateTime).toLocaleString()}</small></div>
              <div style={{ marginTop: 6 }}>{it.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ width: 360 }}>
        <h3>Add Lost Item</h3>
        {!token && <p style={{ color:"#fca5a5" }}>Login required to create posts.</p>}
        {err && <p style={{ color:"#fca5a5" }}>{err}</p>}
        <form onSubmit={create}>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Category</label>
          <input className="input" value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Last Seen Location</label>
          <input className="input" value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })} />
          <label className="label" style={{ marginTop: 10 }}>Date/Time</label>
          <input className="input" placeholder="2026-02-19T10:30" value={form.dateTime} onChange={(e)=>setForm({ ...form, dateTime: e.target.value })} />
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
