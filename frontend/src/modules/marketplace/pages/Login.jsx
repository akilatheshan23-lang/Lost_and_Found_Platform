import { useState } from "react";
import { apiLogin } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

function pickErrorMessage(err, fallback) {
  const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
  const status = err?.response?.status;
  if (status && typeof msg === "string" && !msg.includes("HTTP")) return `${msg} (HTTP ${status})`;
  return msg;
}

export default function Login() {
  const { setSession, refresh } = useAuth();
  const nav = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiLogin({ email, password });
      setSession(data.token, data.user);
      await refresh();
      toast.push("Logged in ✅", "success");
      nav("/found");
    } catch (e2) {
      toast.push(pickErrorMessage(e2, "Login failed. Check your email/password and backend connection."), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen app-bg">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md card-solid p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">🎓</div>
              <div>
                <div className="text-xl font-bold text-slate-900">Lost & Found Platform</div>
                <div className="text-xs text-slate-500">Login to post & manage items</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold text-slate-900">Welcome back</div>
              <div className="text-sm text-slate-500 mt-1">Sign in to continue</div>
            </div>

            <form className="space-y-3 mt-5" onSubmit={submit}>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input className="input mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input className="input mt-1" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button disabled={busy} className="btn-primary w-full py-3">
                {busy ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="text-sm text-slate-600 mt-4">
              No account? <Link to="/register" className="text-slate-900 font-medium hover:underline">Register</Link>
            </div>

            <div className="mt-6 text-xs text-slate-500">
              Tip: If API requests fail, check backend is running on <span className="font-mono">localhost:5000</span>.
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-lg sidebar rounded-[2rem] p-8 text-white shadow-2xl">
            <div className="text-3xl font-bold">Everything in one place</div>
            <div className="text-white/70 mt-2">
              Report found items, browse the feed, post announcements, and get notified when admin approves.
            </div>

            <div className="mt-8 grid gap-3">
              {[
                ["🔎", "Found feed", "Scroll and claim items like a timeline."],
                ["🗞️", "Social feed", "Announcements, events and updates."],
                ["🔔", "Notifications", "Instant approval/reject updates."],
                ["⚙️", "Admin moderation", "Approve, reject and hide posts."],
              ].map(([icon, t, d]) => (
                <div key={t} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{icon}</div>
                    <div>
                      <div className="font-semibold">{t}</div>
                      <div className="text-sm text-white/70 mt-1">{d}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-xs text-white/60">
              Designed for a clean, modern campus experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
