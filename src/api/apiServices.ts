import axios from "axios";
import { resolveModule } from "./resolveModule";
import { resolveAction } from "./actionResolver";
import { isAuthApi } from "./apiRouter";
import { toast } from "sonner";

// 🔹 Base URL for Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CORE_API = import.meta.env.VITE_API_BASE_URL;
const AUTH_API = import.meta.env.VITE_API_BASE_URL2;
// Create Axios instance
const api = axios.create({
  // baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔹 Logout Handler
const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");

  if (window.location.pathname !== "/auth/login") {
    window.location.href = "/auth/login";
  }
};

// 🔹 Request Interceptor – attach access token
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const method = config.method?.toLowerCase() || "";

    // 🔀 Decide backend
    const isAuth = isAuthApi(url);
    config.baseURL = isAuth ? AUTH_API : CORE_API;

    const isWriteMethod = ["post", "put", "patch", "delete"].includes(method);

    // 🔐 ONLY for CORE + WRITE APIs
   if (!isAuth) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    handleLogout();
    return Promise.reject("No auth token");
  }

  // ✅ Send token for ALL core APIs (GET + WRITE)
  config.headers.Authorization = `Bearer ${token}`;

  // ✅ RBAC headers only for WRITE APIs
  if (["post", "put", "patch", "delete"].includes(method)) {
    config.headers["x-module"] = resolveModule();
    config.headers["action-perform"] = resolveAction(method);
  }
}
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor – refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};

    // If 401 or 403 → Try refreshing token
    if ((status === 401 || status === 403) && !error.config._retry) {
      error.config._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        if (res.data?.accessToken) {
          // Save new access token
          localStorage.setItem("authToken", res.data.accessToken);

          // Retry original request with new access token
          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(error.config);
        }
      } catch (refreshError) {
        console.error("Refresh token failed ❌");
        handleLogout();
      }
    }

    return Promise.reject({
      status,
      message: data.message || "An error occurred",
      originalError: error,
    });
  }
);

//
// 🔹 Generic API Methods
//

export const postFetch = async (endpoint, body = {}, config = {}) => {
  try {
    const response = await api.post(endpoint, body, config);
    console.log(response)
    return response;
  } catch (err) {
    console.error("POST Error:", err.message);
    throw err;
  }
};

export const axiosGet = async (endpoint, config = {}) => {
  try {
    const response = await api.get(endpoint, config);
    return response.data;
  } catch (err) {
    console.error("GET Error:", err.message);
    throw err;
  }
};

export const AxiosGetWithParams = async (endpoint, params = {}, config = {}) => {
  try {
    const response = await api.get(endpoint, { ...config, params });
    return response.data;
  } catch (err) {
    console.error("GET Params Error:", err.message);
    throw err;
  }
};

export const AxiosPostWithParams = async (
  endpoint,
  params = {},
  body = {},
  config = {}
) => {
  try {
    const response = await api.post(endpoint, body, { ...config, params });
    return response.data;
  } catch (err) {
    console.error("POST Params Error:", err.message);
    throw err;
  }
};

export const axiosDelete = async (endpoint, config = {}) => {
  try {
    const response = await api.delete(endpoint, config);
    console.log(response,"axiosDelete")
    return response.data;
  } catch (err) {
    console.error("DELETE Error:", err.message);
    throw err;
  }
};
export const axiosPatch = async (endpoint, body = {}, config = {}) => {
  try {
    const response = await api.patch(endpoint, body, config);
    return response.data;
  } catch (err) {
    toast.error(err.message)
    console.error("PATCH Error:", err.message);
    throw err;
  }
};

export default api;
