import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./customComponent/ui/sonner.tsx";
import { AuthProvider } from "./pages/AuthPages/AuthProvider.tsx";
import { ErrorProvider } from "./context/ErrorContext.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ErrorProvider> 
      <AuthProvider>
      <AppWrapper>
        <App />
        <Toaster position="bottom-right" richColors closeButton />
      </AppWrapper>
</AuthProvider>
 </ErrorProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
