import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import { HelpCircle, ChevronDown, ChevronUp, Shield, Search, MessageSquare, ShoppingBag } from 'lucide-react'

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I report a lost item?",
      answer: "Navigate to the 'Lost' section in your dashboard and click 'Create Lost Report'. Provide as much detail as possible, including photos and the location where you think you lost the item.",
      icon: <Search className="text-teal-600" size={20} />
    },
    {
      question: "Is my personal data safe?",
      answer: "Yes, we use industry-standard encryption and verify all users via their official university email addresses. Your contact details are only shared with verified claimers once you approve them.",
      icon: <Shield className="text-blue-600" size={20} />
    },
    {
      question: "Can I use a personal email to register?",
      answer: "No. To maintain the security and trust of our campus network, only official @my.sliit.lk and @sliit.lk email addresses are permitted for registration.",
      icon: <HelpCircle className="text-rose-600" size={20} />
    },
    {
      question: "How does the matching system work?",
      answer: "Our intelligent matching system compares details from Lost and Found reports in real-time. If a potential match is found, you will receive a notification to verify and claim your item.",
      icon: <HelpCircle className="text-amber-600" size={20} />
    },
    {
      question: "What is the Marketplace?",
      answer: "The Marketplace is a community-driven space where students can trade, sell, or give away items they no longer need, or find deals on essentials like textbooks and electronics.",
      icon: <ShoppingBag className="text-emerald-600" size={20} />
    },
    {
      question: "How do I provide feedback?",
      answer: "We value student input! You can navigate to the 'Feedback' section to share your thoughts, report bugs, or suggest new features to help us improve.",
      icon: <MessageSquare className="text-indigo-600" size={20} />
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Nav />

      {/* Decorative blurs to match About theme */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-56 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

      <main className="mx-auto flex-1 max-w-4xl px-4 py-16 animate-fade-up">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">FAQ</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">Common Questions</h1>
          <p className="mt-4 text-lg text-slate-600">Find quick answers to common questions about using the Lost & Found platform.</p>
        </div>

        <div className="space-y-4 mb-20 animate-fade-up-delay-1">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`surface rounded-3xl border border-slate-100 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-xl ring-2 ring-teal-500/10' : 'hover:shadow-lg'}`}
            >
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    {faq.icon}
                  </div>
                  <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                </div>
                <div className="bg-slate-50 p-1 rounded-lg text-slate-400">
                  {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-8 pb-8 pt-2 pl-[72px]">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-slate-900 rounded-3xl p-10 md:p-16 animate-fade-up-delay-2 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <h2 className="text-3xl font-bold text-white relative z-10">Still have more questions?</h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto relative z-10">Our community support team is here to help you with any specific issues or concerns.</p>
          <div className="mt-8 flex justify-center flex-wrap gap-4 relative z-10">
            <button className="btn bg-teal-500 hover:bg-teal-400 text-white border-0">Contact Support</button>
            <button className="btn bg-white/10 hover:bg-white/20 text-white border-white/20">System Status</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FAQ
