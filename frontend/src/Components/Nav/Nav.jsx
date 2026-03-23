import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur" aria-label="Primary">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 animate-soft-in">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm text-white"><ShieldCheck size={16} /></span>
          <span>Lost & Found</span>
        </Link>

        <ul className="hidden items-center space-x-6 text-sm font-medium text-slate-600 md:flex">
          <li><Link to="/mainhome" className="transition hover:text-teal-700">Home</Link></li>
          <li><Link to="/about" className="transition hover:text-teal-700">About</Link></li>
          <li><Link to="/services" className="transition hover:text-teal-700">Services</Link></li>
          <li><Link to="/faq" className="transition hover:text-teal-700">FAQ</Link></li>
          <li><Link to="/contact" className="transition hover:text-teal-700">Contact</Link></li>
        </ul>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link to="/login" className="btn btn-secondary hidden sm:inline-flex">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav