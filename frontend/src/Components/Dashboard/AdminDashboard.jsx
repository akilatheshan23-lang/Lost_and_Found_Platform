import React from 'react'
import './AdminDashboard.css'

function AdminDashboard() {
  const alerts = [
    { label: 'Pending verifications', value: 6 },
    { label: 'Reports today', value: 31 },
    { label: 'Escalations', value: 3 },
  ]

  const queue = [
    { requester: 'Maya D.', item: 'MacBook Air', status: 'needs review' },
    { requester: 'Ishan S.', item: 'Dorm keys', status: 'awaiting call' },
    { requester: 'Lahiru P.', item: 'DSLR Camera', status: 'matched' },
  ]

  return (
    <div className="admin-dash">
      <header>
        <div>
          <p className="eyebrow">Admin Control</p>
          <h1>Campus Recovery Console</h1>
          <p>Monitor submissions, approve matches, and assist high priority cases.</p>
        </div>
        <button className="cta">Open command center</button>
      </header>

      <section className="admin-stats">
        {alerts.map((alert) => (
          <div className="stat-card" key={alert.label}>
            <p>{alert.label}</p>
            <h3>{alert.value}</h3>
          </div>
        ))}
      </section>

      <section className="admin-queue">
        <div className="queue-head">
          <h2>Approval Queue</h2>
          <button>View all</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Item</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((entry) => (
              <tr key={entry.item}>
                <td>{entry.requester}</td>
                <td>{entry.item}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminDashboard