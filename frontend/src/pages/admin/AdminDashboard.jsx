import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Departments</h5>
              <p className="card-text text-muted">Manage university departments, add new ones, and view their details.</p>
              <Link to="/admin/departments" className="btn btn-outline-primary btn-sm">Go to Departments</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Faculty</h5>
              <p className="card-text text-muted">Manage faculty members, assign them to departments, and oversee staff.</p>
              <Link to="/admin/faculty" className="btn btn-outline-primary btn-sm">Go to Faculty</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Students</h5>
              <p className="card-text text-muted">Manage student enrollments, batches, and personal details.</p>
              <Link to="/admin/students" className="btn btn-outline-primary btn-sm">Go to Students</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
