import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { CircleCheckBig, FileSearch, PackageCheck, ShoppingBag, UserPlus, FilePlus2, Handshake, RotateCcw } from 'lucide-react'

function Home() {
  const features = [
    {
      icon: FileSearch,
      title: 'Report Lost Item',
      text: 'Lost your belongings? Post details and let others help you find them quickly.',
      linkText: 'Report Now',
    },
    {
      icon: PackageCheck,
      title: 'Post Found Item',
      text: 'Found something? Upload it and help return it to the rightful owner.',
      linkText: 'Post Item',
    },
    {
      icon: ShoppingBag,
      title: 'Student Marketplace',
      text: 'Buy and sell used laptops, phones and student essentials safely.',
      linkText: 'Open Marketplace',
    },
  ];

  const steps = [
    { number: '01', title: 'Register', text: 'Create your student account using university email.', icon: UserPlus },
    { number: '02', title: 'Post', text: 'Report lost items or upload found items in minutes.', icon: FilePlus2 },
    { number: '03', title: 'Match', text: 'Users connect and verify ownership details.', icon: Handshake },
    { number: '04', title: 'Return', text: 'Meet safely and complete the item handover.', icon: RotateCcw },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />

      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-56 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

      <main className="mx-auto flex-1 max-w-6xl px-4 py-12 md:py-16">
        <section className="grid items-center gap-8 md:grid-cols-2 animate-fade-up">
          <div className="animate-fade-up">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">University Trusted Platform</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Find what matters. Return what counts.</h1>
            <p className="mt-4 max-w-xl text-slate-600">Report lost items, post found belongings, and trade student essentials inside a secure campus community.</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center">
              <div className="glass-panel p-3">
                <p className="text-2xl font-bold text-slate-900">3000+</p>
                <p className="text-xs text-slate-500">Items Reported</p>
              </div>
              <div className="glass-panel p-3">
                <p className="text-2xl font-bold text-slate-900">80%</p>
                <p className="text-xs text-slate-500">Items Returned</p>
              </div>
              <div className="glass-panel p-3">
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-xs text-slate-500">Support</p>
              </div>
            </div>
          </div>

          <div className="surface p-7 md:p-8 animate-fade-up-delay-1">
            <h3 className="text-xl font-semibold text-slate-900">Start with your student account</h3>
            <p className="mt-2 text-sm text-slate-600">A simple onboarding flow made for busy campus life.</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2"><CircleCheckBig size={16} className="text-teal-600" />Verified university users only</li>
              <li className="flex items-center gap-2"><CircleCheckBig size={16} className="text-teal-600" />Lost and found reporting in minutes</li>
              <li className="flex items-center gap-2"><CircleCheckBig size={16} className="text-teal-600" />Buy or sell used devices safely</li>
            </ul>
            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-sm text-slate-200">
              <p className="font-semibold">Tip</p>
              <p className="mt-1 text-slate-300">Include clear photos and pickup location details for faster matching.</p>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up-delay-2">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <feature.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
              <Link to="/register" className="mt-4 inline-flex items-center text-sm font-semibold text-teal-700 transition group-hover:text-teal-800">{feature.linkText} →</Link>
            </div>
          ))}
        </section>

        <section className="mt-14 animate-fade-up-delay-3">
          <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-2 text-sm text-slate-600">Four clear steps from report to return.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="surface p-5 text-center">
                <div className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{step.number}</div>
                <step.icon size={16} className="mx-auto mt-3 text-teal-700" />
                <h4 className="mt-3 font-semibold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home