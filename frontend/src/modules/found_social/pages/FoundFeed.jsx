import { useEffect, useRef, useState } from "react";
import { apiFoundFeed } from "../api/found.api";
import PostCardFound from "../components/PostCardFound";
import CreateFoundModal from "../components/CreateFoundModal";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

export default function FoundFeed() {
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [filters, setFilters] = useState({ category: "", userType: "", q: "" });

  const sentinelRef = useRef(null);

  async function load(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const params = {
        limit: 8,
        cursor: reset ? null : cursor,
        category: filters.category || undefined,
        userType: filters.userType || undefined,
        q: filters.q || undefined,
      };
      const data = await apiFoundFeed(params);
      setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
      setCursor(data.nextCursor);
    } catch {
      toast.push("Failed to load found feed", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.userType]);

  useEffect(() => {
    const t = setTimeout(() => load(true), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor) load(false);
    });

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, loading]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="card-solid p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">🔎 Found Items</div>
            <div className="text-sm text-slate-500 mt-1">
              Browse approved found items and tap <span className="font-medium">Claim</span> if it’s yours.
            </div>
          </div>

          <button
            onClick={() => (user ? setOpenCreate(true) : toast.push("Login required", "warning"))}
            className="btn-primary"
          >
            ➕ New Found Post
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <select
            className="select w-[180px]"
            value={filters.category}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            <option value="electronics">📱 Electronics</option>
            <option value="documents">📄 Documents</option>
            <option value="accessories">👜 Accessories</option>
            <option value="clothing">👕 Clothing</option>
            <option value="keys">🔑 Keys</option>
            <option value="other">📦 Other</option>
          </select>

          <select
            className="select w-[160px]"
            value={filters.userType}
            onChange={(e) => setFilters((p) => ({ ...p, userType: e.target.value }))}
          >
            <option value="">All Users</option>
            <option value="student">🎓 Students</option>
            <option value="staff">👔 Staff</option>
          </select>

          <input
            className="input flex-1 min-w-[220px]"
            placeholder="Search title/description/location..."
            value={filters.q}
            onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
          />
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="card-solid p-10 text-center text-slate-500">
          No found items yet (or none approved).
        </div>
      ) : null}

      <div className="space-y-4">
        {items.map((it) => (
          <PostCardFound key={it._id} item={it} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" />

      {loading ? <div className="text-center text-slate-500">Loading...</div> : null}

      <CreateFoundModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={() => load(true)} />
    </div>
  );
}
