import { create } from "zustand";
import axios from "axios";
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
   * Uploads an image directly to ImageKit root folder '/srikode'.
   * 1. Fetches authentication parameters from the backend.
   * 2. Formulates a direct client-side upload payload to ImageKit CDN API.
   */
  uploadImage: async (file) => {
    try {
      const authRes = await axiosInstance.get("/blogs/admin/imagekit/auth");
      const { signature, expire, token } = authRes.data;

      const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("VITE_IMAGEKIT_PUBLIC_KEY is not defined in the frontend environment.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire);
      formData.append("token", token);
      formData.append("folder", "/srikode"); // Upload directly inside the /srikode folder!

      // Using raw axios instance to prevent routing interceptor header mutations
      const response = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return { success: true, url: response.data.url };
    } catch (error) {
      console.error("Direct ImageKit Upload Error: ", error);
      const message = error.response?.data?.message || error.message || "Image upload failed.";
      return { success: false, message };
    }
  }
}));

export default useBlogStore;
