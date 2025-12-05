import axios from "axios";

// 🔹 Base URL for Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
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
    const token = localStorage.getItem("authToken"); // OR correct key

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No auth token found. Sending request without Authorization.");
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
    console.error("PATCH Error:", err.message);
    throw err;
  }
};

export default api;
