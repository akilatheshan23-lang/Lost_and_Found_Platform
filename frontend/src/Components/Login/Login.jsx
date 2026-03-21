import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const studentDomain = '@my.sliit.lk'
    const adminDomain = '@sliit.lk'
    const role = email.endsWith(studentDomain)
      ? 'student'
      : email.endsWith(adminDomain)
      ? 'admin'
      : null

    if (!role) {
      setError('Use @my.sliit.lk (students) or @sliit.lk (admins)')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const { data } = await axios.post('http://localhost:5000/Users/login', {
        email,
        password,
      })
      if (data.user.role === 'admin') {
        navigate('/admin-dashboard', { state: { user: data.user } })
      } else {
        navigate('/user-dashboard', { state: { user: data.user } })
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <Nav />
      <div className="login-shell">
        <div className="login-hero">
          <p>Lost & Found Portal</p>
          <h1>Welcome back, guardian!</h1>
          <p>Track item reports, respond to matches, and keep the campus connected.</p>
          <ul>
            <li>Real-time alerts on submissions</li>
            <li>Community verified handoffs</li>
            <li>Secure admin dashboard</li>
          </ul>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}
          <div>
            <label>University Email</label>
            <input
              type="email"
              placeholder="name@my.sliit.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="^[A-Za-z0-9._%+-]+@(my\.sliit\.lk|sliit\.lk)$"
              title="Use @my.sliit.lk (students) or @sliit.lk (admins)"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-actions">
            <Link className="secondary-link" to="/reset">Forgot password?</Link>
            <button className="login-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login