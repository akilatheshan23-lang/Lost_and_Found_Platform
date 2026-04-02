import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiMe } from "../api/auth.api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  async function refresh() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    try {
      const me = await apiMe();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => { refresh(); }, []);

  function setSession(token, userObj) {
    localStorage.setItem("token", token);
    setUser(userObj);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, ready, setSession, logout, refresh }), [user, ready]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
