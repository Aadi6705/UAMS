import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Enrolled Courses</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <div className="alert alert-info">You are not enrolled in any courses yet.</div>
      ) : (
        <div className="row g-4">
          {courses.map(course => (
            <div className="col-md-4" key={course.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-success mb-2">{course.course_code}</span>
                  <h5 className="card-title">{course.course_name}</h5>
                  <p className="card-text text-muted small">
                    Credits: {course.credits} <br/>
                    Department: {course.department?.code}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
