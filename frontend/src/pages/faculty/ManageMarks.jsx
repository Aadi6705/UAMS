import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const ManageMarks = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [examType, setExamType] = useState('Mid-Sem');
  
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const stuRes = await api.get(`/attendance/courses/${selectedCourse}/students`);
      setStudents(stuRes.data);
      
      // Initialize marksData state
      const initialMarks = {};
      stuRes.data.forEach(s => {
        initialMarks[s.id] = { obtained: '', max: 100 };
      });
      setMarksData(initialMarks);
    } catch (err) {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarksData({
      ...marksData,
      [studentId]: {
        ...marksData[studentId],
        [field]: value
      }
    });
  };

  const handleSubmit = async (studentId) => {
    const data = marksData[studentId];
    if (data.obtained === '' || data.max === '') {
      setError('Please fill in both obtained and max marks.');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    setError('');
    
    try {
      await api.post('/marks', {
        student_id: studentId,
        course_id: parseInt(selectedCourse),
        exam_type: examType,
        marks_obtained: parseFloat(data.obtained),
        max_marks: parseFloat(data.max)
      });
      setMessage(`Marks uploaded successfully for student ID ${studentId}.`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload marks.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Marks</h2>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
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
                <Form.Label>Exam Type</Form.Label>
                <Form.Select 
                  value={examType} 
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option value="Internal">Internal Assessment</option>
                  <option value="Mid-Sem">Mid-Semester Exam</option>
                  <option value="End-Sem">End-Semester Exam</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {loading && <p>Loading students...</p>}
      
      {!loading && selectedCourse && students.length === 0 && (
        <Alert variant="info">No students are enrolled in this course.</Alert>
      )}

      {!loading && students.length > 0 && (
        <Card className="border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Obtained Marks</th>
                  <th>Max Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr key={stu.id}>
                    <td className="align-middle"><strong>{stu.student_id}</strong></td>
                    <td className="align-middle">{stu.name}</td>
                    <td className="align-middle" style={{ width: '150px' }}>
                      <Form.Control 
                        type="number" 
                        min="0"
                        value={marksData[stu.id]?.obtained || ''}
                        onChange={(e) => handleMarkChange(stu.id, 'obtained', e.target.value)}
                        placeholder="e.g. 85"
                      />
                    </td>
                    <td className="align-middle" style={{ width: '150px' }}>
                      <Form.Control 
                        type="number" 
                        min="1"
                        value={marksData[stu.id]?.max || ''}
                        onChange={(e) => handleMarkChange(stu.id, 'max', e.target.value)}
                      />
                    </td>
                    <td className="align-middle">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        disabled={submitting}
                        onClick={() => handleSubmit(stu.id)}
                      >
                        Upload
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ManageMarks;
