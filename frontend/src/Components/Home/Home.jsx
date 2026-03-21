import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import './Home.css'

function Home() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l8 4v6c0 5-3.5 8-8 8s-8-3-8-8V7l8-4zm0 4.2L7 9.7V13c0 3.5 2.3 5.7 5 6.6 2.7-.9 5-3.1 5-6.6V9.7l-5-2.5z" />
        </svg>
      ),
      title: 'Report Lost Item',
      text: 'Lost your belongings? Post details and let others help you find them quickly.',
      linkText: 'Report Now',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16v10H8l-4 4V6zm2 2v7.2L7.2 14H18V8H6zm3 1h6v2H9V9z" />
        </svg>
      ),
      title: 'Post Found Item',
      text: 'Found something? Upload it and help return it to the rightful owner.',
      linkText: 'Post Item',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h2l2.4 10.5c.1.3.4.5.7.5H18v2H8.1c-1.2 0-2.2-.8-2.5-2L3 6zm5-1h12v2H8V5zm1 16a2 2 0 110 4 2 2 0 010-4zm8 0a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      ),
      title: 'Student Marketplace',
      text: 'Buy and sell used laptops, phones and student essentials safely.',
      linkText: 'Open Marketplace',
    },
  ];

  const steps = [
    { number: '01', title: 'Register', text: 'Create your student account using university email.' },
    { number: '02', title: 'Post', text: 'Report lost items or upload found items in minutes.' },
    { number: '03', title: 'Match', text: 'Users connect and verify ownership details.' },
    { number: '04', title: 'Return', text: 'Meet safely and complete the item handover.' },
  ];

  return (
    <div className="home">
      <Nav />
      <div className="home-bg-shape" />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>Campus Lost & Found Platform</h1>
          <p>
            Report lost items, post found belongings, and trade used items
            safely within your university community.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary">
              Get Started
            </Link>

            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel">
            <p className="panel-title">Start with your student account and access everything in one place.

</p>
            <ul>
              <li><span />Verified university users only</li>
              <li><span />Lost and found reporting in minutes</li>
              <li><span />Buy or sell used devices safely</li>
            </ul>
          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="features">
        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
            <Link to="/register" className="link-btn">
              {feature.linkText}
            </Link>
          </div>
        ))}
      </section>


      {/* HOW IT WORKS */}
      <section className="how">
        <h2>How It Works</h2>

        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <span className="step-badge">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* STATS */}
      <section className="stats">
        <div className="stat">
          <h2>3000+</h2>
          <p>Items Reported</p>
        </div>

        <div className="stat">
          <h2>80%</h2>
          <p>Items Returned</p>
        </div>

        <div className="stat">
          <h2>1000+</h2>
          <p>Marketplace Posts</p>
        </div>

        <div className="stat">
          <h2>24/7</h2>
          <p>Community Support</p>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default Home