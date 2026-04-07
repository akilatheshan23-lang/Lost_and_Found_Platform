import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { FileSearch, ShoppingBag, PackageCheck, LifeBuoy, ArrowRight } from 'lucide-react'

function Services() {
  const services = [
    {
      icon: FileSearch,
      title: 'Lost & Found Recovery',
      desc: 'Lose something important? File a highly visible claim. Found someone else\'s item? Log it safely to help coordinate a secure return on campus.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      icon: ShoppingBag,
      title: 'Peer Marketplace',
      desc: 'Buy, sell, and trade electronics, textbooks, and dorm furniture securely with other strictly verified university individuals.',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      icon: PackageCheck,
      title: 'Social Feeds & Alerts',
      desc: 'Stay informed with real-time community alerts. Broadcast updates regarding missing valuables to mobilize your college peers immediately.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      icon: LifeBuoy,
      title: 'Admin Moderation',
      desc: 'Our dedicated student administrative team works 24/7. They actively moderate posts and step in to rapidly verify and resolve claim disputes.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Nav />
      
      <div className="pointer-events-none absolute left-1/2 top-40 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/30 blur-3xl" />

      <main className="mx-auto flex-1 max-w-6xl px-4 py-16 w-full animate-fade-up">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-800">Our Services</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Everything you need, Unified.</h1>
          <p className="mt-4 text-lg text-slate-600">Explore the comprehensive toolkit designed expressly for our university community.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-up-delay-1">
          {services.map((svc, idx) => (
            <div key={idx} className="surface p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className={`w-14 h-14 rounded-2xl ${svc.bgColor} ${svc.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <svc.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{svc.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{svc.desc}</p>
              <Link to="/register" className={`inline-flex items-center font-semibold ${svc.color} hover:opacity-80 transition-opacity`}>
                Learn more <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 surface p-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white text-center animate-fade-up-delay-2">
          <h2 className="text-2xl font-bold text-slate-900">Ready to utilize these services?</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">Create your account to unlock the full ecosystem.</p>
          <div className="mt-6">
            <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">Create Account</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Services
