import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import Avatar from "@/components/common/Avatar";
import { Send, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Messages: React.FC = () => {
    const { users, messages, selectedUser, loading, fetchUsers, sendMessage, setSelectedUser, addMessage } = useChatStore();
    const { user: currentUser } = useAuthStore();
    const { socket } = useSocketStore();
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        // Listen for new messages
        if (socket) {
            const handleNewMessage = (message: any) => {
                addMessage(message);
            };
            socket.on("newMessage", handleNewMessage);
            return () => {
                socket.off("newMessage", handleNewMessage);
            };
        }
    }, [socket, addMessage]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        await sendMessage(selectedUser._id, messageText);
        setMessageText("");
    };

    return (
        <MainLayout>
            <div className="h-[calc(100vh-120px)] flex bg-slate-950 rounded-2xl overflow-hidden border border-slate-900">
                {/* Sidebar - User List */}
                <div className={`${selectedUser ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-slate-900 flex flex-col bg-black`}>
                    <div className="p-6 border-b border-slate-900">
                        <h2 className="text-2xl font-bold text-white">Messages</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading && users.length === 0 ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                <p>No conversations yet</p>
                                <p className="text-sm mt-2">Start following people to chat!</p>
                            </div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedUser?._id === user._id
                                        ? "bg-slate-900"
                                        : "hover:bg-slate-900/50"
                                        }`}
                                >
                                    <Avatar src={user.avatar} name={user.username} size={48} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate">{user.username}</p>
                                        <p className="text-sm text-slate-400 truncate">{user.name}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-black`}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-900 flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="md:hidden p-2 hover:bg-slate-900 rounded-full transition"
                                >
                                    <ArrowLeft size={20} className="text-white" />
                                </button>
                                <Avatar src={selectedUser.avatar} name={selectedUser.username} size={40} />
                                <div>
                                    <p className="font-bold text-white">{selectedUser.username}</p>
                                    <p className="text-xs text-slate-400">{selectedUser.name}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((msg) => {
                                    const isSender = msg.senderId === currentUser?._id || msg.senderId === currentUser?.id;
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isSender
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-900 text-slate-100"
                                                    }`}
                                            >
                                                <p className="break-words">{msg.message}</p>
                                                <p className="text-[10px] mt-1 opacity-70">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-900 text-white rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full p-3 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            <div className="text-center">
                                <p className="text-xl font-semibold mb-2">Select a conversation</p>
                                <p className="text-sm">Choose a user from the sidebar to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Messages;
