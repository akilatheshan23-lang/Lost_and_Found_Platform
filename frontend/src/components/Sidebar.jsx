import React from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../lib/nav'
import { Compass, LogOut } from 'lucide-react'

const baseLink =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition outline-none focus:ring-2 focus:ring-white/40'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col md:gap-4 md:border-r md:border-sky-700 md:bg-sky-700 md:p-3">
      <div className="flex items-center gap-2">
        <NavLink
          to="/login"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50"
        >
          Sign up
        </NavLink>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-soft">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-white/25 to-white/5 ring-1 ring-white/20">
          <Compass className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">Lost &amp; Found Platform</div>
          <div className="text-xs text-sky-100">Campus Community Hub</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ key, label, to, Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              [
                baseLink,
                isActive
                  ? 'bg-white/20 text-white ring-1 ring-white/25'
                  : 'text-sky-50 hover:bg-white/15 hover:text-white',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/15 bg-white/10 p-3">
        <div className="text-xs text-sky-100">Signed in as</div>
        <div className="mt-1 text-sm font-medium text-white">Student</div>
        <button
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          type="button"
          onClick={() => alert('Connect your real auth later (login/logout).')}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
