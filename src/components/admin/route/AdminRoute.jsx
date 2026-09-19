import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import Loading from '../../common/Loading';

export default function AdminRoute({ children }) {
  const { user, isStaffOrAdmin, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) return <Loading full />;

  if (!user || !isStaffOrAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
