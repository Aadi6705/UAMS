import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    faculty_id: '',
    name: '',
    email: '',
    password: '',
    designation: '',
    department_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facRes, depRes] = await Promise.all([
        api.get('/admin/faculty'),
        api.get('/admin/departments')
      ]);
      setFaculty(facRes.data);
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
      await api.post('/admin/faculty', formData);
      setShowModal(false);
      setFormData({
        faculty_id: '', name: '', email: '', password: '', designation: '', department_id: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create faculty member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Faculty</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Faculty
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : faculty.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No faculty found.</td></tr>
                ) : (
                  faculty.map((fac) => (
                    <tr key={fac.id}>
                      <td><strong>{fac.faculty_id}</strong></td>
                      <td>{fac.name}</td>
                      <td>{fac.user?.email}</td>
                      <td>{fac.designation}</td>
                      <td><span className="badge bg-info text-dark">{fac.department?.code}</span></td>
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
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty ID</Form.Label>
                  <Form.Control type="text" required value={formData.faculty_id} onChange={(e) => setFormData({...formData, faculty_id: e.target.value})} />
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control type="text" required value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select required value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select Department...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Faculty'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFaculty;
