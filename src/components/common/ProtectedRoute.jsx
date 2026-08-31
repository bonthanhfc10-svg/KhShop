import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return <Loading full />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
