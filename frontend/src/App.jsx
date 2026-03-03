import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import MobileNavDrawer from './components/MobileNavDrawer'

import Dashboard from './pages/Dashboard'
import Found from './pages/Found'
import Lost from './pages/Lost'
import Claims from './pages/Claims'
import Marketplace from './pages/Marketplace'
import Social from './pages/Social'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex w-full">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 bg-slate-900/30">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/found" element={<Found />} />
            <Route path="/lost" element={<Lost />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/social" element={<Social />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} Lost &amp; Found Platform — Campus Community Web App
          </footer>
        </main>
      </div>
    </div>
  )
}
