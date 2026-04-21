import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import api from '../../api'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { Box, ClipboardList, Loader2, LogOut, SearchCheck, ShoppingBag, UserCircle2 } from 'lucide-react'

function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.name || 'Student'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Profile Maturity Calculation
  let maturityScore = 0;
  if (user?.name) maturityScore += 20;
  if (user?.email) maturityScore += 20;
  if (user?.studentID) maturityScore += 20;
  if (user?.contactNumber) maturityScore += 20;
  if (user?.mfaEnabled) maturityScore += 20;

  const getStatusStyle = (status) => {
    if (status.includes('Search') || status.includes('Pending')) return 'bg-amber-100 text-amber-800 border bg-amber-50 border-amber-200';
    if (status.includes('Match') || status.includes('Approved')) return 'bg-emerald-100 text-emerald-800 border bg-emerald-50 border-emerald-200';
    return 'bg-blue-100 text-blue-800 border bg-blue-50 border-blue-200';
  };

  const [recentActivity, setRecentActivity] = useState([])
  const [loadingActivity, setLoadingActivity] = useState(true)
  const [counts, setCounts] = useState({ lost: 0, found: 0 })

  const quickStats = [
    { label: 'Lost Posts', value: counts.lost, tone: 'indigo' },
    { label: 'Found Posts', value: counts.found, tone: 'teal' },
    { label: 'Items Returned', value: 1, tone: 'mint' },
    { label: 'Marketplace Posts', value: 3, tone: 'amber' },
  ]

  useEffect(() => {
    let mounted = true;
    if (!user?.email) return;

    const fetchMyActivities = async () => {
      try {
        setLoadingActivity(true);
        // Fetch all items in lightweight mode to properly calculate stat numbers
        const [lostRes, foundRes] = await Promise.all([
          api.get(`/api/lost?createdBy=${user._id}&limit=1000`).catch(() => ({ data: [] })),
          api.get(`/api/found?byUser=${user._id}&limit=1000&lean=true`).catch(() => ({ data: { items: [] } }))
        ]);

        const lostItems = Array.isArray(lostRes.data) ? lostRes.data : [];
        const foundItems = Array.isArray(foundRes.data?.items) ? foundRes.data.items : [];

        // Filter explicitly by logged in user email or User ID fallback
        const myLost = lostItems.filter(item =>
          (item.userEmail || '').toLowerCase() === (user.email || '').toLowerCase() ||
          String(item.createdBy) === String(user._id)
        ).map(item => ({
          title: item.itemName,
          status: item.status || 'Pending',
          time: new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'Lost Item',
          original: item
        }));

        const myFound = foundItems.filter(item =>
          (item.userEmail || '').toLowerCase() === (user.email || '').toLowerCase() ||
          String(item.createdBy) === String(user._id)
        ).map(item => ({
          title: item.title || item.itemName || 'Untitled Found Item',
          status: item.status || 'Pending Review',
          time: new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'Found Item',
          original: item
        }));

        if (mounted) {
          setCounts({ lost: myLost.length, found: myFound.length });
          
          const combined = [...myLost, ...myFound].sort((a, b) => new Date(b.original.createdAt || 0) - new Date(a.original.createdAt || 0));
          setRecentActivity(combined.slice(0, 5)); // keep it clean with top 5
          setLoadingActivity(false);
        }
      } catch (err) {
        console.error('Failed fetching activities', err);
        if (mounted) setLoadingActivity(false);
      }
    };

    fetchMyActivities();

    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">

        <section className="surface p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up border-t-4 border-t-teal-600">
          <div className="flex items-center gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=0f766e&color=fff&size=128&bold=true`}
              alt={userName}
              className="h-14 w-14 rounded-full border-2 border-white shadow-md"
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
              <strong className="text-lg text-slate-900">{userName}</strong>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${maturityScore === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${maturityScore}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{maturityScore}% Profile</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1" to={user?._id ? `/users/${user._id}` : '/user-dashboard'}>
              <UserCircle2 size={14} />
              See Profile
            </Link>
            <button className="btn btn-secondary inline-flex items-center gap-2" type="button" onClick={handleLogout}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </section>

        <header className="surface bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between animate-fade-up-delay-1">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-200">Student Workspace</p>
            <h1 className="mt-1 text-3xl font-bold">Welcome back, {userName}</h1>
            <p className="mt-2 text-slate-200">Track your lost and found activity and manage marketplace posts in one place.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/lost" className="btn bg-white text-slate-900 hover:bg-slate-100 inline-flex items-center gap-2"><SearchCheck size={15} />Report Lost</Link>
            <Link to="/found" className="btn bg-teal-100 text-teal-800 hover:bg-teal-200 inline-flex items-center gap-2"><Box size={15} />Report Found</Link>
            <Link to="/marketplace" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20 inline-flex items-center gap-2"><ShoppingBag size={15} />Marketplace</Link>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up-delay-2">
          {quickStats.map((stat) => (
            <article className="surface p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden" key={stat.label}>
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 bg-${stat.tone}-500 group-hover:scale-150 transition-transform duration-500`}></div>
              <p className="text-sm font-medium text-slate-500 relative z-10">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-2 relative z-10">
                <h2 className="text-4xl font-bold text-slate-900">{stat.value}</h2>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2 animate-fade-up-delay-3">

          <article className="surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
              <button className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"><ClipboardList size={14} />View All</button>
            </div>

            <ul className="space-y-3">
              {loadingActivity ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" /></div>
              ) : recentActivity.length === 0 ? (
                <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-medium text-sm mb-1">No active reports found.</p>
                  <Link to="/lost" className="text-xs text-indigo-600 font-bold hover:underline">Report your first item →</Link>
                </div>
              ) : (
                recentActivity.map((item, idx) => (
                  <li key={idx} className="rounded-xl border border-slate-100 p-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider items-center gap-1 shadow-sm ${getStatusStyle(item.status)}`}>
                          <Loader2 size={10} className={item.status.includes('Search') || item.status.includes('Pending') ? 'animate-spin' : ''} />
                          {item.status}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.type === 'Lost Item' ? 'text-amber-500' : 'text-emerald-500'}`}>• {item.type}</span>
                      </div>
                    </div>

                    <time className="text-xs font-medium text-slate-500 text-right max-w-[80px]">{item.time}</time>
                  </li>
                ))
              )}
            </ul>
          </article>

          <article className="surface p-6">
            <h3 className="text-xl font-semibold text-slate-900">Quick Actions</h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/lost" className="btn btn-secondary w-full justify-start">
                Post Lost Item
              </Link>

              <Link to="/found" className="btn btn-secondary w-full justify-start">
                Post Found Item
              </Link>

              <Link to="/marketplace" className="btn btn-secondary w-full justify-start">
                Open Marketplace
              </Link>

              <Link to="/claims" className="btn btn-secondary w-full justify-start">
                My Reports
              </Link>
            </div>
          </article>

        </section>

      </div>

      <Footer />

    </div>
  )
}

export default UserDashboard