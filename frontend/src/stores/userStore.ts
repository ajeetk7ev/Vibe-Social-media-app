import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { type User } from "@/types";
import { getFromLocalStorage } from "@/utils/localstorage";

interface UserState {
    targetUser: User | null;
    isFollowing: boolean;
    loading: boolean;
    error: string | null;

    fetchProfileByUsername: (username: string) => Promise<void>;
    updateProfile: (data: { name?: string; bio?: string; avatar?: File; password?: string }) => Promise<boolean>;
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    resetTargetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    targetUser: null,
    isFollowing: false,
    loading: false,
    error: null,

    fetchProfileByUsername: async (username: string) => {
        set({ loading: true, error: null });
        try {
            const token = getFromLocalStorage("token");
            const res = await axios.get(`${API_URL}/user/username/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                targetUser: res.data.user,
                isFollowing: res.data.isFollowing,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to fetch profile",
                loading: false
            });
        }
    },

    updateProfile: async (data: any) => {
        set({ loading: true, error: null });
        try {
            const token = getFromLocalStorage("token");
            const formData = new FormData();
            if (data.name) formData.append("name", data.name);
            if (data.bio) formData.append("bio", data.bio);
            if (data.avatar) formData.append("avatar", data.avatar);
            if (data.password) formData.append("password", data.password);

            const res = await axios.put(`${API_URL}/user/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                // Update targetUser and authUser (via localstorage manipulation or state update)
                const updatedUser = res.data.user;
                set({ targetUser: updatedUser, loading: false });
                localStorage.setItem("user", JSON.stringify(updatedUser));
                return true;
            }
            return false;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to update profile",
                loading: false
            });
            return false;
        }
    },

    followUser: async (userId: string) => {
        try {
            const token = getFromLocalStorage("token");
            await axios.post(`${API_URL}/user/follow/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                isFollowing: true,
                targetUser: state.targetUser ? {
                    ...state.targetUser,
                    followers: [...(state.targetUser.followers || []), "me"] // Shallow update for UI
                } : null
            }));
        } catch (error: any) {
            console.error("Follow error:", error);
        }
    },

    unfollowUser: async (userId: string) => {
        try {
            const token = getFromLocalStorage("token");
            await axios.post(`${API_URL}/user/unfollow/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                isFollowing: false,
                targetUser: state.targetUser ? {
                    ...state.targetUser,
                    followers: (state.targetUser.followers || []).filter(id => id !== "me")
                } : null
            }));
        } catch (error: any) {
            console.error("Unfollow error:", error);
        }
    },

    resetTargetUser: () => set({ targetUser: null, isFollowing: false, error: null }),
}));
