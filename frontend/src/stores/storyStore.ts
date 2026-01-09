import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/utils/api";
import type { Story } from "@/types";
import { getFromLocalStorage } from "@/utils/localstorage";

interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchStories: () => Promise<void>;
  createStory: (media: File) => Promise<boolean>;
  viewStory: (storyId: string) => Promise<void>;
  deleteStory: (storyId: string) => Promise<boolean>;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true, error: null });
    try {
      const token = getFromLocalStorage("token");
      const res = await axios.get(`${API_URL}/story`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ stories: res.data.stories, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch stories", loading: false });
    }
  },

  createStory: async (media) => {
    set({ loading: true, error: null });
    try {
      const token = getFromLocalStorage("token");
      const formData = new FormData();
      formData.append("media", media);

      const res = await axios.post(`${API_URL}/story`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newStory = res.data.story;
      set((state) => ({ stories: [newStory, ...state.stories], loading: false }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create story", loading: false });
      return false;
    }
  },

  viewStory: async (storyId) => {
    try {
      const token = getFromLocalStorage("token");
      await axios.post(`${API_URL}/story/${storyId}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optionally update viewers count locally
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to view story" });
    }
  },

  deleteStory: async (storyId) => {
    try {
      const token = getFromLocalStorage("token");
      await axios.delete(`${API_URL}/story/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        stories: state.stories.filter((story) => story._id !== storyId),
      }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete story" });
      return false;
    }
  },
}));