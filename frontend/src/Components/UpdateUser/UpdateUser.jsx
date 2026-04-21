import React, { useEffect, useState } from 'react'
import api from '../../api'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Nav from '../Nav/Nav'
import { Loader2, Save, UserCog, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../state/AuthContext'
import { Link } from 'react-router-dom'

function UpdateUser() {

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    studentID: '',
    faculty: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });
  const history = useNavigate();
  const id = useParams().id;
  const { user } = useAuth()
  const { logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Real-time Profile Maturity Calculation
  let maturityScore = 0;
  if (inputs.name || user?.name) maturityScore += 20;
  if (inputs.email || user?.email) maturityScore += 20;
  if (inputs.studentID || user?.studentID) maturityScore += 20;
  if (inputs.contactNumber || user?.contactNumber) maturityScore += 20;
  if (user?.mfaEnabled) maturityScore += 20;
  
  const displayUserName = inputs.name || user?.name || 'Student';

  useEffect(() => {
    const fetchHandler = async () => {
      await api
        .get(`/Users/${id}`)
        .then((res) => res.data)
        .then((data) =>
          setInputs((prev) => ({
            ...prev,
            name: data.user?.name ?? '',
            email: data.user?.email ?? '',
            studentID: data.user?.studentID ?? '',
            faculty: data.user?.faculty ?? '',
            contactNumber: data.user?.contactNumber ?? '',
            password: '',
            confirmPassword: '',
          }))
        );
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    const payload = {
      name: String(inputs.name),
      email: String(inputs.email),
      studentID: String(inputs.studentID),
      faculty: String(inputs.faculty),
      contactNumber: String(inputs.contactNumber),
    };

    if (inputs.password || inputs.confirmPassword) {
      payload.password = String(inputs.password);
      payload.confirmPassword = String(inputs.confirmPassword);
    }

    return await api
      .put(`/Users/${id}`, payload)
      .then((res) => res.data);
  }

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      // Validate contact number before sending
      const digits = String(inputs.contactNumber || '').replace(/\D/g, '');
      if (digits.length !== 10) {
        setError('Contact number must be exactly 10 digits');
        setIsSubmitting(false)
        return
      }

      setError('')
      await sendRequest();
      // If the current user updated their own profile, stay on page and show success message.
      if (user && user._id === id) {
        setSuccess('Profile updated successfully!')
        // clear password fields
        setInputs((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      } else {
        // Admin editing other users: return to users list
        history("/users");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const message = user && user._id === id 
      ? 'Are you sure you want to permanently delete your account? This action cannot be undone.' 
      : 'Are you sure you want to permanently delete this user? This action cannot be undone.';
    if (!window.confirm(message)) return;
    try {
      setIsSubmitting(true)
      await api.delete(`/Users/${id}`)
      // If the current user deleted their own account, log them out and redirect
      if (user && user._id === id) {
        try { logout() } catch (e) { }
        history('/register')
      } else {
        history('/users')
      }
    } catch (err) {
      console.error('Failed to delete account', err)
      setError(err?.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="surface bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white animate-fade-up">
          <p className="kicker text-slate-200">Account Management</p>
          <h1 className="mt-2 text-3xl font-bold inline-flex items-center gap-2"><UserCog size={24} /> Update User</h1>
          <p className="mt-2 text-sm text-slate-200">Edit profile details and optional credentials securely.</p>
        </div>

        {user && user._id === id && (
          <div className="surface mt-6 flex flex-col sm:flex-row sm:items-center gap-5 p-6 animate-fade-up border-t-4 border-t-teal-600">
            <img 
              src={`https://ui-avatars.com/api/?name=${displayUserName.replace(' ', '+')}&background=0f766e&color=fff&size=128&bold=true`} 
              alt={displayUserName} 
              className="h-16 w-16 rounded-full border-2 border-slate-100 shadow-sm object-cover"
            />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Strength</p>
              <h2 className="text-xl font-bold text-slate-900">{maturityScore}% Complete</h2>
              <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 rounded-full ${maturityScore === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${maturityScore}%` }}></div>
              </div>
              {maturityScore < 100 && (
                <p className="mt-2 text-xs font-medium text-slate-500">Enable Two-Factor Authentication (MFA) to reach 100%.</p>
              )}
            </div>
            {maturityScore === 100 && (
              <div className="hidden sm:flex self-start px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-full tracking-wide">
                Verified
              </div>
            )}
          </div>
        )}

        <form className="surface mt-6 grid gap-4 p-6 animate-fade-up-delay-1" onSubmit={handleSubmit}>
          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {success && <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
          {success && user && user._id === id && (
            <div className="mt-2">
              <Link to={`/users/${user._id}`} className="btn btn-secondary inline-flex items-center gap-2">View Profile</Link>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input className="field mt-1" type="text" name="name" onChange={handleChange} placeholder='Name' value={inputs.name} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input className="field mt-1 bg-slate-50 cursor-not-allowed" type="email" name="email" placeholder='Email' value={inputs.email} disabled aria-readonly="true" />
              <small className="text-xs text-slate-500">Email cannot be changed from this screen.</small>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Student ID</label>
              <input className="field mt-1" type="text" name="studentID" placeholder='Student ID' value={inputs.studentID} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Faculty</label>
              <select className="field mt-1" name="faculty" value={inputs.faculty} onChange={handleChange} required>
                <option value="" disabled>Select faculty</option>
                <option value="Computing">Computing</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Humanities and sciences">Humanities and sciences</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Contact Number</label>
              <input className="field mt-1" type="tel" name="contactNumber" placeholder='Contact Number' value={inputs.contactNumber} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input className="field mt-1" type="password" name="password" placeholder='Update password (optional)' value={inputs.password} onChange={handleChange} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input className="field mt-1" type="password" name="confirmPassword" placeholder='Confirm password' value={inputs.confirmPassword} onChange={handleChange} />
              <small className="mt-1 block text-xs text-slate-500">Leave password fields empty to keep the current password.</small>
            </div>
          </div>

          <div className="pt-1">
            <button className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70" type='submit' disabled={isSubmitting}>
              {isSubmitting ? <span className="inline-flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Updating...</span> : <span className="inline-flex items-center gap-2"><Save size={15} /> Update User</span>}
            </button>
          </div>
        </form>

        {user && (user._id === id || user.role === 'admin') && (
          <section className="mt-8 surface border-red-100 bg-red-50/30 p-6 animate-fade-up-delay-2">
            <p className="mt-2 text-sm text-red-700">
              {user._id === id ? 'Permanently delete your account and all associated data. This action cannot be undone.' : 'Permanently delete this user account. This action cannot be undone.'}
            </p>
            <div className="mt-4">
              <button type="button" onClick={handleDelete} className="btn border border-red-200 bg-white text-red-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 inline-flex items-center gap-2" disabled={isSubmitting}>
                <Trash2 size={15} /> {user._id === id ? 'Delete My Account' : 'Delete User Account'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default UpdateUser