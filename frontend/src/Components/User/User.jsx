import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import { Loader2, PencilLine, Trash2 } from 'lucide-react'

function User(props) {
  const { _id, name, email, studentID, faculty, contactNumber } = props.user;
  const [isDeleting, setIsDeleting] = useState(false)

  const history = useNavigate();

  const DeleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    setIsDeleting(true)
    await api
      .delete(`/Users/${_id}`)
      .then((res) => res.data)
      .then(() => {
        window.location.reload();
      })
      .finally(() => setIsDeleting(false));
  }

  return (
    <article className="surface p-5 animate-soft-in">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
          <p className="mt-1 font-semibold text-slate-900">{name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
          <p className="mt-1 text-sm text-slate-700 break-all">{email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student ID</p>
          <p className="mt-1 text-slate-700">{studentID}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Faculty</p>
          <p className="mt-1 text-slate-700">{faculty}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</p>
          <p className="mt-1 text-slate-700">{contactNumber}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link className="btn btn-primary inline-flex items-center gap-2" to={`/users/${_id}`}><PencilLine size={14} /> Update</Link>
        <button className="btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 inline-flex items-center gap-2" onClick={DeleteHandler} disabled={isDeleting}>
          {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : <><Trash2 size={14} /> Delete</>}
        </button>
      </div>
    </article>
  )
}

export default User