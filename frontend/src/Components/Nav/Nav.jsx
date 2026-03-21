import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav__brand">Lost & Found</div>
      <ul className="nav__links">
        <li><Link to="/mainhome">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Nav