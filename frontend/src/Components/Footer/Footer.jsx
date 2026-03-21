import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>Lost & Found UM</h3>
          <p>
            Report lost items, return found belongings, and use the student
            marketplace to buy or sell used devices safely.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/users">Browse Reports</Link>
        </div>

        <div className="footer-links">
          <h4>Marketplace</h4>
          <Link to="/user-dashboard">Buy Items</Link>
          <Link to="/user-dashboard">Sell Items</Link>
          <Link to="/user-dashboard">My Listings</Link>
          <Link to="/user-dashboard">Safety Tips</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@my.sliit.lk</p>
          <p>Hours: Mon - Sat, 8:00 AM - 8:00 PM</p>
          <p>Location: University Main Campus</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lost & Found UM. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Guidelines</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer