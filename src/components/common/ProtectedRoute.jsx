import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) return <Loading full />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
