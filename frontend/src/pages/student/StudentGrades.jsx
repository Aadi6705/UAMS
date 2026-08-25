import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Alert, Card, Row, Col } from 'react-bootstrap';

const StudentGrades = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await api.get('/marks/student/dashboard');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch grades.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading your grades...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data) return null;

  return (
    <div>
      <h2 className="mb-4">My Academic Record</h2>

      <Row className="mb-5">
        <Col md={12}>
          <Card className="border-0 shadow bg-primary text-white text-center">
            <Card.Body className="py-4">
              <h5 className="text-uppercase fw-bold opacity-75">Cumulative Grade Point Average (CGPA)</h5>
              <h1 className="display-2 fw-bold mb-0">{data.cgpa}</h1>
              <p className="lead mt-2 opacity-75">
                Total Credits Completed: {data.total_credits}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3">Course Breakdown</h4>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover bg-white mb-0">
          <thead className="table-light">
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th className="text-center">Credits</th>
              <th className="text-center">Percentage</th>
              <th className="text-center">Grade</th>
              <th className="text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No marks uploaded yet.</td>
              </tr>
            ) : (
              data.courses.map(course => (
                <tr key={course.course_id}>
                  <td className="align-middle fw-bold">{course.course_code}</td>
                  <td className="align-middle">{course.course_name}</td>
                  <td className="align-middle text-center">{course.credits}</td>
                  <td className="align-middle text-center">{course.percentage}%</td>
                  <td className="align-middle text-center fw-bold text-primary">{course.grade}</td>
                  <td className="align-middle text-center">{course.grade_point}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentGrades;
