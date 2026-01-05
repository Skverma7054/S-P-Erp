import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface ErrorContextType {
  showError: (error: any, context?: string) => void;
  showAuthError: (message?: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/* -------------------- PROVIDER -------------------- */
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Generic API / UI error
   */
  const showError = useCallback((error: any, context?: string) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    toast.error(context ? `${context}: ${message}` : message);
  }, []);

  /**
   * Authentication related error
   * (401 / 403 / session expired)
   */
  const showAuthError = useCallback((message?: string) => {
    toast.error(message || "Session expired. Please login again.");

    setTimeout(() => {
      window.location.href = "/signin";
    }, 1500);
  }, []);

  /**
   * Clear all toasts
   */
  const clearAllErrors = useCallback(() => {
    toast.dismiss();
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        showError,
        showAuthError,
        clearAllErrors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

/* -------------------- HOOK -------------------- */
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
};
