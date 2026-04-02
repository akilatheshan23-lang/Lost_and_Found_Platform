// Proxy to central unified AuthContext
import { useAuth as useCentralAuth } from "../../../state/AuthContext";

export function AuthProvider({ children }) {
  // We no longer need this provider since the central one wraps the whole app
  return <>{children}</>;
}

export function useAuth() {
  const central = useCentralAuth();
  
  return {
    user: central.user,
    ready: !central.loading,
    setSession: central.login,
    logout: central.logout,
    refresh: () => {} // Refresh is handled centrally via useEffect
  };
}
