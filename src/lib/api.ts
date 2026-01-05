// API Configuration and Base Client
// Use environment variable for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "https://m1qgkrd1-4043.inc1.devtunnels.ms/api";

// Debug: Log the actual URL being used
console.log("🔗 API_BASE_URL:", API_BASE_URL);
console.log("🔗 VITE_API_BASE_URL env:", import.meta.env.VITE_API_BASE_URL);
console.log("🔗 Environment mode:", import.meta.env.MODE);

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
      value: any;
    }>;
  };
  timestamp: string;
  requestId?: string;
  path?: string;
}

// Token management
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";
  private static readonly TOKEN_EXPIRY_KEY = "token_expiry";
  private static readonly REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry
  private static refreshTimer: NodeJS.Timeout | null = null;
  private static refreshPromise: Promise<boolean> | null = null;
  private static expiryCallbacks: Array<(timeUntilExpiry: number) => void> = [];
  private static expiryCheckInterval: NodeJS.Timeout | null = null;

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  static setTokenExpiry(expiresIn: number): void {
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.clearRefreshTimer();
    this.clearExpiryCheckInterval();
  }

  static setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn?: number
  ): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);

    if (expiresIn) {
      this.setTokenExpiry(expiresIn);
      this.scheduleTokenRefresh(expiresIn);
      this.startExpiryMonitoring();
    }
  }

  static isTokenValid(): boolean {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiry();
    // If no token, definitely not valid
    if (!token) return false;
    // Some backends may not send an explicit expiresIn; if we don't have an expiry stored,
    // treat the token as potentially valid and let the server decide during /auth/me.
    if (!expiry) return true;
    return Date.now() < expiry;
  }

  static isTokenExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry();

    if (!expiry) {
      // If we don't have expiry information, don't proactively refresh.
      return false;
    }

    return Date.now() >= expiry - this.REFRESH_BUFFER_MS;
  }

  static scheduleTokenRefresh(expiresIn: number): void {
    this.clearRefreshTimer();

    const refreshTime = expiresIn * 1000 - this.REFRESH_BUFFER_MS;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.performTokenRefresh();
        } catch (error) {
          console.error("Scheduled token refresh failed:", error);
          // Clear tokens and redirect to login on refresh failure
          this.clearTokens();
          window.location.href = "/login";
        }
      }, refreshTime);
    }
  }

  static clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  static clearExpiryCheckInterval(): void {
    if (this.expiryCheckInterval) {
      clearInterval(this.expiryCheckInterval);
      this.expiryCheckInterval = null;
    }
  }

  static addExpiryCallback(callback: (timeUntilExpiry: number) => void): void {
    this.expiryCallbacks.push(callback);
  }

  static removeExpiryCallback(
    callback: (timeUntilExpiry: number) => void
  ): void {
    const index = this.expiryCallbacks.indexOf(callback);
    if (index > -1) {
      this.expiryCallbacks.splice(index, 1);
    }
  }

  static getTimeUntilExpiry(): number | null {
    const expiry = this.getTokenExpiry();
    if (!expiry) {
      return null;
    }

    const timeLeft = expiry - Date.now();
    return timeLeft > 0 ? timeLeft : 0;
  }

  static startExpiryMonitoring(): void {
    this.clearExpiryCheckInterval();

    // Check every 30 seconds
    this.expiryCheckInterval = setInterval(() => {
      const timeUntilExpiry = this.getTimeUntilExpiry();

      if (timeUntilExpiry !== null) {
        // Notify all callbacks about the time until expiry
        this.expiryCallbacks.forEach((callback) => {
          try {
            callback(timeUntilExpiry);
          } catch (error) {
            console.error("Error in expiry callback:", error);
          }
        });
      }
    }, 30000);
  }

  static async performTokenRefresh(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    this.refreshPromise = this.executeTokenRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private static async executeTokenRefresh(
    refreshToken: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          this.setAccessToken(data.data.token);

          if (data.data.expiresIn) {
            this.setTokenExpiry(data.data.expiresIn);
            this.scheduleTokenRefresh(data.data.expiresIn);
          }

          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh request failed:", error);
    }

    return false;
  }

  static async ensureValidToken(): Promise<boolean> {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    if (this.isTokenValid() && !this.isTokenExpiringSoon()) {
      return true;
    }

    // Token is expired or expiring soon, try to refresh
    return await this.performTokenRefresh();
  }

  static initializeTokenManagement(): void {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiry();

    if (token && expiry) {
      const timeUntilExpiry = expiry - Date.now();

      if (timeUntilExpiry > 0) {
        // Schedule refresh for existing token
        this.scheduleTokenRefresh(timeUntilExpiry / 1000);
        // Start monitoring for expiry notifications
        this.startExpiryMonitoring();
      } else {
        // Token is already expired, try to refresh immediately
        this.performTokenRefresh().catch(() => {
          this.clearTokens();
        });
      }
    }
  }
}

// API Client class
class ApiClient {
  private baseURL: string;
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 1000;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Debug: Log the actual request URL
    console.log("🚀 Request URL:", url);
    console.log("🚀 Base URL:", this.baseURL);
    console.log("🚀 Endpoint:", endpoint);

    const accessToken = TokenManager.getAccessToken();
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 responses with retry logic
      if (
        response.status === 401 &&
        accessToken &&
        retryCount < this.MAX_RETRY_ATTEMPTS
      ) {
        const refreshed = await TokenManager.performTokenRefresh();
        if (refreshed) {
          // Retry the original request with new token
          return this.request<T>(endpoint, options, retryCount + 1);
        } else {
          // Refresh failed, clear tokens but don't redirect
          TokenManager.clearTokens();
          throw new Error("Authentication failed - unable to refresh token");
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      // Handle network errors with retry for non-auth endpoints
      if (
        this.isNetworkError(error) &&
        retryCount < this.MAX_RETRY_ATTEMPTS &&
        !this.requiresAuth(endpoint)
      ) {
        await this.delay(this.RETRY_DELAY_MS * Math.pow(2, retryCount)); // Exponential backoff
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        // Create an error that preserves the full response structure
        const error = new Error(
          data.error?.message || data.message || "API request failed"
        );
        (error as any).response = { data };
        throw error;
      }

      return data;
    } else {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response as unknown as T;
    }
  }

  private requiresAuth(endpoint: string): boolean {
    // Endpoints that don't require authentication
    const publicEndpoints = ["/auth/login", "/auth/refresh"];
    return !publicEndpoints.some((publicEndpoint) =>
      endpoint.startsWith(publicEndpoint)
    );
  }

  private isNetworkError(error: any): boolean {
    return error instanceof TypeError && error.message.includes("fetch");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    // For uploads, we need to handle headers differently to avoid setting Content-Type
    const url = `${this.baseURL}${endpoint}`;

    const accessToken = TokenManager.getAccessToken();
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }
}

// Export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
export { TokenManager };
