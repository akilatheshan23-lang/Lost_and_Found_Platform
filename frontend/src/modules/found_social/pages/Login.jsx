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
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md card-solid premium-glow border-white/90 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg">🎓</div>
              <div>
                <div className="text-xl font-bold text-slate-900">Lost &amp; Found Platform</div>
                <div className="text-xs text-slate-500">Premium sign in experience</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-bold text-slate-900">Welcome back</div>
              <div className="mt-1 text-sm text-slate-500">Sign in to manage found items and social posts.</div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input className="input mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input className="input mt-1" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button disabled={busy} className="btn-primary w-full py-3.5">
                {busy ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600">
              No account? <Link to="/register" className="font-semibold text-indigo-700 hover:underline">Register</Link>
            </div>

            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs text-slate-600">
              Tip: If API requests fail, check backend is running on <span className="font-mono text-slate-800">localhost:5000</span>.
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-lg sidebar rounded-[2rem] p-8 text-white shadow-2xl">
            <div className="text-3xl font-bold">Everything in one place</div>
            <div className="mt-2 text-white/70">
              Report found items, browse the feed, share announcements, and get instant moderation updates.
            </div>

            <div className="mt-8 grid gap-3">
              {[
                ["🔎", "Found feed", "A polished feed for all approved found items."],
                ["🗞️", "Social feed", "Announcements, events and important updates."],
                ["🔔", "Notifications", "Instant approval or rejection alerts."],
                ["⚙️", "Admin moderation", "Approve, reject and hide posts with ease."],
              ].map(([icon, t, d]) => (
                <div key={t} className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{icon}</div>
                    <div>
                      <div className="font-semibold">{t}</div>
                      <div className="mt-1 text-sm text-white/70">{d}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-xs text-white/60">Premium campus UI with smoother gradients and glass cards.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
