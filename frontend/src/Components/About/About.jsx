import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { Users, Shield, Target, Award } from 'lucide-react'

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Nav />

      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-56 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

      <main className="mx-auto flex-1 max-w-6xl px-4 py-16 animate-fade-up">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">Who We Are</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Uniting the Campus Community</h1>
          <p className="mt-4 text-lg text-slate-600">The premier platform dedicated to helping university students recover lost items, share resources, and connect effortlessly.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20 animate-fade-up-delay-1">
          <div className="surface p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We believe that losing a valuable item, whether it's a laptop, your dorm keys, or a beloved textbook, shouldn't derail your semester. Our mission is to leverage crowdsourced student power built upon a highly verified, secure network. By limiting access strictly to verified university emails, we establish a sphere of absolute trust and transparency. 
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Our vision goes beyond just Lost & Found. We are establishing an ecosystem combining peer-to-peer marketplace trading and social community interactions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 text-center transform hover:-translate-y-1 transition duration-300">
              <Shield size={32} className="mx-auto text-teal-600 mb-3" />
              <h3 className="font-bold text-slate-900">Secure</h3>
              <p className="text-sm text-slate-500 mt-1">Verified student access only</p>
            </div>
            <div className="glass-panel p-6 text-center transform hover:-translate-y-1 transition duration-300">
              <Users size={32} className="mx-auto text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900">Community</h3>
              <p className="text-sm text-slate-500 mt-1">Built by and for students</p>
            </div>
            <div className="glass-panel p-6 text-center transform hover:-translate-y-1 transition duration-300">
              <Target size={32} className="mx-auto text-rose-600 mb-3" />
              <h3 className="font-bold text-slate-900">Efficient</h3>
              <p className="text-sm text-slate-500 mt-1">Lightning fast matching</p>
            </div>
            <div className="glass-panel p-6 text-center transform hover:-translate-y-1 transition duration-300">
              <Award size={32} className="mx-auto text-amber-600 mb-3" />
              <h3 className="font-bold text-slate-900">Premium</h3>
              <p className="text-sm text-slate-500 mt-1">Top-tier user experience</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-slate-900 rounded-3xl p-10 md:p-16 animate-fade-up-delay-2 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <h2 className="text-3xl font-bold text-white relative z-10">Join the verified network today</h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto relative z-10">Sign up using your verified university email to access all platform features instantly.</p>
          <div className="mt-8 flex justify-center flex-wrap gap-4 relative z-10">
            <Link to="/register" className="btn bg-teal-500 hover:bg-teal-400 text-white border-0">Get Started</Link>
            <Link to="/services" className="btn bg-white/10 hover:bg-white/20 text-white border-white/20">View Services</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default About
