import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h1>Lost and Found Platform</h1>
      <p>
        A campus community platform with <b>Found feed</b>, <b>Lost reports</b>, <b>Claims</b>, <b>Marketplace</b>, and a <b>Social Feed</b>.
      </p>
      <div className="row" style={{ marginTop: 10 }}>
        <Link className="btn" to="/found">Go to Found Feed</Link>
        <Link className="btn secondary" to="/marketplace">Go to Marketplace</Link>
        {!user && <Link className="btn secondary" to="/register">Create Account</Link>}
      </div>
      <small>Tip: Start with Found tab. Posts are stored in MongoDB.</small>
    </div>
  );
}
