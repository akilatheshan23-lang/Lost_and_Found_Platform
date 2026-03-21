import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../Nav/Nav'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Nav />
      <div className="home-bg" />

      <header className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Lost and Found Platform</p>
          <h1>Bring every lost item back home.</h1>
          <p className="lead">
            A community driven hub to report, match, and recover items across
            campus in minutes.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span className="tag">Live</span>
            <p>Latest match</p>
          </div>
          <h2>Blue umbrella found near Library North</h2>
          <p className="card-note">Matching report submitted 6 mins ago.</p>
          <div className="card-actions">
            <Link to="/users" className="btn btn-light">Browse reports</Link>
            <Link to="/dashboard" className="btn btn-link">Open dashboard</Link>
          </div>
        </div>
      </header>

      <section className="home-grid">
        <div className="feature">
          <h3>Report Fast</h3>
          <p>Post lost or found items with photos, locations, and time stamps.</p>
        </div>
        <div className="feature">
          <h3>Smart Matching</h3>
          <p>Auto suggestions highlight likely matches to speed recovery.</p>
        </div>
        <div className="feature">
          <h3>Trusted Network</h3>
          <p>Verified volunteers help verify items before handoff.</p>
        </div>
      </section>
    </div>
  )
}

export default Home
