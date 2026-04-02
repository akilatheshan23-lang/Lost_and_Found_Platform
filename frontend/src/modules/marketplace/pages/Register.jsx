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
        {/* Left */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md card-solid p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">🎓</div>
              <div>
                <div className="text-xl font-bold text-slate-900">Lost & Found Platform</div>
                <div className="text-xs text-slate-500">Create your account</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold text-slate-900">Register</div>
              <div className="text-sm text-slate-500 mt-1">Create an account to publish posts</div>
            </div>

            <form className="space-y-3 mt-5" onSubmit={submit}>
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input className="input mt-1" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input className="input mt-1" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select className="select mt-1" value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="student">🎓 Student</option>
                  <option value="staff">👔 Staff</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input className="input mt-1" placeholder="Min 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button disabled={busy} className="btn-success w-full py-3">
                {busy ? "Creating..." : "Register"}
              </button>
            </form>

            <div className="text-sm text-slate-600 mt-4">
              Already have an account? <Link to="/login" className="text-slate-900 font-medium hover:underline">Login</Link>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center justify-center p-10">
          <div className="w-full max-w-lg sidebar rounded-[2rem] p-8 text-white shadow-2xl">
            <div className="text-3xl font-bold">Welcome 👋</div>
            <div className="text-white/70 mt-2">Get started in seconds. Your posts go through admin approval.</div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="font-semibold">✅ Safe & moderated</div>
                <div className="text-sm text-white/70 mt-1">Admin approves found and social posts before publishing.</div>
              </div>
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="font-semibold">🔔 Notifications</div>
                <div className="text-sm text-white/70 mt-1">Know instantly when your post is approved or rejected.</div>
              </div>
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="font-semibold">📱 Mobile friendly</div>
                <div className="text-sm text-white/70 mt-1">Smooth feed UI with responsive cards and modals.</div>
              </div>
            </div>

            <div className="mt-8 text-xs text-white/60">Lost & Found Platform — v1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
