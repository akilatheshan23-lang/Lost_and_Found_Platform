import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Building2, IdCard, Loader2, Lock, Mail, Phone, User } from 'lucide-react'

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
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="surface mb-6 bg-gradient-to-r from-slate-900 to-slate-700 p-7 text-white animate-fade-up">
          <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-100">community verified</div>
          <h1 className="mt-3 text-3xl font-bold">Join the Lost & Found network</h1>
          <p className="mt-2 max-w-2xl text-slate-200">Create your account to publish reports, receive alerts, and track recovery progress across campus.</p>
        </div>

        <form className="surface grid gap-4 p-7 animate-fade-up-delay-1" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-slate-900">Create your account</h2>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><User size={15} /> Full Name</label>
              <input className="field mt-1" type="text" name="name" onChange={handleChange} placeholder="Full Name" value={inputs.name} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Building2 size={15} /> Faculty</label>
              <select className="field mt-1" name="faculty" value={inputs.faculty} onChange={handleChange} required>
                <option value="" disabled>Select faculty</option>
                <option value="Computing">Computing</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Humanities and sciences">Humanities and sciences</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><IdCard size={15} /> Student ID</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700">{selectedFacultyRule ? selectedFacultyRule.prefix : '--'}</span>
                <input className="field flex-1" type="text" name="studentID" placeholder={selectedFacultyRule ? `${selectedFacultyRule.digits} digits` : 'Select faculty first'} value={inputs.studentID} onChange={handleChange} inputMode="numeric" pattern="[0-9]*" maxLength={selectedFacultyRule ? selectedFacultyRule.digits : 0} disabled={!selectedFacultyRule} required />
              </div>
              <small className="text-xs text-slate-500">{selectedFacultyRule ? `Final Student ID: ${fullStudentID || selectedFacultyRule.prefix}` : 'Choose a faculty to set your Student ID prefix'}</small>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Mail size={15} /> University Email</label>
              <input className="field mt-1" type="email" name="email" onChange={handleChange} placeholder={selectedFacultyRule ? expectedUniversityEmail : 'studentID@my.sliit.lk'} value={inputs.email} pattern="^[A-Za-z0-9._%+-]+@my\.sliit\.lk$" title="Use your @my.sliit.lk email" required />
              <small className="text-xs text-slate-500">{selectedFacultyRule ? `Must match: ${expectedUniversityEmail}` : 'Select faculty and complete Student ID first'}</small>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Phone size={15} /> Contact Number</label>
              <input className="field mt-1" type="tel" name="contactNumber" placeholder="Contact Number" value={inputs.contactNumber} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Lock size={15} /> Password</label>
              <input className="field mt-1" type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
              <ul className="mt-1 text-xs text-slate-500">
                <li className={passwordHints.length ? 'text-green-600' : ''}>8+ characters</li>
                <li className={passwordHints.mix ? 'text-green-600' : ''}>Letters & numbers mix</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 inline-flex items-center gap-2"><Lock size={15} /> Confirm Password</label>
              <input className="field mt-1" type="password" name="confirmPassword" placeholder="Confirm Password" value={inputs.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="pt-1">
            <button className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Registering...</span> : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register