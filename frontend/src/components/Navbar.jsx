import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const linkStyle = ({ isActive }) => ({
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #22304f",
  background: isActive ? "#1f2a44" : "transparent",
});

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="nav">
      <div className="container nav-inner">
        <Link to="/" style={{ fontWeight: 700 }}>Lost and Found Platform</Link>

        <div className="nav-links">
          <NavLink to="/found" style={linkStyle}>Found</NavLink>
          <NavLink to="/lost" style={linkStyle}>Lost</NavLink>
          <NavLink to="/social" style={linkStyle}>Social</NavLink>
          <NavLink to="/marketplace" style={linkStyle}>Marketplace</NavLink>
          {user && <NavLink to="/profile" style={linkStyle}>Profile</NavLink>}
          {user?.role === "ADMIN" && <NavLink to="/admin" style={linkStyle}>Admin</NavLink>}
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {user ? (
            <>
              <span className="badge">{user.name}</span>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={linkStyle}>Login</NavLink>
              <NavLink to="/register" style={linkStyle}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
