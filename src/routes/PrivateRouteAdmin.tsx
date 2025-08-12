import React, { useContext, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

interface PrivateRouteAdminProps {
  children: JSX.Element;
}

const PrivateRouteAdmin: React.FC<PrivateRouteAdminProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default PrivateRouteAdmin;
