import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccessDenied from '../pages/shared/AccessDenied';

const ProtectedRoute = ({ children, allowedRoles }) => {
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

  // Role not permitted -> render AccessDenied page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  // Authorized -> render children if provided, else Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
