import React, { useState } from 'react'
import Card from '../components/Card'
import { SendHorizonal } from 'lucide-react'

export default function Feedback() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'General',
    message: '',
  })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function submit(e) {
    e.preventDefault()
    setStatus({ state: 'loading', message: '' })

    if (!form.message.trim()) {
      setStatus({ state: 'error', message: 'Please type your feedback message.' })
      return
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus({ state: 'success', message: 'Thanks! Your feedback has been sent.' })
      setForm({ name: '', email: '', category: 'General', message: '' })
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Could not send feedback. Start the server (port 8080) and try again.',
      })
    }
  }

  return (
    <div className="grid gap-4">
      <Card
        title="Feedback"
        subtitle="Help us improve the Campus Lost & Found Platform. Your message is saved on the server."
      >
        <form onSubmit={submit} className="grid gap-4">
          {status.state !== 'idle' ? (
            <div
              className={[
                'rounded-xl border px-4 py-3 text-sm',
                status.state === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : status.state === 'error'
                    ? 'border-rose-200 bg-rose-50 text-rose-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700',
              ].join(' ')}
            >
              {status.message || 'Sending…'}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              Your name (optional)
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                placeholder="e.g., Teshan"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Email (optional)
              <input
                type="email"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-700">
            Category
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              <option>General</option>
              <option>Bug</option>
              <option>Feature Request</option>
              <option>Report Abuse</option>
              <option>UI / Design</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Message
            <textarea
              rows={6}
              className="resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              placeholder="Type your feedback…"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
            />
          </label>

          <button
            disabled={status.state === 'loading'}
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            <SendHorizonal className="h-4 w-4" />
            Send Feedback
          </button>
        </form>
      </Card>

      <Card title="Where feedback is stored" subtitle="Server path (local)">
        <div className="text-sm text-slate-700">
          When you run the included Express server, it stores feedback in:
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800">
            server/data/feedback.json
          </div>
        </div>
      </Card>
    </div>
  )
}
