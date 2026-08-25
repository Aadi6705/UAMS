import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Placeholder dashboards until implemented
const AdminDashboard = () => <div className="p-4"><h1>Admin Dashboard</h1><p>Welcome, Admin!</p></div>;
const FacultyDashboard = () => <div className="p-4"><h1>Faculty Dashboard</h1><p>Welcome, Faculty!</p></div>;
const StudentDashboard = () => <div className="p-4"><h1>Student Dashboard</h1><p>Welcome, Student!</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected routes - Faculty */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route path="/faculty/*" element={<FacultyDashboard />} />
          </Route>
          
          {/* Protected routes - Student */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/*" element={<StudentDashboard />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
