import React from 'react'
import './UserDashboard.css'

function UserDashboard() {
  const quickStats = [
    { label: 'Active Reports', value: 5 },
    { label: 'Matches Found', value: 2 },
    { label: 'Pending Handoffs', value: 1 },
  ]

  const recentActivity = [
    { title: 'Wallet', status: 'reviewing', time: '18 mins ago' },
    { title: 'Graphic calculator', status: 'matched', time: '1 hr ago' },
    { title: 'Key bundle', status: 'awaiting pickup', time: '3 hrs ago' },
  ]

  const tips = [
    'Upload sharp photos for faster matches',
    'Pin the last known location on the map',
    'Reply to volunteers within 12 hours',
  ]

  return (
    <div className="user-dash">
      <div className="dash-head">
        <div>
          <p className="eyebrow">User Workspace</p>
          <h1>Welcome back!</h1>
          <p>Manage all of your lost & found submissions from one place.</p>
        </div>
        <button className="cta">Create new report</button>
      </div>

      <section className="stats">
        {quickStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
          </div>
        ))}
      </section>

      <section className="dash-grid">
        <div className="activity">
          <header>
            <h2>Recent Activity</h2>
            <button>View all</button>
          </header>
          <ul>
            {recentActivity.map((item) => (
              <li key={item.title}>
                <div>
                  <p className="title">{item.title}</p>
                  <span className={`badge ${item.status.replace(/\s/g, '-')}`}>
                    {item.status}
                  </span>
                </div>
                <time>{item.time}</time>
              </li>
            ))}
          </ul>
        </div>

        <div className="tips">
          <h2>Recovery Boosters</h2>
          <ul>
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default UserDashboard