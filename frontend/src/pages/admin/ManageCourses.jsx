import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);

  // Forms data
  const [courseForm, setCourseForm] = useState({
    course_code: '', course_name: '', credits: 3, department_id: '', semester: 1
  });
  
  const [assignForm, setAssignForm] = useState({
    course_id: '', faculty_id: '', day: 'TBD', start_time: '00:00:00', end_time: '00:00:00', room: 'TBD'
  });

  const [enrollForm, setEnrollForm] = useState({
    student_id: '', course_id: '', academic_year: '2025-2026', semester: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [crsRes, depRes, facRes, stuRes] = await Promise.all([
        api.get('/courses'),
        api.get('/admin/departments'),
        api.get('/admin/faculty'),
        api.get('/admin/students')
      ]);
      setCourses(crsRes.data);
      setDepartments(depRes.data);
      setFacultyList(facRes.data);
      setStudentList(stuRes.data);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/courses', courseForm);
      setShowCourseModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/courses/assign', assignForm);
      setShowAssignModal(false);
      alert("Faculty assigned successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to assign faculty');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/courses/enroll', enrollForm);
      setShowEnrollModal(false);
      alert("Student enrolled successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to enroll student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Courses</h2>
        <div className="gap-2 d-flex">
          <Button variant="outline-success" onClick={() => setShowEnrollModal(true)}>Enroll Student</Button>
          <Button variant="outline-info" onClick={() => setShowAssignModal(true)}>Assign Faculty</Button>
          <Button variant="primary" onClick={() => setShowCourseModal(true)}>+ Add Course</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Department</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No courses found.</td></tr>
                ) : (
                  courses.map((crs) => (
                    <tr key={crs.id}>
                      <td><strong>{crs.course_code}</strong></td>
                      <td>{crs.course_name}</td>
                      <td>{crs.credits}</td>
                      <td><span className="badge bg-secondary">{crs.department?.code}</span></td>
                      <td>{crs.semester}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Course</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreateCourse}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Course Code</Form.Label>
              <Form.Control type="text" required value={courseForm.course_code} onChange={e => setCourseForm({...courseForm, course_code: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control type="text" required value={courseForm.course_name} onChange={e => setCourseForm({...courseForm, course_name: e.target.value})} />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="number" required value={courseForm.credits} onChange={e => setCourseForm({...courseForm, credits: parseInt(e.target.value)})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control type="number" required value={courseForm.semester} onChange={e => setCourseForm({...courseForm, semester: parseInt(e.target.value)})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select required value={courseForm.department_id} onChange={e => setCourseForm({...courseForm, department_id: e.target.value})}>
                    <option value="">Select...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={submitting}>Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Assign Faculty to Course</Modal.Title></Modal.Header>
        <Form onSubmit={handleAssignFaculty}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select required value={assignForm.course_id} onChange={e => setAssignForm({...assignForm, course_id: e.target.value})}>
                <option value="">Select Course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Faculty</Form.Label>
              <Form.Select required value={assignForm.faculty_id} onChange={e => setAssignForm({...assignForm, faculty_id: e.target.value})}>
                <option value="">Select Faculty...</option>
                {facultyList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Alert variant="info" className="small">Schedule details will default to "TBD" for now.</Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" type="submit" disabled={submitting}>Assign</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Enroll Modal */}
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Enroll Student in Course</Modal.Title></Modal.Header>
        <Form onSubmit={handleEnrollStudent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Form.Select required value={enrollForm.student_id} onChange={e => setEnrollForm({...enrollForm, student_id: e.target.value})}>
                <option value="">Select Student...</option>
                {studentList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select required value={enrollForm.course_id} onChange={e => setEnrollForm({...enrollForm, course_id: e.target.value})}>
                <option value="">Select Course...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_code}</option>)}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit" disabled={submitting}>Enroll</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCourses;
