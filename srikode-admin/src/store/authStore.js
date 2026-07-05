import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("srikode_user")) || null,
  token: localStorage.getItem("srikode_token") || null,
  isAuthenticated: !!localStorage.getItem("srikode_token"),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      
      const { token, user } = response.data;
      
      localStorage.setItem("srikode_token", token);
      localStorage.setItem("srikode_user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem("srikode_token");
    localStorage.removeItem("srikode_user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  checkAuth: () => {
    const token = localStorage.getItem("srikode_token");
    const user = JSON.parse(localStorage.getItem("srikode_user"));
    
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    } else {
      set({ token: null, user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
