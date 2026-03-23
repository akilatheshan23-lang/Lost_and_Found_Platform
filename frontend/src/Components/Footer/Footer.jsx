import React from 'react'
import { Link } from 'react-router-dom'
import { Clock3, Mail, MapPin, Shield } from 'lucide-react'

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-200 animate-soft-in">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-white inline-flex items-center gap-2"><Shield size={18} /> Lost & Found UM</h3>
          <p className="mt-2 text-sm text-slate-300">Report lost items, return found belongings, and use the student marketplace to buy or sell used devices safely.</p>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-white">Quick Links</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-teal-300">Home</Link></li>
            <li><Link to="/register" className="hover:text-teal-300">Register</Link></li>
            <li><Link to="/login" className="hover:text-teal-300">Login</Link></li>
            <li><Link to="/users" className="hover:text-teal-300">Browse Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-white">Marketplace</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li><Link to="/user-dashboard" className="hover:text-teal-300">Buy Items</Link></li>
            <li><Link to="/user-dashboard" className="hover:text-teal-300">Sell Items</Link></li>
            <li><Link to="/user-dashboard" className="hover:text-teal-300">My Listings</Link></li>
            <li><Link to="/user-dashboard" className="hover:text-teal-300">Safety Tips</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-white">Contact</h4>
          <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Mail size={14} /> support@my.sliit.lk</p>
          <p className="text-sm text-slate-300 mt-1 inline-flex items-center gap-2"><Clock3 size={14} /> Mon - Sat, 8:00 AM - 8:00 PM</p>
          <p className="text-sm text-slate-300 mt-1 inline-flex items-center gap-2"><MapPin size={14} /> University Main Campus</p>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Lost & Found UM. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-300">Privacy</a>
            <a href="#" className="hover:text-teal-300">Terms</a>
            <a href="#" className="hover:text-teal-300">Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer