import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
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

  const quickStats = [
    { label: 'Active Reports', value: 5, tone: 'indigo' },
    { label: 'Matches Found', value: 2, tone: 'teal' },
    { label: 'Items Returned', value: 1, tone: 'mint' },
    { label: 'Marketplace Posts', value: 3, tone: 'amber' },
  ]

  const recentActivity = [
    { title: 'Lost Wallet', status: 'Searching', time: '18 mins ago' },
    { title: 'Found Calculator', status: 'Matched', time: '1 hr ago' },
    { title: 'Keys', status: 'Pending Pickup', time: '3 hrs ago' },
  ]

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">

        <section className="surface p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">{userName.charAt(0).toUpperCase()}</span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
              <strong className="text-slate-900">{userName}</strong>
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
            <article className="surface p-5" key={stat.label}>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</h2>
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
              {recentActivity.map((item) => (
                <li key={item.title} className="rounded-lg border border-slate-100 p-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <span className="inline-flex mt-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 items-center gap-1"><Loader2 size={11} />{item.status}</span>
                  </div>

                  <time className="text-sm text-slate-500">{item.time}</time>
                </li>
              ))}
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