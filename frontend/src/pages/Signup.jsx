import React, { useState } from 'react'
import Card from '../components/Card'
import { UserPlus } from 'lucide-react'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function submit(e) {
    e.preventDefault()
    setStatus({ state: 'loading', message: '' })
    // Demo-only: connect your real registration API later.
    await new Promise((r) => setTimeout(r, 600))
    setStatus({ state: 'ok', message: 'Account created (demo). Connect real auth API later.' })
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-semibold text-slate-100">Sign up</div>
        <div className="mt-1 text-sm text-slate-300">Create a campus account to report items & claims.</div>
      </div>

      <Card
        title="Create Account"
        subtitle="Use your campus email. (Demo UI)"
        action={
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 ring-1 ring-slate-800">
            <UserPlus className="h-4 w-4" />
            New
          </span>
        }
      >
        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600">Full Name</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600">Email</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              type="email"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600">Password</span>
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              type="password"
            />
          </label>

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            disabled={status.state === 'loading'}
          >
            {status.state === 'loading' ? 'Creating…' : 'Create account'}
          </button>

          {status.message ? (
            <div
              className={[
                'rounded-xl border px-3 py-2 text-sm',
                status.state === 'ok'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800',
              ].join(' ')}
            >
              {status.message}
            </div>
          ) : null}
        </form>
      </Card>
    </div>
  )
}
