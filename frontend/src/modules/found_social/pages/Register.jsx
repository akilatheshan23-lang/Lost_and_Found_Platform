import { useState } from "react";
import { apiRegister } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

function pickErrorMessage(err, fallback) {
  const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
  const status = err?.response?.status;
  if (status && typeof msg === "string" && !msg.includes("HTTP")) return `${msg} (HTTP ${status})`;
  return msg;
}

export default function Register() {
  const { setSession, refresh } = useAuth();
  const nav = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("student");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiRegister({ name, email, password, userType });
      setSession(data.token, data.user);
      await refresh();
      toast.push("Registered ✅", "success");
      nav("/found");
    } catch (e2) {
      toast.push(
        pickErrorMessage(
          e2,
          "Register failed. Ensure backend is running and the email is not already used."
        ),
        "error"
      );
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg">🎓</div>
              <div>
                <div className="text-xl font-bold text-slate-900">Lost &amp; Found Platform</div>
                <div className="text-xs text-slate-500">Create your premium account</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-bold text-slate-900">Register</div>
              <div className="mt-1 text-sm text-slate-500">Create an account to publish and manage posts.</div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input className="input mt-1" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input className="input mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select className="select mt-1" value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="student">🎓 Student</option>
                  <option value="staff">👔 Staff</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input className="input mt-1" placeholder="Min 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button disabled={busy} className="btn-success w-full py-3.5">
                {busy ? "Creating..." : "Register"}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-semibold text-indigo-700 hover:underline">Login</Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-lg sidebar rounded-[2rem] p-8 text-white shadow-2xl">
            <div className="text-3xl font-bold">Welcome 👋</div>
            <div className="mt-2 text-white/70">Start with a polished premium UI. All new posts still go through admin approval.</div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="font-semibold">✅ Safe &amp; moderated</div>
                <div className="mt-1 text-sm text-white/70">Admin approves found and social posts before publishing.</div>
              </div>
              <div className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="font-semibold">🔔 Notifications</div>
                <div className="mt-1 text-sm text-white/70">Know instantly when your post is approved or rejected.</div>
              </div>
              <div className="rounded-2xl bg-white/7 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <div className="font-semibold">📱 Mobile friendly</div>
                <div className="mt-1 text-sm text-white/70">Smooth, premium cards and responsive modals.</div>
              </div>
            </div>

            <div className="mt-8 text-xs text-white/60">Lost &amp; Found Platform — Premium refresh</div>
          </div>
        </div>
      </div>
    </div>
  );
}
