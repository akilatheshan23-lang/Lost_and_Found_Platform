import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function User(props) {
  const { _id, name, email, studentID, faculty, contactNumber } = props.user;

  const history = useNavigate();

  const DeleteHandler = async () => {
    await axios
      .delete(`http://localhost:5000/Users/${_id}`)
      .then((res) => res.data)
      .then(() => history("/users"));
  }

  return (
    <div>
      <h1>User Display</h1>
      <br />
      <h1>Name: {name}</h1>
      <h1>Email: {email}</h1>
      <h1>Student ID: {studentID}</h1>
      <h1>Faculty: {faculty}</h1>
      <h1>Contact: {contactNumber}</h1>

      <Link to={`/users/${_id}`}>Update</Link>
      
      <button onClick={DeleteHandler}>Delete</button>
    </div>
  )
}

export default User