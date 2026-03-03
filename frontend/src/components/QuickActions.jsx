import React from 'react'
import { useNavigate } from 'react-router-dom'
import { navItems } from '../lib/nav'

export default function QuickActions() {
  const navigate = useNavigate()

  // We want the exact top button bar the user shared (plus Feedback).
  const quick = navItems.filter((n) => n.key !== 'dashboard')

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        {quick.map(({ key, label, to, Icon, color }) => (
          <button
            key={key}
            type="button"
            onClick={() => navigate(to)}
            className={[
              'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition',
              'focus:outline-none focus:ring-2 focus:ring-sky-400/40',
              color || 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
            ].join(' ')}
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
