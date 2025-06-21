import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
