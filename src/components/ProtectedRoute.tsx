
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';

const ProtectedRoute: React.FC = () => {
  const { authenticated, loading } = useAuth();
  
  if (loading) {
    // Show loading screen while checking authentication
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
