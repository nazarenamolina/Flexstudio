import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ isAllowed, redirectTo = '/login', children }: ProtectedRouteProps) => {
  const location = useLocation();
  if (!isAllowed) {
    // Al mandar al login se recuerda a dónde quería ir el usuario, para volver ahí después.
    const state = redirectTo === '/login' ? { desde: location.pathname + location.search } : undefined;
    return <Navigate to={redirectTo} replace state={state} />;
  }
  return children ? <>{children}</> : <Outlet />;
};
