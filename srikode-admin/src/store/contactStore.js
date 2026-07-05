import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useContactStore = create((set) => ({
  contacts: [],
  loading: false,
  error: null,

  fetchContacts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/contact/admin/all");
      
      set({
        contacts: response.data.contacts,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load contact inquiries."
      });
    }
  },

  toggleRead: async (id, isRead) => {
    try {
      await axiosInstance.put(`/contact/admin/read/${id}`, { isRead });
      
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact._id === id ? { ...contact, isRead } : contact
        )
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update read state."
      };
    }
  },

  deleteContact: async (id) => {
    try {
      await axiosInstance.delete(`/contact/admin/delete/${id}`);
      
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete message."
      };
    }
  }
}));

export default useContactStore;
