import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

const withAuth = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  requiredRole?: 'seeker' | 'employer'
) => {
  const AuthenticatedComponent = (props: P) => {
    const { user, token } = useSelector((state: RootState) => state.auth);

    if (!token || !user) {
      return <Redirect to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <Redirect to="/vacancies" />;
    }

    return <Component {...props} />;
  };

  // Добавляем displayName для удобства отладки в React DevTools
  const componentName = Component.displayName || Component.name || 'Component';
  AuthenticatedComponent.displayName = `withAuth(${componentName})`;

  return AuthenticatedComponent;
};

export default withAuth;