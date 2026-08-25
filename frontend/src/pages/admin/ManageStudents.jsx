import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    department_id: '',
    semester: 1,
    batch: '',
    phone: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stuRes, depRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/departments')
      ]);
      setStudents(stuRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/admin/students', formData);
      setShowModal(false);
      setFormData({
        student_id: '', name: '', email: '', password: '', 
        department_id: '', semester: 1, batch: '', phone: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Students</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Student
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Batch</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No students found.</td></tr>
                ) : (
                  students.map((stu) => (
                    <tr key={stu.id}>
                      <td><strong>{stu.student_id}</strong></td>
                      <td>{stu.name}</td>
                      <td>{stu.user?.email}</td>
                      <td><span className="badge bg-primary">{stu.department?.code}</span></td>
                      <td>{stu.semester}</td>
                      <td>{stu.batch}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control type="text" required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select required value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.code}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control type="number" min="1" max="10" required value={formData.semester} onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch</Form.Label>
                  <Form.Control type="text" placeholder="e.g. 2026" required value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Student'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStudents;
