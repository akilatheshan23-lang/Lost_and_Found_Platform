import React from 'react'
import Home from './Components/Home/Home.jsx'
import Users from './Components/UserDetails/Users.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from './Components/Register/Register.jsx'
import UpdateUser from './Components/UpdateUser/UpdateUser.jsx'
import CreateUser from './Components/UserDetails/CreateUser.jsx'
import Login from './Components/Login/Login.jsx'
import ForgotPassword from './Components/Login/ForgotPassword.jsx'
import ResetPassword from './Components/Login/ResetPassword.jsx'
import UserDashboard from './Components/Dashboard/UserDashboard.jsx'
import AdminDashboard from './Components/Dashboard/AdminDashboard.jsx'
import MfaSettings from './Components/MFA/MfaSettings.jsx'
import ProtectedRoute from './state/ProtectedRoute.jsx'
import { useAuth } from './state/AuthContext.jsx'

function App() {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return null
  }

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'
  const homeElement = isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Home />
  const loginElement = isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Login />
  const registerElement = isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Register />

  return (
    <div>
      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/mainhome" element={homeElement} />
        <Route path="/users" element={<Users />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/users/create" element={<CreateUser />} />
        </Route>
        <Route path="/register" element={registerElement} />
        <Route path="/login" element={loginElement} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/users/:id" element={<UpdateUser />} />
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['student','admin']} />}>
          <Route path="/mfa" element={<MfaSettings />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App