import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

// Map user IDs to socket IDs
const userSocketMap: Record<string, string> = {};

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust this in production
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId as string;

        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
            console.log(`User connected: ${userId} with socket ID ${socket.id}`);
        }

        // Emit online users count or list if needed
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
            if (userId) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return io;
};

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
};

export { io };
