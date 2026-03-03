import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-2xl font-semibold text-slate-900">Page not found</div>
      <div className="mt-2 text-slate-700">That route doesn’t exist.</div>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
