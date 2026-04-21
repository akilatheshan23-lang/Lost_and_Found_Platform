import React, { useState } from 'react'
import { useAuth } from '../../state/AuthContext'
import api from '../../api'
import Nav from '../Nav/Nav'

function MfaSettings() {
  const { token, user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [qr, setQr] = useState('')
  const [otpauth, setOtpauth] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const generate = async () => {
    setMessage('')
    setLoading(true)
    try {
      const { data } = await api.post('/Users/mfa/generate', {}, { headers: { Authorization: `Bearer ${token}` } })
      setQr(data.qr)
      setOtpauth(data.otpauth)
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to generate QR')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      await api.post('/Users/mfa/verify', { token: code }, { headers: { Authorization: `Bearer ${token}` } })
      // refresh session user
      const { data } = await api.get('/Users/session', { headers: { Authorization: `Bearer ${token}` } })
      login(token, data.user)
      setMessage('MFA enabled')
      setQr('')
      setOtpauth('')
      setCode('')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  const disable = async () => {
    if (!confirm('Disable MFA for your account?')) return
    setMessage('')
    const tokenPrompt = prompt('Enter current authenticator code to confirm')
    if (!tokenPrompt) return
    setLoading(true)
    try {
      await api.post('/Users/mfa/disable', { token: tokenPrompt }, { headers: { Authorization: `Bearer ${token}` } })
      const { data } = await api.get('/Users/session', { headers: { Authorization: `Bearer ${token}` } })
      login(token, data.user)
      setMessage('MFA disabled')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to disable MFA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="surface p-6">
          <p className="kicker">Account Security</p>
          <h2 className="mt-2 text-2xl font-bold">Multi-factor Authentication</h2>
          <p className="mt-2 text-sm text-slate-600">Enable Microsoft Authenticator (TOTP) for stronger account protection.</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="mt-1 text-sm">{user?.mfaEnabled ? 'Enabled' : user?.mfaSecret ? 'Enabled (secret present)' : 'Not enabled'}</p>
            </div>

            {!user?.mfaEnabled && !user?.mfaSecret && (
              <div>
                <button className="btn btn-primary" onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate QR & Secret'}</button>
              </div>
            )}

            {qr && (
              <div className="mt-4">
                <p className="text-sm">Scan this QR in Microsoft Authenticator, then enter the 6-digit code to verify.</p>
                <img src={qr} alt="MFA QR" className="mt-3 w-56 h-56 rounded-md border" />
                <form className="mt-4 flex items-center gap-3" onSubmit={verify}>
                  <input className="field" type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required />
                  <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
                </form>
              </div>
            )}

            {user?.mfaEnabled && (
              <div>
                <button className="btn border" onClick={disable} disabled={loading}>{loading ? 'Processing...' : 'Disable MFA'}</button>
              </div>
            )}

            {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MfaSettings
