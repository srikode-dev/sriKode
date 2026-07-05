import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useVideoStore = create((set) => ({
  videos: [],
  loading: false,
  error: null,

  fetchVideos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/videos/admin/all");
      set({
        videos: response.data.videos,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load cached videos."
      });
    }
  },

  syncYouTube: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/videos/admin/sync");
      // Re-fetch updated list after sync
      const response = await axiosInstance.get("/videos/admin/all");
      set({
        videos: response.data.videos,
        loading: false,
        error: null
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "YouTube API Sync failed.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  toggleVisibility: async (id, isHidden) => {
    try {
      const response = await axiosInstance.put(`/videos/admin/hide/${id}`, { isHidden });
      
      set((state) => ({
        videos: state.videos.map((vid) =>
          vid._id === id ? { ...vid, isHidden: response.data.video.isHidden } : vid
        )
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update visibility toggle."
      };
    }
  }
}));

export default useVideoStore;
