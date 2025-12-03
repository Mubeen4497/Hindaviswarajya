import { ReactNode } from "react";
import { useApp } from "./AppContext";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard Component
 * 
 * Protects routes/components that require authentication.
 * Only renders children if user is authenticated.
 */
export default function AuthGuard({ children, fallback = null }: AuthGuardProps) {
  const { state } = useApp();

  if (!state.isAuthenticated || !state.currentUser) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
