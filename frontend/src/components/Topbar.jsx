import React from 'react'
import { Menu, Search, Bell } from 'lucide-react'

export default function Topbar({ onOpenMobileNav }) {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-700 bg-sky-700/95 backdrop-blur">
      <div className="flex w-full items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/15"
          onClick={onOpenMobileNav}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="text-sm font-semibold text-white">Lost &amp; Found</div>
        </div>

        <div className="relative ml-auto w-full max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Search items, locations, posts…"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/15"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-white" />
        </button>

        <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2">
          <div className="h-8 w-8 rounded-xl bg-white/25 ring-1 ring-white/25" />
          <div className="leading-tight">
            <div className="text-sm font-medium text-white">Welcome</div>
            <div className="text-xs text-sky-100">Campus user</div>
          </div>
        </div>
      </div>
    </header>
  )
}
