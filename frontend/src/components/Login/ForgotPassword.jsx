import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import api from '../../api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setToken('')
    setLoading(true)
    try {
      const { data } = await api.post('/Users/forgot', { email })
      setMessage(data.message || 'If the email exists, a reset token was generated')
      if (data.token) {
        setToken(data.token)
        // store token/email locally so Reset page can use it without asking the user
        try { localStorage.setItem('lf_reset_token', data.token); localStorage.setItem('lf_reset_email', email); } catch {}
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to request reset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="surface p-6">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your university email to receive a password reset token.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input className="field mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Requesting...' : 'Request reset'}</button>
            </div>
          </form>

          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
          {token && (
            <div className="mt-4 p-3 rounded bg-yellow-50 text-sm text-slate-700">
              <p className="font-semibold">Reset token (for testing):</p>
              <p className="break-all">{token}</p>
              <p className="mt-2 text-xs">Use this token on the Reset Password page.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
