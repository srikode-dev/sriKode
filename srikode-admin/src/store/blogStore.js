import { create } from "zustand";
import axiosInstance from "../api/axiosInstance.js";

const useBlogStore = create((set) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/blogs/admin/all");
      set({
        blogs: response.data.blogs,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load blogs."
      });
    }
  },

  fetchBlogById: async (id) => {
    set({ loading: true, error: null, currentBlog: null });
    try {
      const response = await axiosInstance.get(`/blogs/admin/post/${id}`);
      set({
        currentBlog: response.data.blog,
        loading: false,
        error: null
      });
      return { success: true, blog: response.data.blog };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load blog post details.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  createBlog: async (blogData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/blogs/admin/post", blogData);
      set((state) => ({
        blogs: [response.data.blog, ...state.blogs],
        loading: false,
        error: null
      }));
      return { success: true, blog: response.data.blog };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create blog post.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  updateBlog: async (id, blogData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/blogs/admin/post/${id}`, blogData);
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? response.data.blog : b)),
        currentBlog: response.data.blog,
        loading: false,
        error: null
      }));
      return { success: true, blog: response.data.blog };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update blog post.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/blogs/admin/post/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((b) => b._id !== id),
        loading: false,
        error: null
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete blog post.";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  /**
   * Sends the cropped image to the backend, which converts it to optimized WebP (sharp)
   * and stores it in ImageKit under '/srikode'.
   * onProgress({ stage, percent }) reports "uploading" (with %) then "converting" (server side).
   */
  uploadImage: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append("image", file, file.name);

      const response = await axiosInstance.post("/blogs/admin/upload-image", formData, {
        // Let the browser set the multipart boundary (instance default is JSON)
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!onProgress) return;
          const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
          onProgress(percent >= 100
            ? { stage: "converting", percent: 100 }
            : { stage: "uploading", percent });
        }
      });

      const { url, width, height, originalSize, size } = response.data;
      return { success: true, url, width, height, originalSize, size };
    } catch (error) {
      console.error("Image Convert/Upload Error: ", error);
      const message = error.response?.data?.message || error.message || "Image upload failed.";
      return { success: false, message };
    }
  }
}));

export default useBlogStore;
