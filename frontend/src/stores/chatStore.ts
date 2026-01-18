import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getFromLocalStorage } from "@/utils/localstorage";
import { useSocketStore } from "./socketStore";

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatUser {
    _id: string;
    username: string;
    avatar?: string;
    name?: string;
}

interface ChatState {
    users: ChatUser[];
    messages: Message[];
    selectedUser: ChatUser | null;
    loading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    fetchMessages: (userId: string) => Promise<void>;
    sendMessage: (receiverId: string, message: string) => Promise<void>;
    setSelectedUser: (user: ChatUser | null) => void;
    addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const token = getFromLocalStorage("token");
            const res = await axios.get(`${API_URL}/chat/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ users: res.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to fetch users",
                loading: false,
            });
        }
    },

    fetchMessages: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const token = getFromLocalStorage("token");
            const res = await axios.get(`${API_URL}/chat/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ messages: res.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to fetch messages",
                loading: false,
            });
        }
    },

    sendMessage: async (receiverId: string, message: string) => {
        try {
            const token = getFromLocalStorage("token");
            const res = await axios.post(
                `${API_URL}/chat/send/${receiverId}`,
                { message },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            set((state) => ({
                messages: [...state.messages, res.data],
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to send message",
            });
        }
    },

    setSelectedUser: (user: ChatUser | null) => {
        set({ selectedUser: user, messages: [] });
        if (user) {
            get().fetchMessages(user._id);
        }
    },

    addMessage: (message: Message) => {
        const { selectedUser, messages } = get();
        // Only add if it's for the current conversation
        if (
            selectedUser &&
            (message.senderId === selectedUser._id ||
                message.receiverId === selectedUser._id)
        ) {
            set({ messages: [...messages, message] });
        }
    },
}));

// Listen for incoming messages via socket
const { socket } = useSocketStore.getState();
if (socket) {
    socket.on("newMessage", (message: Message) => {
        useChatStore.getState().addMessage(message);
    });
}
