import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageStudents from './pages/admin/ManageStudents';
import DashboardLayout from './layouts/DashboardLayout';

import ManageCourses from './pages/admin/ManageCourses';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MarkAttendance from './pages/faculty/MarkAttendance';
import ManageMarks from './pages/faculty/ManageMarks';
import ManageMaterials from './pages/faculty/ManageMaterials';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentGrades from './pages/student/StudentGrades';
import StudentMaterials from './pages/student/StudentMaterials';
import TimetableView from './pages/shared/TimetableView';

import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/shared/NotFound';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Protected routes - Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="departments" element={<ManageDepartments />} />
              <Route path="faculty" element={<ManageFaculty />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="timetable" element={<TimetableView />} />
            </Route>
            
            {/* Protected routes - Faculty */}
            <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<FacultyDashboard />} />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="marks" element={<ManageMarks />} />
              <Route path="materials" element={<ManageMaterials />} />
              <Route path="timetable" element={<TimetableView />} />
            </Route>
            
            {/* Protected routes - Student */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="grades" element={<StudentGrades />} />
              <Route path="materials" element={<StudentMaterials />} />
              <Route path="timetable" element={<TimetableView />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
