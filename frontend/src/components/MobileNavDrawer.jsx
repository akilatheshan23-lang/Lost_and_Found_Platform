import React from 'react'
import { NavLink } from 'react-router-dom'
import { X, Compass } from 'lucide-react'
import { navItems } from '../lib/nav'

const baseLink =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition outline-none focus:ring-2 focus:ring-white/40'

export default function MobileNavDrawer({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close menu"
        onClick={onClose}
        type="button"
      />
      <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r border-sky-700 bg-sky-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-white/25 to-white/5 ring-1 ring-white/20">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">Lost &amp; Found</div>
              <div className="text-xs text-sky-100">Campus Platform</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/15"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <NavLink
            to="/login"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50"
          >
            Sign up
          </NavLink>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map(({ key, label, to, Icon }) => (
            <NavLink
              key={key}
              to={to}
              onClick={onClose}
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
      </div>
    </div>
  )
}
