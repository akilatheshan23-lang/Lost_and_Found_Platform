import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import api from '../../api'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      // read token from localStorage (user should request reset first)
      const tokenFromStorage = (() => { try { return localStorage.getItem('lf_reset_token') } catch { return null } })()
      if (!tokenFromStorage) {
        setMessage('No reset token found. Request a reset first via the Forgot Password page.')
        setLoading(false)
        return
      }
      const { data } = await api.post('/Users/reset', { email, token: tokenFromStorage, password, confirmPassword })
      setMessage(data.message || 'Password reset successful')
      // navigate to login after short delay
      // clear stored token on success
      try { localStorage.removeItem('lf_reset_token'); localStorage.removeItem('lf_reset_email'); } catch {}
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="surface p-6">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your email, the reset token, and a new password.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Reset Token</label>
              <input className="field mt-1" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <input className="field mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input className="field mt-1" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </div>
          </form>

          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </div>
      </main>
    </div>
  )
}

export default ResetPassword
