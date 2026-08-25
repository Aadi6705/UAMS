import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Alert, Card } from 'react-bootstrap';

const TimetableView = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await api.get('/timetable');
      setTimetable(res.data);
    } catch (err) {
      setError('Failed to fetch timetable.');
    } finally {
      setLoading(false);
    }
  };

  const getClassesForDay = (day) => {
    return timetable.filter(t => t.day.toLowerCase() === day.toLowerCase())
      .sort((a, b) => {
        // Simple string sort for HH:MM format
        return a.start_time.localeCompare(b.start_time);
      });
  };

  if (loading) return <div className="p-4">Loading your timetable...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Weekly Timetable</h2>
      
      {timetable.length === 0 ? (
        <Alert variant="info">No classes are scheduled for you at this time.</Alert>
      ) : (
        <div className="row g-4">
          {daysOfWeek.map(day => (
            <div className="col-md-6 col-lg-4" key={day}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-primary text-white fw-bold">
                  {day}
                </Card.Header>
                <ul className="list-group list-group-flush">
                  {getClassesForDay(day).length === 0 ? (
                    <li className="list-group-item text-muted text-center py-4">Free Day!</li>
                  ) : (
                    getClassesForDay(day).map(cls => (
                      <li className="list-group-item py-3" key={cls.id}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark">{cls.course.course_code}</strong>
                          <span className="badge bg-light text-dark border">
                            {cls.start_time} - {cls.end_time}
                          </span>
                        </div>
                        <div className="text-muted small mb-1">{cls.course.course_name}</div>
                        <div className="d-flex justify-content-between small">
                          <span><i className="bi bi-person me-1"></i>{cls.faculty.name}</span>
                          <span><i className="bi bi-geo-alt me-1"></i>{cls.room}</span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetableView;
