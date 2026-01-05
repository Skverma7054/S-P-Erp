import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useError } from "../../context/ErrorContext";


export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roleId?: number;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  loginSuccess: (data: {
    token: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------- HOOK -------------------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

/* -------------------- PROVIDER -------------------- */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearAllErrors } = useError();
const permissions = user?.role?.permissions || [];
console.log(permissions);
const isTokenValid = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  return !!token && !!user;
};

  /* -------------------- RESTORE SESSION -------------------- */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);
useEffect(() => {
  const handleStorageChange = () => {
    if (!isTokenValid()) {
      logout();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  /* -------------------- LOGIN SUCCESS HANDLER -------------------- */
  const loginSuccess = (data: {
    token: string;
    refreshToken: string;
    user: AuthUser;
  }) => {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    clearAllErrors();
    setUser(data.user);
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    window.location.href = "/signin";
  };
const hasModuleAccess = (moduleName: string) =>
  permissions.some((p) => p.module === moduleName);

const hasActionAccess = (moduleName: string, action: string) =>
  permissions.some(
    (p) => p.module === moduleName && p.action.includes(action)
  );

  return (
    <AuthContext.Provider
      value={{
isAuthenticated: !!user && !!localStorage.getItem("authToken"),
       user,
    loading,
    permissions,
    hasModuleAccess,
    hasActionAccess,
    loginSuccess,
    logout,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
