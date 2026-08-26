import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="text-center">
        <div className="display-1 fw-bold text-primary mb-2" style={{ letterSpacing: '-2px' }}>404</div>
        <h2 className="h4 text-dark mb-4">Page not found</h2>
        <p className="text-muted mb-4">Sorry, we couldn't find the page you're looking for.</p>
        <Link to="/" className="btn btn-primary px-4 py-2 d-inline-flex align-items-center">
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
