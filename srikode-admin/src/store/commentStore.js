import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useCommentStore = create((set) => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async (approvedFilter) => {
    set({ loading: true, error: null });
    try {
      const url = approvedFilter !== undefined 
        ? `/comments/admin/all?approved=${approvedFilter}`
        : "/comments/admin/all";
      const response = await axiosInstance.get(url);
      
      set({
        comments: response.data.comments,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load guest comments."
      });
    }
  },

  toggleApproval: async (id, isApproved) => {
    try {
      const response = await axiosInstance.put(`/comments/admin/approve/${id}`, { isApproved });
      
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === id ? { ...comment, isApproved: response.data.comment.isApproved } : comment
        )
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update comment approval state."
      };
    }
  },

  deleteComment: async (id) => {
    try {
      await axiosInstance.delete(`/comments/admin/delete/${id}`);
      
      set((state) => ({
        comments: state.comments.filter((comment) => comment._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete comment."
      };
    }
  }
}));

export default useCommentStore;
