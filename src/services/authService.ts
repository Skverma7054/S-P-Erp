import { apiClient } from "../api/apiServices"; // your axios instance
import {
  LoginRequest,
  LoginResponse,
  User,
} from "@/types/api";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  email?: string;
}

export class AuthService {
  // -----------------------------
  // LOGIN
  // -----------------------------
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", credentials);

    const data = response.data;

    // ✅ Store ONLY what is needed
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  // -----------------------------
  // CURRENT USER
  // -----------------------------
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      // ✅ Always clear
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  }

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  }

  // -----------------------------
  // UPDATE PROFILE
  // -----------------------------
  static async updateProfile(
    data: UpdateProfileRequest
  ): Promise<User> {
    const response = await apiClient.put("/auth/profile", data);
    return response.data;
  }

  // -----------------------------
  // FORCE CLEAR (SESSION EXPIRED)
  // -----------------------------
  static clearAuth(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}
