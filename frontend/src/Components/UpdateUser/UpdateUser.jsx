import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function UpdateUser() {

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    studentID: '',
    faculty: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/Users/${id}`)
        .then((res) => res.data)
        .then((data) =>
          setInputs((prev) => ({
            ...prev,
            name: data.user?.name ?? '',
            email: data.user?.email ?? '',
            studentID: data.user?.studentID ?? '',
            faculty: data.user?.faculty ?? '',
            contactNumber: data.user?.contactNumber ?? '',
            password: '',
            confirmPassword: '',
          }))
        );
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    const payload = {
      name: String(inputs.name),
      email: String(inputs.email),
      studentID: String(inputs.studentID),
      faculty: String(inputs.faculty),
      contactNumber: String(inputs.contactNumber),
    };

    if (inputs.password || inputs.confirmPassword) {
      payload.password = String(inputs.password);
      payload.confirmPassword = String(inputs.confirmPassword);
    }

    return await axios
      .put(`http://localhost:5000/Users/${id}`, payload)
      .then((res) => res.data);
  }

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    history("/users");
  }

  return (
    <div>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input type="text" name="name" onChange={handleChange} placeholder='Name' value={inputs.name} required/>
        <br />
        <label>Email</label>
        <br />
        <input type="email" name="email" onChange={handleChange} placeholder='Email' value={inputs.email} required/>
        <br />
        <label>Student ID</label>
        <br />
        <input type="text" name="studentID" placeholder='Student ID' value={inputs.studentID} onChange={handleChange} required/>
        <br />
        <label>Faculty</label>
        <br />
        <select name="faculty" value={inputs.faculty} onChange={handleChange} required>
          <option value="" disabled>Select faculty</option>
          <option value="Computing">Computing</option>
          <option value="Business">Business</option>
          <option value="Enginering">Enginering</option>
          <option value="Humanities and sciences">Humanities and sciences</option>
          <option value="Architecture">Architecture</option>
        </select>
        <br />
        <label>Contact Number</label>
        <br />
        <input type="tel" name="contactNumber" placeholder='Contact Number' value={inputs.contactNumber} onChange={handleChange} required/>
        <br />
        <label>Password</label>
        <br />
        <input type="password" name="password" placeholder='Update password (optional)' value={inputs.password} onChange={handleChange} />
        <br />
        <label>Confirm Password</label>
        <br />
        <input type="password" name="confirmPassword" placeholder='Confirm password' value={inputs.confirmPassword} onChange={handleChange} />
        <br />
        <small>Leave password fields empty to keep the current password.</small>
        <br />
        <button type='submit'>Update User</button>
      </form>
    </div>
  )
}

export default UpdateUser