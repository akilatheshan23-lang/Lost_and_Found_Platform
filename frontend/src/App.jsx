import React from 'react'
import Home from './Components/Home/Home.jsx'
import Users from './Components/UserDetails/Users.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from './Components/Register/Register.jsx'
import UpdateUser from './Components/UpdateUser/UpdateUser.jsx'
// import CreateUser from './Components/UserDetails/CreateUser.jsx'
import Login from './Components/Login/Login.jsx'
import ForgotPassword from './Components/Login/ForgotPassword.jsx'
import ResetPassword from './Components/Login/ResetPassword.jsx'
import UserDashboard from './Components/Dashboard/UserDashboard.jsx'
import About from './Components/About/About.jsx'
import Services from './Components/Services/Services.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from './Components/Register/Register.jsx'
import UpdateUser from './Components/UpdateUser/UpdateUser.jsx'
import Login from './Components/Login/Login.jsx'
import ForgotPassword from './Components/Login/ForgotPassword.jsx'
import ResetPassword from './Components/Login/ResetPassword.jsx'
import AdminDashboard from './Components/Dashboard/AdminDashboard.jsx'
import MfaSettings from './Components/MFA/MfaSettings.jsx'
import ProtectedRoute from './state/ProtectedRoute.jsx'
import { useAuth } from './state/AuthContext.jsx'

// Premium Features
import HomeDashboard from './pages/HomeDashboard.jsx'
import PlaceholderView from './pages/PlaceholderView.jsx'

import UnifiedLayout from './UnifiedLayout.jsx'
import LostPage from './modules/lost_claim/pages/LostPage.jsx'
import ClaimsPage from './modules/lost_claim/pages/ClaimsPage.jsx'
import FeedbackPage from './modules/lost_claim/pages/FeedbackPage.jsx'
import AdminLostDashboard from './modules/lost_claim/pages/AdminLostDashboard.jsx'
import AdminClaimDashboard from './modules/lost_claim/pages/AdminClaimDashboard.jsx'
import CreateClaimPage from './modules/lost_claim/pages/CreateClaimPage.jsx'

import FoundFeed from './modules/found_social/pages/FoundFeed.jsx'
import SocialFeed from './modules/found_social/pages/SocialFeed.jsx'
import AdminFoundSocial from './modules/found_social/pages/AdminPanel.jsx'

import MarketplaceFeed from './modules/marketplace/pages/MarketplaceFeed.jsx'
import AdminMarketplace from './modules/marketplace/pages/AdminPanel.jsx'

function App() {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return null
  }

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'
  const homeElement = <Home />
  const loginElement = isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Login />
  const registerElement = isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Register />

  return (
    <div>
      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/mainhome" element={homeElement} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/users" element={<Users />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/users/create" element={<Register isAdminCreate={true} />} />
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
        
        {/* Unified Premium Features */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/user-dashboard" element={<HomeDashboard />} />
          
          <Route element={<UnifiedLayout />}>
            <Route path="/lost" element={<LostPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/claims/:id" element={<CreateClaimPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/found" element={<FoundFeed />} />
            <Route path="/social" element={<SocialFeed />} />
            <Route path="/marketplace" element={<MarketplaceFeed />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['student','admin']} />}>
          <Route path="/mfa" element={<MfaSettings />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route element={<UnifiedLayout />}>
            <Route path="/admin/lost-claim" element={
              <div className="space-y-8">
                 <AdminLostDashboard />
                 <AdminClaimDashboard />
              </div>
            } />
            <Route path="/admin/social-found" element={<AdminFoundSocial />} />
            <Route path="/admin/marketplace" element={<AdminMarketplace />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App