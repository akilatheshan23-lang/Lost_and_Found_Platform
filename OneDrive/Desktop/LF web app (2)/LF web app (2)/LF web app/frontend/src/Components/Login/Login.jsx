import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../../api'
import { useAuth } from '../../state/AuthContext'
import { BellRing, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [totp, setTotp] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    const studentDomain = '@my.sliit.lk'
    const adminDomain = '@sliit.lk'
    const role = normalizedEmail.endsWith(studentDomain)
      ? 'student'
      : normalizedEmail.endsWith(adminDomain)
      ? 'admin'
      : null

    if (!role) {
      setError('Use @my.sliit.lk (Your University email)')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const payload = { email: normalizedEmail, password }
      if (mfaRequired) payload.totp = totp

      const { data } = await api.post('/Users/login', payload)

      if (data?.mfaRequired) {
        setMfaRequired(true)
        setError('Enter the 6-digit code from your authenticator app')
        return
      }

      if (!data?.user || !data?.token) {
        setError('Login response is invalid. Please try again.')
        return
      }

      login(data.token, data.user)

      const fromPath = location.state?.from?.pathname
      if (data.user.role === 'admin') {
        navigate(fromPath === '/admin-dashboard' ? fromPath : '/admin-dashboard', { replace: true })
      } else {
        navigate(fromPath === '/user-dashboard' ? fromPath : '/user-dashboard', { replace: true })
      }
    } catch (err) {
      console.error('Login error:', err)
      let message = 'Login failed';
      if (err?.response) {
        message = err.response.data?.message || `${err.response.status} ${err.response.statusText}`;
      } else if (err?.request) {
        message = 'No response from server. Is the backend running?';
      } else if (err?.message) {
        message = err.message;
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
        <div className="surface bg-gradient-to-br from-teal-600 to-cyan-600 p-7 text-white animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-50/90">Lost & Found Portal</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight">Welcome back, guardian!</h1>
          <p className="mt-3 text-teal-50/90">Track item reports, respond to matches, and keep the campus community connected.</p>
          <ul className="mt-5 space-y-2 text-sm text-teal-50">
            <li className="inline-flex items-center gap-2"><BellRing size={15} /> Real-time alerts on submissions</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Community verified handoffs</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Secure admin dashboard</li>
          </ul>
          <div className="mt-8 rounded-xl bg-white/15 p-4 text-sm">
            Sign in with your university email to continue.
          </div>
        </div>

        <form className="surface p-7 animate-fade-up-delay-1" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Use @my.sliit.lk (Your University email)</p>

          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <label className="mt-5 block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Mail size={15} /> University Email</label>
          <input
            className="field mt-1"
            type="email"
            placeholder="name@my.sliit.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="^[^\s@]+@(my\.sliit\.lk|sliit\.lk)$"
            title="Use @my.sliit.lk (Your University email)"
            required
          />

          <label className="mt-4 block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Lock size={15} /> Password</label>
          <input
            className="field mt-1"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mfaRequired && (
            <>
              <label className="mt-4 block text-sm font-medium text-slate-700 inline-flex items-center gap-2">Authenticator Code</label>
              <input
                className="field mt-1"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                required
              />
            </>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Link className="text-sm font-medium text-slate-500 hover:text-teal-700" to="/reset">Forgot password?</Link>
            <button className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Signing in...</span> : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login