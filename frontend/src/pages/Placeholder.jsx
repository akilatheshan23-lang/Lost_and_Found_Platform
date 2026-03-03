import React from 'react'
import { Link } from 'react-router-dom'

export default function Placeholder({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-2xl font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="mt-2 text-slate-700">{subtitle}</div> : null}
      <div className="mt-6 text-sm text-slate-600">
        This page is ready for your real module UI + API. For now, it’s a clean placeholder.
      </div>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
