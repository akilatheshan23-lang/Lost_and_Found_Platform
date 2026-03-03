import React from 'react'

export default function Card({ title, subtitle, children, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
