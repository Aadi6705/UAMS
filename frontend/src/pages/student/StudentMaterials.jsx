import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Form, Alert, Card, Row, Col, Badge } from 'react-bootstrap';

const StudentMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
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
      fetchMaterials();
    } else {
      setMaterials([]);
    }
  }, [selectedCourse]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/materials/course/${selectedCourse}`);
      setMaterials(res.data);
    } catch (err) {
      setError('Failed to fetch materials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Course Materials</h2>
      
      <Card className="border-0 shadow-sm mb-4 max-w-lg">
        <Card.Body>
          <Form.Group>
            <Form.Label>Select Course to view materials</Form.Label>
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
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p>Loading materials...</p>}

      {!loading && selectedCourse && materials.length === 0 && (
        <Alert variant="info">No materials have been uploaded for this course yet.</Alert>
      )}

      {!loading && materials.length > 0 && (
        <Row className="g-4">
          {materials.map(mat => (
            <Col md={6} lg={4} key={mat.id}>
              <Card className="h-100 border-0 shadow-sm material-card">
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title text-primary">{mat.title}</h5>
                  <div className="mb-2 text-muted small">
                    <i className="bi bi-clock me-1"></i>
                    {new Date(mat.uploaded_at).toLocaleDateString()} by {mat.faculty.name}
                  </div>
                  <Card.Text className="flex-grow-1 text-muted">
                    {mat.description || 'No description provided.'}
                  </Card.Text>
                  
                  <a 
                    href={mat.file_path} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-outline-primary mt-3"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Open Material
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default StudentMaterials;
