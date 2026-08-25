import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not permitted -> redirect to unauthorized or their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // For simplicity, just redirect them to their home based on role
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'FACULTY') return <Navigate to="/faculty" replace />;
    return <Navigate to="/student" replace />;
  }

  // Authorized -> render child routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
