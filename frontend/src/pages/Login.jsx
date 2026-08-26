import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login = () => {
  useDocumentTitle('Login');
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to respective dashboard
  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'FACULTY') return <Navigate to="/faculty" />;
    return <Navigate to="/student" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow-sm fade-in" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h1 className="h3 mb-2" style={{ color: 'var(--primary-color)' }}>UAMS</h1>
            <p className="text-muted">Sign in to your account</p>
          </div>
          
          {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2" 
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Sign In
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer text */}
      <div className="mt-4 text-center text-muted small fade-in">
        <p>University Academic Management System &copy; 2026</p>
      </div>
    </div>
  );
};

export default Login;
