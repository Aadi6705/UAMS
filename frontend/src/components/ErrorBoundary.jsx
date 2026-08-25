import React from 'react';
import { Alert, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="text-center w-100" style={{ maxWidth: '600px' }}>
            <h1 className="display-1 text-danger mb-4"><i className="bi bi-exclamation-triangle"></i></h1>
            <h2 className="mb-4">Oops! Something went wrong.</h2>
            <Alert variant="danger" className="text-start">
              A component crashed during rendering. This is a fallback UI provided by the ErrorBoundary.
            </Alert>
            <button 
              className="btn btn-primary mt-4" 
              onClick={() => window.location.href = '/login'}
            >
              Return to Login
            </button>
          </div>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
