import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

const SOCKET_URL = "http://localhost:5000"; // Adjust based on your API_URL

interface SocketStore {
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        // Disconnect existing socket if any
        if (get().socket?.connected) return;

        const socket = io(SOCKET_URL, {
            query: {
                userId: user._id || user.id,
            },
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            set({ socket });
        });

        socket.on("getOnlineUsers", (users: string[]) => {
            set({ onlineUsers: users });
        });

        socket.on("newNotification", (notification: any) => {
            const message =
                notification.type === "like" ? "liked your post" :
                    notification.type === "comment" ? "commented on your post" :
                        "started following you";
            toast.success(`Someone ${message}`, { duration: 4000 });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            set({ socket: null });
        });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
