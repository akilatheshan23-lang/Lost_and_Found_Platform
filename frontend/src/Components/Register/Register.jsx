import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Register.css'

function Register() {

  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    studentID: "",
    faculty: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordHints, setPasswordHints] = useState({
    length: false,
    mix: false,
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'password') {
      const value = e.target.value;
      setPasswordHints({
        length: value.length >= 8,
        mix: /(?=.*[A-Za-z])(?=.*\d)/.test(value),
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.email.endsWith('@my.sliit.lk')) {
      setError('Use your university email (@my.sliit.lk)');
      return;
    }
    if (inputs.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(inputs.password)) {
      setError('Password must include letters and numbers');
      return;
    }
    if (inputs.password !== inputs.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await sendRequest();
      history("/users");
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  const sendRequest = async () => {
    return axios.post("http://localhost:5000/Users", {
      name: String(inputs.name),
      email: String(inputs.email),
      studentID: String(inputs.studentID),
      faculty: String(inputs.faculty),
      contactNumber: String(inputs.contactNumber),
      password: String(inputs.password),
      confirmPassword: String(inputs.confirmPassword),
    }).then((res) => res.data);
  }

  return (
    <div className="register-page">
      <Nav />
      <div className="register-shell">
        <div className="register-hero">
          <div className="hero-pill"><span />community verified</div>
          <h1>Join the Lost & Found network</h1>
          <p>
            Create your account to publish reports, receive alerts, and track
            recovery progress across campus.
          </p>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          <div className="form-grid">
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="name" onChange={handleChange} placeholder="Full Name" value={inputs.name} required />
            </div>
            <div>
              <label className="label">University Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="studentID@my.sliit.lk"
                value={inputs.email}
                pattern="^[A-Za-z0-9._%+-]+@my\.sliit\.lk$"
                title="Use your @my.sliit.lk email"
                required
              />
            </div>
            <div>
              <label className="label">Student ID</label>
              <input type="text" name="studentID" placeholder="Ex: IT20000011" value={inputs.studentID} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Faculty</label>
              <select name="faculty" value={inputs.faculty} onChange={handleChange} required>
                <option value="" disabled>
                  Select faculty
                </option>
                <option value="Computing">Computing</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Humanities and sciences">Humanities and sciences</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input type="tel" name="contactNumber" placeholder="Contact Number" value={inputs.contactNumber} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                required
              />
              <ul className="hint-list">
                <li className={passwordHints.length ? 'ok' : ''}>8+ characters</li>
                <li className={passwordHints.mix ? 'ok' : ''}>Letters & numbers mix</li>
              </ul>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={inputs.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button className="register-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register