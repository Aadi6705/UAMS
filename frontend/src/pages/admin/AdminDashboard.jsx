import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AdminDashboard = () => {
  useDocumentTitle('Dashboard');
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    departments: 0,
    faculty: 0,
    students: 0,
    courses: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [deptRes, facRes, stuRes, crsRes] = await Promise.all([
          api.get('/admin/departments'),
          api.get('/admin/faculty'),
          api.get('/admin/students'),
          api.get('/courses')
        ]);
        
        const depts = deptRes.data;
        const students = stuRes.data;

        setStats({
          departments: depts.length,
          faculty: facRes.data.length,
          students: students.length,
          courses: crsRes.data.length
        });

        // Compute chart data: Students per department
        const distribution = depts.map(d => ({
          name: d.code,
          Students: students.filter(s => s.department?.id === d.id || s.department_id === d.id).length
        }));
        setChartData(distribution);

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="mb-4">Dashboard Overview</h2>
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Overview</h2>
      </div>
      
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card h-100 border-0 transition-all hover-lift">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded p-3 me-3 text-primary">
                <i className="bi bi-building-fill fs-4"></i>
              </div>
              <div>
                <h3 className="m-0 fw-bold">{stats.departments}</h3>
                <small className="text-muted text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>Departments</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 border-0 transition-all hover-lift">
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded p-3 me-3 text-success">
                <i className="bi bi-person-workspace fs-4"></i>
              </div>
              <div>
                <h3 className="m-0 fw-bold">{stats.faculty}</h3>
                <small className="text-muted text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>Faculty</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 border-0 transition-all hover-lift">
            <div className="card-body d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded p-3 me-3 text-warning">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <h3 className="m-0 fw-bold">{stats.students}</h3>
                <small className="text-muted text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>Students</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 border-0 transition-all hover-lift">
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 rounded p-3 me-3 text-danger">
                <i className="bi bi-book-half fs-4"></i>
              </div>
              <div>
                <h3 className="m-0 fw-bold">{stats.courses}</h3>
                <small className="text-muted text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>Courses</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-md-8">
          <div className="card border-0 h-100 transition-all hover-lift">
            <div className="card-header border-0 bg-transparent pt-4 pb-0 px-4">
              <h5 className="mb-0 fw-bold">Students per Department</h5>
            </div>
            <div className="card-body p-4">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                    <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="Students" fill="var(--primary-color)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="col-md-4">
          <div className="card border-0 h-100 transition-all hover-lift">
            <div className="card-header border-0 bg-transparent pt-4 pb-0 px-4">
              <h5 className="mb-0 fw-bold">Quick Links</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                <Link to="/admin/departments" className="text-decoration-none p-3 rounded bg-light hover-bg-white border transition-all d-flex align-items-center">
                  <div className="bg-white rounded shadow-sm p-2 me-3 text-primary"><i className="bi bi-building-add"></i></div>
                  <div>
                    <h6 className="m-0 text-dark fw-bold">Manage Departments</h6>
                    <small className="text-muted">Add or update departments</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>
                <Link to="/admin/faculty" className="text-decoration-none p-3 rounded bg-light hover-bg-white border transition-all d-flex align-items-center">
                  <div className="bg-white rounded shadow-sm p-2 me-3 text-success"><i className="bi bi-person-add"></i></div>
                  <div>
                    <h6 className="m-0 text-dark fw-bold">Manage Faculty</h6>
                    <small className="text-muted">Onboard new professors</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>
                <Link to="/admin/students" className="text-decoration-none p-3 rounded bg-light hover-bg-white border transition-all d-flex align-items-center">
                  <div className="bg-white rounded shadow-sm p-2 me-3 text-warning"><i className="bi bi-person-lines-fill"></i></div>
                  <div>
                    <h6 className="m-0 text-dark fw-bold">Manage Students</h6>
                    <small className="text-muted">Update student records</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>
                <Link to="/admin/timetable" className="text-decoration-none p-3 rounded bg-light hover-bg-white border transition-all d-flex align-items-center">
                  <div className="bg-white rounded shadow-sm p-2 me-3 text-info"><i className="bi bi-calendar-plus"></i></div>
                  <div>
                    <h6 className="m-0 text-dark fw-bold">View Timetable</h6>
                    <small className="text-muted">Check class schedules</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
