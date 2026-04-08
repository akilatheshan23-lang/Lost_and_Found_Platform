import React, { useEffect, useState } from 'react'
import { AlertTriangle, ClipboardCheck, LoaderCircle, Siren, UserRoundSearch, LogOut, Users, PackageSearch, MessageSquareWarning, Store, ChevronRight, Activity, Clock } from 'lucide-react'
import api from '../../api'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { useAuth } from '../../state/AuthContext'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }
  const alerts = [
    { label: 'Pending verifications', value: 6, icon: UserRoundSearch },
    { label: 'Reports today', value: 31, icon: ClipboardCheck },
    { label: 'Escalations', value: 3, icon: Siren },
  ]

  const queue = [
    { requester: 'Maya D.', item: 'MacBook Air', status: 'needs review' },
    { requester: 'Ishan S.', item: 'Dorm keys', status: 'awaiting call' },
    { requester: 'Lahiru P.', item: 'DSLR Camera', status: 'matched' },
  ]

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [errorUsers, setErrorUsers] = useState('')

  useEffect(() => {
    let mounted = true
    api
      .get('/Users')
      .then((res) => {
        if (!mounted) return
        setUsers(res.Users || res.data?.Users || [])
      })
      .catch((err) => {
        console.error('Failed loading users for admin dashboard', err)
        if (!mounted) return
        setErrorUsers(err?.response?.data?.message || 'Failed to load users')
      })
      .finally(() => {
        if (!mounted) return
        setLoadingUsers(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="surface bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between animate-fade-up relative overflow-hidden border-t-4 border-t-indigo-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <img 
                src={`https://ui-avatars.com/api/?name=${(user?.name || 'Admin').replace(' ', '+')}&background=4f46e5&color=fff&size=128&bold=true`} 
                alt="Admin Avatar" 
                className="h-16 w-16 rounded-2xl border-2 border-white/20 shadow-lg object-cover"
              />
              <div className="text-white">
                <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">Admin Control Center</p>
                <h1 className="text-3xl font-extrabold tracking-tight">Campus Recovery Console</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Link to={`/users/${user?._id}`} className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-sm transition">Settings</Link>
              <button className="btn bg-rose-600/90 hover:bg-rose-600 text-white shadow shadow-rose-900/20 inline-flex items-center gap-2 backdrop-blur-sm transition" type="button" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3 animate-fade-up-delay-1">
          {alerts.map((alert, i) => (
            <div className={`surface p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden border-l-4 ${i === 2 ? 'border-rose-500' : i === 0 ? 'border-amber-500' : 'border-emerald-500'}`} key={alert.label}>
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${i === 2 ? 'bg-rose-500' : i === 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
              <div className="flex items-center justify-between relative z-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{alert.label}</p>
                <div className={`p-2 rounded-xl ${i === 2 ? 'bg-rose-100 text-rose-700' : i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <alert.icon size={18} className={i === 2 ? 'animate-pulse' : ''} />
                </div>
              </div>
              <h3 className="mt-3 text-4xl font-black text-slate-900 relative z-10">{alert.value}</h3>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up-delay-2">
          {/* Approval Queue */}
          <section className="surface p-0 overflow-hidden flex flex-col shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Activity size={18} className="text-indigo-600"/> Approval Queue</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 tracking-wide uppercase px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">View all</button>
            </div>
            <div className="overflow-x-auto flex-1 p-3">
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-4">
                     <th className="px-4 py-2">Requester</th>
                     <th className="px-4 py-2">Property</th>
                     <th className="px-4 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {queue.map((entry) => (
                    <tr key={entry.item} className="group hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 rounded-l-xl">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${entry.requester.replace(' ', '+')}&background=random&size=64`} className="h-8 w-8 rounded-xl border border-slate-200" alt={entry.requester} />
                          <span className="font-bold text-slate-800 text-sm">{entry.requester}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium text-sm">{entry.item}</td>
                      <td className="px-4 py-3 rounded-r-xl text-right">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider items-center gap-1 shadow-sm
                          ${entry.status === 'matched' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 border' : 
                            entry.status.includes('review') ? 'bg-amber-100 text-amber-800 border-amber-200 border' : 
                            'bg-blue-100 text-blue-800 border-blue-200 border'}`}>
                          {entry.status === 'matched' ? <ClipboardCheck size={12} /> : entry.status.includes('review') ? <AlertTriangle size={12} /> : <LoaderCircle size={12} className="animate-spin" />}
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Vertical Timeline Audit Trail */}
          <section className="surface p-0 overflow-hidden flex flex-col shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Clock size={18} className="text-indigo-600"/> Security Audit Log</h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 tracking-wide uppercase px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">Full log</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {(() => {
                  const recentActions = (users || []).flatMap((u) => (u.actions || []).map((a) => ({ ...a, userId: u._id, userName: u.name })));
                  recentActions.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
                  return recentActions.slice(0, 6).map((act, idx) => {
                    const isAuth = act.type.includes('login') || act.type.includes('created');
                    const isUpdate = act.type.includes('update');
                    return (
                      <div key={idx} className="relative pl-6">
                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white ring-4 ring-white ${isAuth ? 'bg-blue-500' : isUpdate ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                        <div>
                          <p className="text-sm text-slate-700 font-medium">
                            <span className="text-slate-900 font-bold">{act.userName}</span> {act.message.toLowerCase()}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className="uppercase font-semibold tracking-wider text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{act.type}</span>
                            <span>{new Date(act.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
                {(!users || users.length === 0) && <p className="ml-6 text-sm text-slate-500">No recent activity found.</p>}
              </div>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-[24px] shadow border border-slate-200 p-8 animate-fade-up-delay-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

          <div className="mb-6 relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Platform Settings
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage the connected services through their respective admin panels.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* User Management */}
            <Link to="/users" className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <Users size={24} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">User Management</h3>
              <p className="text-indigo-100 text-sm mb-4 line-clamp-2">Base authentication and user permissions.</p>
              <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white mt-auto">
                Manage Users <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Lost/Claim Management */}
            <Link to="/admin/lost-claim" className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <PackageSearch size={24} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Lost & Claim</h3>
              <p className="text-rose-100 text-sm mb-4 line-clamp-2">View lost items & manage claim queues.</p>
              <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white mt-auto">
                Open Panel <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Found/Social Management */}
            <Link to="/admin/social-found" className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <MessageSquareWarning size={24} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Found & Social</h3>
              <p className="text-emerald-100 text-sm mb-4 line-clamp-2">Moderate feedback, alerts & found items.</p>
              <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white mt-auto">
                Moderate Feeds <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Marketplace Management */}
            <Link to="/admin/marketplace" className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 block">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <Store size={24} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Marketplace</h3>
              <p className="text-amber-100 text-sm mb-4 line-clamp-2">Approve listings and selling transactions.</p>
              <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white mt-auto">
                Manage Shop <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        <section className="surface p-6 animate-fade-up-delay-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Registered Users</h2>
            <div className="flex items-center gap-3">
              <Link to="/users/create" className="btn btn-primary">Create user</Link>
              <Link to="/users" className="text-sm font-medium text-teal-700 hover:text-teal-800">Manage users</Link>
            </div>
          </div>

          <div>
            {loadingUsers ? (
              <div className="py-12 flex justify-center items-center text-slate-500 font-medium"><LoaderCircle size={24} className="animate-spin text-indigo-500 mr-2" /> Loading platform users...</div>
            ) : errorUsers ? (
              <p className="p-4 bg-red-50 text-red-700 rounded-xl">{errorUsers}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-4">
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Student ID</th>
                      <th className="px-4 py-2">Faculty</th>
                      <th className="px-4 py-2">Contact</th>
                      <th className="px-4 py-2">Last Login</th>
                      <th className="px-4 py-2">Security/Access</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {users.map((u) => (
                      <tr key={u._id} className="group hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 rounded-l-xl">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${u.name.replace(' ', '+')}&background=random&size=64`} className="h-9 w-9 rounded-full shadow-sm border border-slate-200" alt={u.name} />
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-tight">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium text-sm">{u.studentID}</td>
                        <td className="px-4 py-3 text-slate-600 text-sm">{u.faculty}</td>
                        <td className="px-4 py-3 text-slate-600 text-sm">{u.contactNumber}</td>
                        <td className="px-4 py-3 text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 items-start">
                             <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                               {u.role}
                             </span>
                             {u.mfaEnabled && <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">MFA ON</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 rounded-r-xl text-right">
                          <Link to={`/users/${u._id}`} className="btn btn-secondary py-1.5 px-3 text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 transition">Manage</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard