// Proxy to central unified AuthContext
import { useAuth as useCentralAuth } from "../../../state/AuthContext";

export function AuthProvider({ children }) {
  return <>{children}</>;
}

export function useAuth() {
  const central = useCentralAuth();
  
  return {
    user: central.user,
    ready: !central.loading,
    setSession: central.login,
    logout: central.logout,
    refresh: () => {}
  };
}
