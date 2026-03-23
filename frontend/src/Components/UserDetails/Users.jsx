import React, { useState, useEffect } from 'react'
import Nav from '../Nav/Nav'
import axios from "axios";
import User from '../User/User';
import { AlertCircle, Loader2, Users as UsersIcon } from 'lucide-react'

const URL ="http://localhost:5000/Users"

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHandler()
      .then((data) => setUsers(data.Users))
      .catch(() => setError('Failed to load users. Please refresh.'))
      .finally(() => setLoading(false))
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="surface bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white animate-fade-up">
          <p className="kicker text-slate-200">Admin Directory</p>
          <h1 className="mt-2 text-3xl font-bold inline-flex items-center gap-2"><UsersIcon size={24} /> User Details</h1>
          <p className="mt-2 text-sm text-slate-200">Manage registered users and keep account records updated.</p>
        </div>

        <section className="mt-6 grid gap-4 animate-fade-up-delay-1">
        {loading && <p className="surface p-4 text-slate-600 inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading users...</p>}
        {error && <p className="surface p-4 text-red-700 border-red-100 inline-flex items-center gap-2"><AlertCircle size={16} /> {error}</p>}
        {!loading && !error && users && users.map((user) => (
          <User key={user._id} user={user} />
        ))}
        </section>
      </main>
    </div>
  )
}

export default Users