import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminProjects from './components/admin/AdminProjects'
import AdminSkills from './components/admin/AdminSkills'
import AdminCertifications from './components/admin/AdminCertifications'
import AdminHackathons from './components/admin/AdminHackathons'
import AdminSoftSkills from './components/admin/AdminSoftSkills'
import AdminHobbies from './components/admin/AdminHobbies'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects"       element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/skills"         element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/certifications" element={<ProtectedRoute><AdminCertifications /></ProtectedRoute>} />
          <Route path="/admin/hackathons"     element={<ProtectedRoute><AdminHackathons /></ProtectedRoute>} />
          <Route path="/admin/softskills"     element={<ProtectedRoute><AdminSoftSkills /></ProtectedRoute>} />
          <Route path="/admin/hobbies"        element={<ProtectedRoute><AdminHobbies /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}