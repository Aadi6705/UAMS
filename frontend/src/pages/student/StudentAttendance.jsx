import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Alert, ProgressBar, Card } from 'react-bootstrap';

const StudentAttendance = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/attendance/student/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      setError('Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading your attendance data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!dashboardData) return null;

  return (
    <div>
      <h2 className="mb-4">My Attendance Dashboard</h2>

      <div className="row mb-5">
        <div className="col-md-12">
          <Card className={`border-0 shadow text-center text-white ${dashboardData.overall_percentage >= 75 ? 'bg-success' : 'bg-danger'}`}>
            <Card.Body className="py-5">
              <h5 className="text-uppercase fw-bold opacity-75">Overall Attendance</h5>
              <h1 className="display-1 fw-bold mb-0">{dashboardData.overall_percentage}%</h1>
              <p className="lead mt-3 opacity-75">
                {dashboardData.overall_percentage >= 75 
                  ? "Great job! You are eligible to sit for exams."
                  : "Warning: Your overall attendance is below the 75% requirement!"}
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>

      <h4 className="mb-3">Course Breakdown</h4>
      <div className="row g-4">
        {dashboardData.courses.length === 0 ? (
          <div className="col-12"><Alert variant="info">You are not enrolled in any courses yet.</Alert></div>
        ) : (
          dashboardData.courses.map(course => (
            <div className="col-md-6" key={course.course_id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className={`badge mb-2 ${course.is_eligible ? 'bg-success' : 'bg-danger'}`}>
                        {course.course_code}
                      </span>
                      <h5 className="card-title m-0">{course.course_name}</h5>
                    </div>
                    <h3 className={`m-0 fw-bold ${course.is_eligible ? 'text-success' : 'text-danger'}`}>
                      {course.attendance_percentage}%
                    </h3>
                  </div>

                  <ProgressBar 
                    now={course.attendance_percentage} 
                    variant={course.is_eligible ? "success" : "danger"} 
                    className="mb-3" 
                    style={{ height: '8px' }}
                  />

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Classes Attended: <strong>{course.classes_attended} / {course.total_classes}</strong></span>
                    <span>
                      Status: <strong>{course.is_eligible ? 'Eligible' : 'Not Eligible'}</strong>
                    </span>
                  </div>

                  {course.prediction_message && (
                    <Alert variant="warning" className="py-2 mb-0 mt-3 small fw-bold">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {course.prediction_message}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
