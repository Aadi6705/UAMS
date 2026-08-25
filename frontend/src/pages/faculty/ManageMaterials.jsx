import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const ManageMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !title || !link) {
      setError('Please fill in Course, Title, and Link.');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    setError('');
    
    try {
      await api.post('/materials', {
        course_id: parseInt(selectedCourse),
        title,
        description,
        file_path: link // Storing external link as file_path per plan
      });
      setMessage('Material linked successfully!');
      setTitle('');
      setDescription('');
      setLink('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload material.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Upload Course Materials</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Card className="border-0 shadow-sm max-w-lg">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Course</Form.Label>
              <Form.Select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Material Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Lecture 1 Slides"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                placeholder="Optional notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>External Link / URL</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://drive.google.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Provide a valid Google Drive, Dropbox, or other external URL.
              </Form.Text>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Link Material'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageMaterials;
