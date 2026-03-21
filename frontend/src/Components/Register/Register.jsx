import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Register.css'

const FACULTY_ID_RULES = {
  Computing: { prefix: 'IT', digits: 8 },
  Business: { prefix: 'BM', digits: 8 },
  Engineering: { prefix: 'EN', digits: 8 },
  'Humanities and sciences': { prefix: 'HM', digits: 8 },
  Architecture: { prefix: 'AC', digits: 8 },
};

function Register() {

  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    faculty: "",
    studentID: "",
    email: "",
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

  const selectedFacultyRule = FACULTY_ID_RULES[inputs.faculty] || null;
  const fullStudentID = selectedFacultyRule
    ? `${selectedFacultyRule.prefix}${inputs.studentID}`
    : '';
  const expectedUniversityEmail = fullStudentID ? `${fullStudentID}@my.sliit.lk` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'faculty') {
      const nextRule = FACULTY_ID_RULES[value] || null;
      setInputs((prevState) => ({
        ...prevState,
        faculty: value,
        studentID: nextRule
          ? prevState.studentID.replace(/\D/g, '').slice(0, nextRule.digits)
          : '',
      }));
      return;
    }

    if (name === 'studentID') {
      if (!selectedFacultyRule) {
        return;
      }
      const onlyDigits = value.replace(/\D/g, '').slice(0, selectedFacultyRule.digits);
      setInputs((prevState) => ({
        ...prevState,
        studentID: onlyDigits,
      }));
      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'password') {
      setPasswordHints({
        length: value.length >= 8,
        mix: /(?=.*[A-Za-z])(?=.*\d)/.test(value),
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(inputs.password)) {
      setError('Password must include letters and numbers');
      return;
    }
    if (!selectedFacultyRule) {
      setError('Please select your faculty');
      return;
    }
    if (inputs.studentID.length !== selectedFacultyRule.digits) {
      setError(`Enter exactly ${selectedFacultyRule.digits} digits after ${selectedFacultyRule.prefix}`);
      return;
    }
    if (inputs.email.trim().toLowerCase() !== expectedUniversityEmail.toLowerCase()) {
      setError(`University email must be ${expectedUniversityEmail}`);
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
      studentID: String(fullStudentID),
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
              <label className="label">Student ID</label>
              <div className="student-id-group">
                <span className={`student-id-prefix ${selectedFacultyRule ? 'active' : ''}`}>
                  {selectedFacultyRule ? selectedFacultyRule.prefix : '--'}
                </span>
                <input
                  type="text"
                  name="studentID"
                  placeholder={selectedFacultyRule ? `${selectedFacultyRule.digits} digits` : 'Select faculty first'}
                  value={inputs.studentID}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={selectedFacultyRule ? selectedFacultyRule.digits : 0}
                  disabled={!selectedFacultyRule}
                  required
                />
              </div>
              <small className="student-id-help">
                {selectedFacultyRule
                  ? `Final Student ID: ${fullStudentID || selectedFacultyRule.prefix}`
                  : 'Choose a faculty to set your Student ID prefix'}
              </small>
            </div>
            <div>
              <label className="label">University Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder={selectedFacultyRule ? expectedUniversityEmail : 'studentID@my.sliit.lk'}
                value={inputs.email}
                pattern="^[A-Za-z0-9._%+-]+@my\.sliit\.lk$"
                title="Use your @my.sliit.lk email"
                required
              />
              <small className="student-id-help">
                {selectedFacultyRule
                  ? `Must match: ${expectedUniversityEmail}`
                  : 'Select faculty and complete Student ID first'}
              </small>
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