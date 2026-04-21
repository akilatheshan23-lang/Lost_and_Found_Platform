import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ClipboardList, MessageSquare, Store, MessageCircleQuestion, Bell, ChevronRight, CheckCircle2, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import api from "../api";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";

const ActionButton = ({ to, icon: Icon, title, description, badge }) => (
  <Link
    to={to}
    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl surface p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-200/60 bg-white"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
      <Icon size={120} />
    </div>

    <div>
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-sm ring-1 ring-teal-100/50 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
        <Icon size={28} />
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
        {title}
        {badge && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
            {badge}
          </span>
        )}
      </h3>
      <p className="text-sm font-medium text-slate-600 leading-relaxed">{description}</p>
    </div>

    <div className="mt-8 flex items-center text-sm font-semibold text-teal-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      Explore <ChevronRight size={16} className="ml-1" />
    </div>
  </Link>
);

const ActivityItem = ({ title, status, time, type }) => {
  const isMatched = status === "Matched";
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${type === 'lost' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
        {type === 'lost' ? <Search size={18} /> : <MapPin size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{time}</p>
      </div>
      {isMatched ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={12} /> {status}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          <Search size={12} className="opacity-70" /> {status}
        </span>
      )}
    </div>
  );
};

const QuickStat = ({ label, value }) => (
  <div className="surface flex flex-col p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
  </div>
);

const HomeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "Student";
  const userInitial = userName.charAt(0).toUpperCase();

  const [stats, setStats] = useState({
    lost: 0,
    found: 0,
    resolved: 0,
    marketplace: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [lostRes, foundRes, claimsRes, marketRes] = await Promise.all([
          api.get(`/api/lost?createdBy=${user._id}&limit=1000`).catch(() => ({ data: [] })),
          api.get(`/api/found?byUser=${user._id}&limit=1000&lean=true`).catch(() => ({ data: { items: [] } })),
          api.get(`/api/claims`).catch(() => ({ data: [] })),
          api.get(`/api/marketplace?seller=${user._id}`).catch(() => ({ data: [] }))
        ]);

        const lostItems = Array.isArray(lostRes.data) ? lostRes.data : [];
        const foundItems = Array.isArray(foundRes.data?.items) ? foundRes.data.items : [];
        const claims = Array.isArray(claimsRes.data) ? claimsRes.data : [];
        const marketItems = Array.isArray(marketRes.data) ? marketRes.data : [];

        if (mounted) {
          const lostCount = lostItems.length;
          const foundCount = foundItems.length;
          const resolvedClaims = claims.filter(c => c.status === 'collected').length;

          setStats({
            lost: lostCount,
            found: foundCount,
            resolved: resolvedClaims,
            marketplace: marketItems.length
          });

          // Prepare activity items
          const activities = [
            ...lostItems.map(i => ({
              title: `Lost: ${i.itemName}`,
              status: i.status.charAt(0).toUpperCase() + i.status.slice(1),
              time: i.createdAt,
              type: 'lost'
            })),
            ...foundItems.map(i => ({
              title: `Found: ${i.title}`,
              status: i.status.charAt(0).toUpperCase() + i.status.slice(1),
              time: i.createdAt,
              type: 'found'
            }))
          ].sort((a, b) => new Date(b.time) - new Date(a.time));

          setRecentActivity(activities.slice(0, 5));
          setLoading(false);
        }
      } catch (err) {
        console.error('HomeDashboard data fetch error:', err);
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [user]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans">
      <Nav />

      {/* Background Decor Layer (Subtle) */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-teal-50/50 to-transparent pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">

        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white border border-slate-200/60 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Student Workspace
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Welcome back, <span className="text-teal-600">{userName}</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl font-medium">
              What do you need today? Seamlessly navigate through the campus ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200/60 text-slate-500 hover:text-slate-700 hover:shadow-md transition">
              <Bell size={20} />
            </button>
            <Link to={`/users/${user?._id || ''}`} className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-200/60 hover:shadow-md transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                {userInitial}
              </div>
              <span className="text-sm font-semibold text-slate-700">Profile</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-slate-200/60 hover:shadow-md transition text-rose-600 hover:bg-rose-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold text-sm">
                <LogOut size={16} />
              </div>
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <QuickStat label="Lost Items" value={loading ? "..." : stats.lost} />
          <QuickStat label="Found Items" value={loading ? "..." : stats.found} />
          <QuickStat label="Resolved Claims" value={loading ? "..." : stats.resolved} />
          <QuickStat label="Marketplace Ads" value={loading ? "..." : stats.marketplace} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Main Actions Grid (Takes up 2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Core Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <ActionButton
                to="/lost"
                icon={Search}
                title="Lost Items"
                description="Report and browse items you have lost on campus."
              />
              <ActionButton
                to="/found"
                icon={MapPin}
                title="Found Items"
                description="Browse items found by the community or report one."
              />
              <ActionButton
                to="/claims"
                icon={ClipboardList}
                title="Claims"
                description="Manage your claims for found items and verify ownership."
                badge="1 Update"
              />
              <ActionButton
                to="/marketplace"
                icon={Store}
                title="Marketplace"
                description="Discover, buy, and sell electronics, books and more safely."
              />
              <ActionButton
                to="/social"
                icon={MessageSquare}
                title="Social Feed"
                description="Connect, discuss, and interact with the campus network."
              />
              <ActionButton
                to="/feedback"
                icon={MessageCircleQuestion}
                title="Feedback"
                description="Share your claims feedback & thoughts with admins."
              />
            </div>
          </div>

          {/* Right Sidebar: Recent Activity & Quick Links */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="surface bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10" />
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                Recent Activity
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Live</span>
              </h2>
              <div className="space-y-1">
                {loading ? (
                  <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <ActivityItem
                      key={idx}
                      title={activity.title}
                      status={activity.status}
                      time={getTimeAgo(activity.time)}
                      type={activity.type}
                    />
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400 text-sm italic">No recent activity.</p>
                )}
              </div>
              <button className="mt-6 w-full py-2.5 rounded-xl bg-slate-50 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                View Full Timeline
              </button>
            </div>

            <div className="surface bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 shadow-md text-white">
              <h2 className="text-lg font-bold mb-2">Need Help?</h2>
              <p className="text-sm text-slate-300 mb-6 font-medium">
                Browse our FAQ or contact campus support directly from here.
              </p>
              <div className="space-y-3">
                <Link to="/faq" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition group">
                  <span className="text-sm font-medium">Read FAQ</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition" />
                </Link>
                <Link to="/contact" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition group">
                  <span className="text-sm font-medium">Contact Support</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomeDashboard;
