import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";
import { toast } from "sonner";

const useCmsStore = create((set, get) => ({
  config: null,
  loading: false,
  saving: false,
  error: null,

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/cms");
      set({ config: response.data.config, loading: false });
      return { success: true, config: response.data.config };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load CMS configuration.";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateConfig: async (updatedPayload) => {
    set({ saving: true });
    try {
      const response = await axiosInstance.put("/cms", updatedPayload);
      set({ config: response.data.config, saving: false });
      toast.success("CMS sections updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save CMS configuration.";
      set({ saving: false });
      toast.error(message);
      return { success: false, message };
    }
  },
}));

export default useCmsStore;
