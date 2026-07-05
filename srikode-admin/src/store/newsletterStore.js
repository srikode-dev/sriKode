import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useNewsletterStore = create((set) => ({
  subscribers: [],
  loading: false,
  error: null,

  fetchSubscribers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/newsletter/admin/all");
      set({
        subscribers: response.data.subscribers,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load newsletter subscribers."
      });
    }
  },

  deleteSubscriber: async (id) => {
    try {
      await axiosInstance.delete(`/newsletter/admin/delete/${id}`);
      set((state) => ({
        subscribers: state.subscribers.filter((s) => s._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete subscriber."
      };
    }
  }
}));

export default useNewsletterStore;
