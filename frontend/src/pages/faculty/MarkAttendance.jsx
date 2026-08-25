import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const MarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch faculty courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses.');
    }
  };

  // Fetch students and existing attendance when course or date changes
  useEffect(() => {
    if (selectedCourse && date) {
      fetchAttendanceData();
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  }, [selectedCourse, date]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      // Fetch enrolled students
      const stuRes = await api.get(`/attendance/courses/${selectedCourse}/students`);
      const enrolledStudents = stuRes.data;
      
      // Fetch existing attendance for the date
      const attRes = await api.get(`/attendance/courses/${selectedCourse}?date=${date}`);
      const existingAttendance = attRes.data;
      
      // Pre-fill attendanceData
      const newAttData = {};
      
      enrolledStudents.forEach(stu => {
        // Find if they have an existing record
        const record = existingAttendance.find(r => r.student_id === stu.id);
        if (record) {
          newAttData[stu.id] = record.status;
        } else {
          // Default to PRESENT
          newAttData[stu.id] = 'PRESENT';
        }
      });

      setStudents(enrolledStudents);
      setAttendanceData(newAttData);
      
      if (existingAttendance.length > 0) {
        setMessage(`Editing existing attendance for ${date}.`);
      }

    } catch (err) {
      setError('Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    
    // Format data for bulk creation
    const records = Object.keys(attendanceData).map(studentId => ({
      student_id: parseInt(studentId),
      status: attendanceData[studentId]
    }));

    const payload = {
      course_id: parseInt(selectedCourse),
      date: date,
      records: records
    };

    try {
      await api.post('/attendance', payload);
      setMessage('Attendance saved successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Mark Attendance</h2>
      
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Select Course</Form.Label>
                <Form.Select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {loading && <p>Loading students...</p>}
      
      {!loading && selectedCourse && students.length === 0 && (
        <Alert variant="info">No students are enrolled in this course.</Alert>
      )}

      {!loading && students.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <Form onSubmit={handleSubmit}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th className="text-center">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(stu => (
                      <tr key={stu.id}>
                        <td className="align-middle"><strong>{stu.student_id}</strong></td>
                        <td className="align-middle">{stu.name}</td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <input 
                              type="radio" 
                              className="btn-check" 
                              name={`attendance-${stu.id}`} 
                              id={`present-${stu.id}`} 
                              autoComplete="off" 
                              checked={attendanceData[stu.id] === 'PRESENT'}
                              onChange={() => handleToggle(stu.id, 'PRESENT')}
                            />
                            <label className="btn btn-outline-success btn-sm" htmlFor={`present-${stu.id}`}>Present</label>

                            <input 
                              type="radio" 
                              className="btn-check" 
                              name={`attendance-${stu.id}`} 
                              id={`absent-${stu.id}`} 
                              autoComplete="off" 
                              checked={attendanceData[stu.id] === 'ABSENT'}
                              onChange={() => handleToggle(stu.id, 'ABSENT')}
                            />
                            <label className="btn btn-outline-danger btn-sm" htmlFor={`absent-${stu.id}`}>Absent</label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-light border-top d-flex justify-content-end">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
