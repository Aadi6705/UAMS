import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/admin/departments', formData);
      setShowModal(false);
      setFormData({ name: '', code: '' });
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Departments</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Department
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Department Name</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr>
                ) : departments.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-4 text-muted">No departments found.</td></tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.id}</td>
                      <td><span className="badge bg-secondary">{dept.code}</span></td>
                      <td>{dept.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Department</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Department Code (e.g. CS)</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Department'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageDepartments;
