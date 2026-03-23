import React from 'react'
import { AlertTriangle, ClipboardCheck, LoaderCircle, Siren, UserRoundSearch } from 'lucide-react'

function AdminDashboard() {
  const alerts = [
    { label: 'Pending verifications', value: 6, icon: UserRoundSearch },
    { label: 'Reports today', value: 31, icon: ClipboardCheck },
    { label: 'Escalations', value: 3, icon: Siren },
  ]

  const queue = [
    { requester: 'Maya D.', item: 'MacBook Air', status: 'needs review' },
    { requester: 'Ishan S.', item: 'Dorm keys', status: 'awaiting call' },
    { requester: 'Lahiru P.', item: 'DSLR Camera', status: 'matched' },
  ]

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="surface bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-up">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-200">Admin Control</p>
            <h1 className="mt-1 text-3xl font-bold">Campus Recovery Console</h1>
            <p className="mt-2 text-slate-200">Monitor submissions, approve matches, and assist high priority cases.</p>
          </div>
          <button className="btn bg-white text-slate-900 hover:bg-slate-100">Open command center</button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up-delay-1">
          {alerts.map((alert) => (
            <div className="surface p-5" key={alert.label}>
              <p className="text-sm text-slate-500 inline-flex items-center gap-2"><alert.icon size={16} className="text-teal-700" /> {alert.label}</p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-900">{alert.value}</h3>
            </div>
          ))}
        </section>

        <section className="surface p-6 animate-fade-up-delay-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Approval Queue</h2>
            <button className="text-sm font-medium text-teal-700 hover:text-teal-800">View all</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-3 py-3 font-medium">Requester</th>
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((entry) => (
                  <tr key={entry.item} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-3 py-3 text-slate-700">{entry.requester}</td>
                    <td className="px-3 py-3 text-slate-800 font-medium">{entry.item}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 items-center gap-1">
                        {entry.status === 'matched' ? <ClipboardCheck size={12} /> : entry.status.includes('review') ? <AlertTriangle size={12} /> : <LoaderCircle size={12} />}
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard