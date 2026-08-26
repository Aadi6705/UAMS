import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light p-4">
      <div className="text-center">
        <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-shield-lock-fill fs-1"></i>
        </div>
        <h2 className="h3 fw-bold text-dark mb-2">Access Denied</h2>
        <p className="text-muted mb-4 max-w-md mx-auto">
          You don't have permission to access this page. If you believe this is an error, please contact the administrator.
        </p>
        <Link to="/" className="btn btn-primary px-4 py-2 d-inline-flex align-items-center rounded-3 shadow-sm">
          <i className="bi bi-house-door-fill me-2"></i> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
