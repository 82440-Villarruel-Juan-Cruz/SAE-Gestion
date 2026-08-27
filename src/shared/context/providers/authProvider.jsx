import { useState, useEffect, useCallback } from "react";
import { appConfig } from "../../../config/appConfig";
import ObtenerTokenJWT from "../../../api/AuthService";
import { SESSION_EXPIRED_EVENT } from "../../../api/apiClient";
import { AuthContext } from "../sharedContext";

const SESSION_EXPIRATION_WARNING_MS = 300_000;//Cuando ANTES queremos mostrar el warning

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("session");

    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.token || Date.now() > parsed.expiration) {
        localStorage.removeItem("session");
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem("session");
      return null;
    }
  });

  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("session");
  }, []);

  const isSessionValid = useCallback(() => {
    const stored = localStorage.getItem("session");
    if (!stored) return false;

    try {
      const parsed = JSON.parse(stored);
      return Boolean(parsed.token) && Date.now() <= parsed.expiration;
    } catch {
      return false;
    }
  }, []);

  const expireSession = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const handleExpiredSession = () => clearSession();
    const handleStorageChange = (event) => {
      if (event.key === "session" && !event.newValue) clearSession();
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [clearSession]);

  useEffect(() => {
  if (!user?.expiration) return undefined;

  const remainingTime = user.expiration - Date.now();

  if (remainingTime <= 0) {
    const deferTimeout = window.setTimeout(() => {
      clearSession();
    }, 0);
    return () => window.clearTimeout(deferTimeout);
  }

  const warningTime = Math.min(
    SESSION_EXPIRATION_WARNING_MS,
    Math.max(Number(appConfig.sessionTimeout) / 2, 10_000),
  );

  // En producción: 1.800.000 - 300.000 = 1.500.000 ms (Espera 25 minutos antes de mostrarse)
  const timeUntilWarning = Math.max(remainingTime - warningTime, 0);

  const warningTimeout = window.setTimeout(() => {
    setSessionExpired(true);
  }, timeUntilWarning);

  const expirationTimeout = window.setTimeout(() => {
    clearSession();
  }, remainingTime);

  return () => {
    window.clearTimeout(warningTimeout);
    window.clearTimeout(expirationTimeout);
  };
}, [user?.expiration, clearSession]);

  const login = async (legajo, dominio, password) => {
    const result = await ObtenerTokenJWT(legajo, dominio, password);
    if (result.success && result.data) {
      const session = {
        token: result.data.token ?? "",
        id: result.data.id ?? 0,
        legajo: result.data.legajo_armado ?? "",
        email: result.data.legajo_armado ?? "",
        nombre: result.data.nombre_usuario ?? "",
        id_perfil: result.data.id_perfil ?? 0,
        expiration: Date.now() + appConfig.sessionTimeout,
      };

      localStorage.setItem("session", JSON.stringify(session));
      setUser(session);
      setSessionExpired(false);
      return session;
    }
    return null;
  };

  const extendSession = useCallback(() => {
  const stored = localStorage.getItem("session");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    
    // Validar que no estemos intentando extender una sesión ya muerta en localStorage
    if (Date.now() > parsed.expiration) {
      clearSession();
      return;
    }

    const extended = {
      ...parsed,
      expiration: Date.now() + appConfig.sessionTimeout,
    };

    localStorage.setItem("session", JSON.stringify(extended));
    setSessionExpired(false); 
    setUser(extended); 
  } catch {
    clearSession();
  }
}, [clearSession]);

  const updateUser = (updates) => {
    const stored = localStorage.getItem("session");
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = { ...parsed, ...updates };
      localStorage.setItem("session", JSON.stringify(updated));
      setUser(updated);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        extendSession,
        updateUser,
        sessionExpired,
        isSessionValid,
        expireSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
