import React, { useEffect, useState } from 'react'
import { AlertTriangle, ClipboardCheck, LoaderCircle, Siren, UserRoundSearch, LogOut, Users, PackageSearch, MessageSquareWarning, Store, ChevronRight } from 'lucide-react'
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
          <header className="surface bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-up">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-200">Admin Control</p>
              <h1 className="mt-1 text-3xl font-bold">Campus Recovery Console</h1>
              <p className="mt-2 text-slate-200">Monitor submissions, approve matches, and assist high priority cases.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/users/${user?._id}`} className="btn btn-ghost bg-white/10 text-white">Edit profile</Link>
              <button className="btn btn-secondary inline-flex items-center gap-2" type="button" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up-delay-1">
          {alerts.map((alert) => (
            <div className="surface p-5" key={alert.label}>
              <p className="text-sm text-slate-500 inline-flex items-center gap-2"><alert.icon size={16} className="text-teal-700" /> {alert.label}</p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-900">{alert.value}</h3>
            </div>
          ))}
        </section>

        <section className="surface p-6 animate-fade-up-delay-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Approval Queue</h2>
            <button className="text-sm font-medium text-teal-700 hover:text-teal-800">View all</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-3 py-3 font-medium">Requester</th>
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((entry) => (
                  <tr key={entry.item} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-3 py-3 text-slate-700">{entry.requester}</td>
                    <td className="px-3 py-3 text-slate-800 font-medium">{entry.item}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 items-center gap-1">
                        {entry.status === 'matched' ? <ClipboardCheck size={12} /> : entry.status.includes('review') ? <AlertTriangle size={12} /> : <LoaderCircle size={12} />}
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 animate-fade-up-delay-3 relative overflow-hidden">
          {/* Decorative background element */}
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
              <p className="text-slate-600 inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" /> Loading users...</p>
            ) : errorUsers ? (
              <p className="text-red-700">{errorUsers}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">Student ID</th>
                      <th className="px-3 py-3 font-medium">Faculty</th>
                      <th className="px-3 py-3 font-medium">Contact</th>
                      <th className="px-3 py-3 font-medium">Role</th>
                      <th className="px-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-3 py-3 text-slate-700">{u.name}</td>
                        <td className="px-3 py-3 text-slate-700 break-all">{u.email}</td>
                        <td className="px-3 py-3 text-slate-700">{u.studentID}</td>
                        <td className="px-3 py-3 text-slate-700">{u.faculty}</td>
                        <td className="px-3 py-3 text-slate-700">{u.contactNumber}</td>
                        <td className="px-3 py-3 text-slate-700">{u.role}</td>
                        <td className="px-3 py-3">
                          <Link to={`/users/${u._id}`} className="text-teal-700 hover:underline">Edit</Link>
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