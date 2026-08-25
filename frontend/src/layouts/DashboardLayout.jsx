import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-white border-end shadow-sm flex-shrink-0" style={{ width: '250px' }}>
        <div className="p-3 border-bottom d-flex align-items-center">
          <h4 className="m-0 fw-bold" style={{ color: 'var(--primary-color)' }}>UAMS</h4>
        </div>
        
        <div className="p-3">
          <p className="text-muted small fw-bold text-uppercase mb-2">Menu</p>
          <ul className="nav flex-column gap-1">
            {user?.role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink to="/admin" end className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/departments" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Departments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/faculty" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Faculty
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/students" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Students
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/courses" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/timetable" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Timetable
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'FACULTY' && (
              <>
                <li className="nav-item">
                  <NavLink to="/faculty" end className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/attendance" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Manage Attendance
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/marks" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Manage Marks
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/materials" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Manage Materials
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/timetable" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Timetable
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'STUDENT' && (
              <>
                <li className="nav-item">
                  <NavLink to="/student" end className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Enrollments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/attendance" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Attendance
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/grades" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Grades
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/materials" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    Course Materials
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/timetable" className={({isActive}) => `nav-link rounded ${isActive ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                    My Timetable
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Header */}
        <header className="bg-white border-bottom shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="m-0 text-muted">Welcome, {user?.username}</h5>
          <div>
            <span className="badge bg-primary me-3">{user?.role}</span>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 overflow-auto flex-grow-1">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
