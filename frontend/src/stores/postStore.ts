import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/utils/api";
import type { Post, Comment } from "@/types";
import { getFromLocalStorage } from "@/utils/localstorage";

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;

  // Pagination
  page: number;
  hasMore: boolean;
  isFetchingMore: boolean;

  // Actions
  fetchFeed: (page?: number) => Promise<void>;
  createPost: (caption: string, media: File[]) => Promise<boolean>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  getComments: (postId: string) => Promise<Comment[]>;
  deletePost: (postId: string) => Promise<boolean>;
  fetchUserPosts: (userId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  isFetchingMore: false,

  fetchFeed: async (page = 1) => {
    // If it's page 1, set main loading. If > 1, set isFetchingMore
    if (page === 1) {
      set({ loading: true, error: null, posts: [], page: 1, hasMore: true });
    } else {
      set({ isFetchingMore: true, error: null });
    }

    try {
      const token = getFromLocalStorage("token");
      const res = await axios.get(`${API_URL}/post?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newPosts = res.data.posts;
      const { hasMore } = res.data.pagination;

      set((state) => ({
        posts: page === 1 ? newPosts : [...state.posts, ...newPosts],
        loading: false,
        isFetchingMore: false,
        page: page,
        hasMore: hasMore,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch feed",
        loading: false,
        isFetchingMore: false,
      });
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
      const user = getFromLocalStorage("user");
      const userId = user?._id || user?.id;
      if (!userId) return;

      await axios.post(`${API_URL}/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        posts: state.posts.map((post) => {
          if (post._id !== postId) return post;
          const currentLikes = post.likes || [];
          // Prevent duplicate likes in local state
          const alreadyLiked = currentLikes.some(id => String(id) === String(userId));
          if (alreadyLiked) return post;
          return { ...post, likes: [...currentLikes, userId] };
        }),
      }));
    } catch (error: any) {
      console.error("Like error:", error);
    }
  },

  unlikePost: async (postId) => {
    try {
      const token = getFromLocalStorage("token");
      const user = getFromLocalStorage("user");
      const userId = user?._id || user?.id;
      if (!userId) return;

      await axios.post(`${API_URL}/post/${postId}/unlike`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        posts: state.posts.map((post) => {
          if (post._id !== postId) return post;
          const currentLikes = post.likes || [];
          return {
            ...post,
            likes: currentLikes.filter(id => String(id) !== String(userId))
          };
        }),
      }));
    } catch (error: any) {
      console.error("Unlike error:", error);
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

  fetchUserPosts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = getFromLocalStorage("token");
      const res = await axios.get(`${API_URL}/post/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ posts: res.data.posts, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch user posts", loading: false });
    }
  },
}));