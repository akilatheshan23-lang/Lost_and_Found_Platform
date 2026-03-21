import React from 'react'
import './App.css'
import Home from './Components/Home/Home.jsx'
import Users from './Components/UserDetails/Users.jsx'
import { Route, Routes } from 'react-router-dom'
import Register from './Components/Register/Register.jsx'
import UpdateUser from './Components/UpdateUser/UpdateUser.jsx'
import Login from './Components/Login/Login.jsx'
import UserDashboard from './Components/Dashboard/UserDashboard.jsx'
import AdminDashboard from './Components/Dashboard/AdminDashboard.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:id" element={<UpdateUser />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

export default App