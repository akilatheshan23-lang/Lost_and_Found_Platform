import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import api from '../../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

function CreateUser() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [inputs, setInputs] = useState({
    name: '', email: '', studentID: '', faculty: '', contactNumber: '', password: '', confirmPassword: '', role: 'student'
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user || user.role !== 'admin') return null

  const handleChange = (e) => setInputs((s) => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // basic validations
    if (!/^[A-Za-z0-9._%+-]+@my\.sliit\.lk$/.test(inputs.email) && inputs.role === 'student') {
      setError('Student email must use @my.sliit.lk')
      return
    }
    const digits = String(inputs.contactNumber || '').replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Contact number must be exactly 10 digits')
      return
    }
    if (inputs.password !== inputs.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/Users', {
        name: String(inputs.name),
        email: String(inputs.email).trim().toLowerCase(),
        studentID: String(inputs.studentID),
        faculty: String(inputs.faculty),
        contactNumber: digits,
        password: String(inputs.password),
        confirmPassword: String(inputs.confirmPassword),
        role: inputs.role,
      })
      navigate('/users')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create user')
    } finally { setIsSubmitting(false) }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="surface p-6">
          <h1 className="text-2xl font-bold">Create User</h1>
          <p className="mt-2 text-sm text-slate-600">Create an account on behalf of a user.</p>

          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <input className="field" name="name" value={inputs.name} placeholder="Full name" onChange={handleChange} required />
            <input className="field" name="email" type="email" value={inputs.email} placeholder="Email" onChange={handleChange} required />
            <input className="field" name="studentID" value={inputs.studentID} placeholder="Student ID (with prefix)" onChange={handleChange} />
            <select className="field" name="faculty" value={inputs.faculty} onChange={handleChange} required>
              <option value="">Select faculty</option>
              <option value="Computing">Computing</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
              <option value="Humanities and sciences">Humanities and sciences</option>
              <option value="Architecture">Architecture</option>
            </select>
            <input className="field" name="contactNumber" value={inputs.contactNumber} type="tel" inputMode="numeric" maxLength={10} placeholder="Contact Number (10 digits)" onChange={handleChange} required />
            <select className="field" name="role" value={inputs.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <input className="field" name="password" type="password" value={inputs.password} placeholder="Password" onChange={handleChange} required />
            <input className="field" name="confirmPassword" type="password" value={inputs.confirmPassword} placeholder="Confirm password" onChange={handleChange} required />

            <div className="sm:col-span-2 pt-2">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create user'}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateUser
