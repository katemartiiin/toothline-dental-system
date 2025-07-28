import type { JSX } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { token, userRole } = useAuth();

  if (!token) {
    return <Navigate to="/admin/login" />;
  } else {
    if (requiredRole && userRole != requiredRole) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return children;
}
