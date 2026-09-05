import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
