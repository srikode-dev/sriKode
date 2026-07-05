import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useAnalyticsStore = create((set) => ({
  summary: {
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalComments: 0,
    pendingComments: 0,
    unreadContacts: 0
  },
  popularPosts: [],
  categories: [],
  recentActivity: {
    comments: [],
    contacts: []
  },
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/analytics");
      const { summary, popularPosts, categories, recentActivity } = response.data.analytics;
      
      set({
        summary,
        popularPosts,
        categories,
        recentActivity,
        loading: false,
        error: null
      });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch analytics data.";
      set({ loading: false, error: message });
    }
  }
}));

export default useAnalyticsStore;
