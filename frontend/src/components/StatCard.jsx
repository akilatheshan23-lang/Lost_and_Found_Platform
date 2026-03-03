import React from 'react'

export default function StatCard({ label, value, hint, Icon, accent = 'from-sky-500 to-emerald-500' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-600">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
          {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${accent}`}>
          {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
        </div>
      </div>
    </div>
  )
}
