import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle window resize for mobile check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Collapse sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to generate breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    if (paths.length === 0) return 'Home';
    return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
  };

  // Helper for generating Avatar Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const sidebarWidth = isSidebarCollapsed ? (isMobile ? '0px' : '80px') : '260px';

  return (
    <div className="d-flex min-vh-100 bg-light position-relative">
      {/* Mobile Overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2"
          onClick={() => setIsSidebarCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className="sidebar flex-shrink-0 d-flex flex-column transition-all z-3" 
        style={{ 
          width: sidebarWidth, 
          overflowX: 'hidden',
          ...(isMobile && { position: 'fixed', height: '100vh', left: isSidebarCollapsed ? '-260px' : '0' })
        }}
      >
        <div className="p-4 border-bottom d-flex align-items-center justify-content-center" style={{ minWidth: '260px' }}>
          <i className="bi bi-mortarboard-fill fs-3 me-2" style={{ color: 'var(--primary-color)' }}></i>
          {!isSidebarCollapsed || isMobile ? (
            <h4 className="m-0 fw-bold" style={{ color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>UAMS</h4>
          ) : null}
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto" style={{ minWidth: '260px' }}>
          {(!isSidebarCollapsed || isMobile) && (
            <p className="text-muted small fw-bold text-uppercase mb-3 px-2" style={{ letterSpacing: '1px' }}>Menu</p>
          )}
          <ul className="nav flex-column gap-2">
            {user?.role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink to="/admin" end className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Dashboard">
                    <i className="bi bi-grid-1x2-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Dashboard</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/departments" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Departments">
                    <i className="bi bi-building-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Departments</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/faculty" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Faculty">
                    <i className="bi bi-person-workspace me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Faculty</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/students" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Students">
                    <i className="bi bi-people-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Students</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/courses" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Courses">
                    <i className="bi bi-book-half me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Courses</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/timetable" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Timetable">
                    <i className="bi bi-calendar-week-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Timetable</span>}
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'FACULTY' && (
              <>
                <li className="nav-item">
                  <NavLink to="/faculty" end className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="My Courses">
                    <i className="bi bi-journal-bookmark-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>My Courses</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/attendance" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Manage Attendance">
                    <i className="bi bi-ui-checks me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Manage Attendance</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/marks" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Manage Marks">
                    <i className="bi bi-file-earmark-bar-graph-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Manage Marks</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/materials" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Materials">
                    <i className="bi bi-cloud-arrow-up-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Materials</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faculty/timetable" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Timetable">
                    <i className="bi bi-calendar-week-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Timetable</span>}
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'STUDENT' && (
              <>
                <li className="nav-item">
                  <NavLink to="/student" end className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="My Enrollments">
                    <i className="bi bi-journal-bookmark-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>My Enrollments</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/attendance" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="My Attendance">
                    <i className="bi bi-ui-checks me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>My Attendance</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/grades" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="My Grades">
                    <i className="bi bi-file-earmark-bar-graph-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>My Grades</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/materials" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Materials">
                    <i className="bi bi-cloud-arrow-down-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Materials</span>}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/student/timetable" className={({isActive}) => `nav-link px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`} title="Timetable">
                    <i className="bi bi-calendar-week-fill me-3 fs-5"></i>
                    {(!isSidebarCollapsed || isMobile) && <span>Timetable</span>}
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden w-100 transition-all">
        {/* Top Header */}
        <header className="bg-white border-bottom shadow-sm px-4 py-3 d-flex justify-content-between align-items-center" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-light border-0 shadow-none d-flex align-items-center justify-content-center p-2 rounded-circle hover-bg-light"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <h5 className="m-0 text-muted fw-normal d-none d-sm-block">
              <span className="opacity-75">{getBreadcrumbs()}</span>
            </h5>
          </div>
          
          <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-end px-3 max-w-md">
            {/* Global Search Input */}
            <div className="input-group d-none d-md-flex max-w-sm">
              <span className="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 focus-none rounded-end-pill py-2" 
                placeholder="Global search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center gap-2 border-0 bg-transparent shadow-none hover-bg-light p-1 rounded">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
                  {getInitials(user?.username)}
                </div>
                <div className="text-start d-none d-md-block">
                  <div className="fw-bold lh-1 text-dark" style={{ fontSize: '14px' }}>{user?.username}</div>
                  <small className="text-muted text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>{user?.role}</small>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 mt-2 rounded-3">
                <Dropdown.Header>Signed in as <strong>{user?.username}</strong></Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2 py-2">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* Mobile Search - Only visible on small screens */}
        <div className="d-block d-md-none p-3 bg-white border-bottom">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control bg-light border-start-0 focus-none rounded-end-pill py-2" 
              placeholder="Global search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 p-md-5 overflow-auto flex-grow-1 bg-light">
          <div className="fade-in pb-4 h-100">
            {/* Pass search term to child routes */}
            <Outlet context={{ searchTerm, setSearchTerm }} />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-top py-3 px-4 text-center text-md-start">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
            <span>&copy; {new Date().getFullYear()} University Management System. All rights reserved.</span>
            <span className="fw-semibold mt-2 mt-md-0">UAMS v1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
