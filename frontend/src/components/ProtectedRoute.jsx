import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * Wraps routes that require authentication.
 * Shows a spinner while loading, redirects to /login if unauthenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <LoadingSpinner size="lg" text="Loading TaskFlow..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
