import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import './UserDashboard.css'

function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userName = user?.name || 'Student'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const quickStats = [
    { label: 'Active Reports', value: 5, tone: 'indigo' },
    { label: 'Matches Found', value: 2, tone: 'teal' },
    { label: 'Items Returned', value: 1, tone: 'mint' },
    { label: 'Marketplace Posts', value: 3, tone: 'amber' },
  ]

  const recentActivity = [
    { title: 'Lost Wallet', status: 'Searching', time: '18 mins ago' },
    { title: 'Found Calculator', status: 'Matched', time: '1 hr ago' },
    { title: 'Keys', status: 'Pending Pickup', time: '3 hrs ago' },
  ]

  return (
    <div className="user-dashboard-page">
      <Nav />

      <div className="user-dashboard">

        <section className="ud-topbar">
          <div className="ud-profile-shortcut">
            <span className="ud-avatar">{userName.charAt(0).toUpperCase()}</span>
            <div>
              <p className="ud-profile-label">Signed in as</p>
              <strong>{userName}</strong>
            </div>
          </div>

          <div className="ud-top-actions">
            <Link className="ud-profile-link" to={user?._id ? `/users/${user._id}` : '/user-dashboard'}>
              See Profile
            </Link>
            <button className="ud-logout-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>

        <header className="ud-header">
          <div className="ud-title-wrap">
            <p className="ud-kicker">Student Workspace</p>
            <h1>Welcome back, {userName}</h1>
            <p>Track your lost and found activity and manage marketplace posts in one place.</p>
          </div>

          <div className="ud-actions">
            <button className="ud-btn ud-btn-primary">Report Lost</button>
            <button className="ud-btn ud-btn-soft">Report Found</button>
            <button className="ud-btn ud-btn-ghost">Marketplace</button>
          </div>
        </header>

        <section className="ud-stats-grid">
          {quickStats.map((stat) => (
            <article className={`ud-stat-card ${stat.tone}`} key={stat.label}>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="ud-main-grid">

          <article className="ud-card">
            <div className="ud-card-head">
              <h3>Recent Activity</h3>
              <button className="ud-link-btn">View All</button>
            </div>

            <ul className="ud-activity-list">
              {recentActivity.map((item) => (
                <li key={item.title}>
                  <div>
                    <h4>{item.title}</h4>
                    <span className="ud-status">{item.status}</span>
                  </div>

                  <time>{item.time}</time>
                </li>
              ))}
            </ul>
          </article>

          <article className="ud-card">
            <h3>Quick Actions</h3>

            <div className="ud-quick-actions">
              <button className="ud-action-btn">
                Post Lost Item
              </button>

              <button className="ud-action-btn">
                Post Found Item
              </button>

              <button className="ud-action-btn">
                Open Marketplace
              </button>

              <button className="ud-action-btn">
                My Reports
              </button>
            </div>
          </article>

        </section>

      </div>

      <Footer />

    </div>
  )
}

export default UserDashboard