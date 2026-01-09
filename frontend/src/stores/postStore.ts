import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/utils/api";
import type { Post, Comment } from "@/types";
import { getFromLocalStorage } from "@/utils/localstorage";

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchFeed: () => Promise<void>;
  createPost: (caption: string, media: File[]) => Promise<boolean>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  getComments: (postId: string) => Promise<Comment[]>;
  deletePost: (postId: string) => Promise<boolean>;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchFeed: async () => {
    set({ loading: true, error: null });
    try {
      const token = getFromLocalStorage("token");
      const res = await axios.get(`${API_URL}/post`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ posts: res.data.posts, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch feed", loading: false });
    }
  },

  createPost: async (caption, media) => {
    set({ loading: true, error: null });
    try {
      const token = getFromLocalStorage("token");
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      media.forEach((file) => formData.append("media", file));

      const res = await axios.post(`${API_URL}/post`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newPost = res.data.post;
      set((state) => ({ posts: [newPost, ...state.posts], loading: false }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create post", loading: false });
      return false;
    }
  },

  likePost: async (postId) => {
    try {
      const token = getFromLocalStorage("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${API_URL}/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, likes: [...post.likes, user._id] }
            : post
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to like post" });
    }
  },

  unlikePost: async (postId) => {
    try {
      const token = getFromLocalStorage("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${API_URL}/post/${postId}/unlike`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.filter(id => id !== user._id) }
            : post
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to unlike post" });
    }
  },

  addComment: async (postId, text) => {
    try {
      const token = getFromLocalStorage("token");
      await axios.post(`${API_URL}/post/${postId}/comments`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optionally fetch comments again or update locally
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to add comment" });
    }
  },

  getComments: async (postId) => {
    try {
      const token = getFromLocalStorage("token");
      const res = await axios.get(`${API_URL}/post/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.comments;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch comments" });
      return [];
    }
  },

  deletePost: async (postId) => {
    try {
      const token = getFromLocalStorage("token");
      await axios.delete(`${API_URL}/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete post" });
      return false;
    }
  },
}));