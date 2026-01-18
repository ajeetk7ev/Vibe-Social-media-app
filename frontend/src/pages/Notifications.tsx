import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { getFromLocalStorage } from "@/utils/localstorage";
import MainLayout from "@/components/layout/MainLayout";
import Avatar from "@/components/common/Avatar";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface Notification {
    _id: string;
    type: "like" | "comment" | "follow";
    fromUser: {
        _id: string;
        username: string;
        avatar: string;
    };
    post?: {
        _id: string;
    };
    isRead: boolean;
    createdAt: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = getFromLocalStorage("token");
            const res = await axios.get(`${API_URL}/notification`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data.notifications);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            const token = getFromLocalStorage("token");
            await axios.post(
                `${API_URL}/notification/read-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error(error);
        }
    };

    const markRead = async (id: string) => {
        try {
            const token = getFromLocalStorage("token");
            await axios.post(
                `${API_URL}/notification/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <MainLayout>
            <div className="bg-black min-h-[calc(100vh-100px)] text-white">
                <div className="flex items-center justify-between mb-6 px-4">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <button
                        onClick={markAllRead}
                        className="text-sm text-blue-500 hover:text-blue-400 font-semibold"
                    >
                        Mark all read
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <Heart size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => !notif.isRead && markRead(notif._id)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${notif.isRead ? "bg-black" : "bg-slate-900 border border-slate-800"
                                    }`}
                            >
                                {/* Icon */}
                                <div className="shrink-0">
                                    {notif.type === "like" && (
                                        <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                                            <Heart size={20} fill="currentColor" />
                                        </div>
                                    )}
                                    {notif.type === "comment" && (
                                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                            <MessageCircle size={20} />
                                        </div>
                                    )}
                                    {notif.type === "follow" && (
                                        <div className="p-2 bg-purple-500/10 rounded-full text-purple-500">
                                            <UserPlus size={20} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link to={`/profile/${notif.fromUser.username}`}>
                                            <Avatar src={notif.fromUser.avatar} name={notif.fromUser.username} size={32} />
                                        </Link>
                                        <p className="text-sm">
                                            <Link to={`/profile/${notif.fromUser.username}`} className="font-bold hover:underline">
                                                {notif.fromUser.username}
                                            </Link>{" "}
                                            <span className="text-slate-300">
                                                {notif.type === "like" && "liked your post."}
                                                {notif.type === "comment" && "commented on your post."}
                                                {notif.type === "follow" && "started following you."}
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Post Preview (optional) */}
                                {notif.post && (
                                    <div className="shrink-0">
                                        {/* If we had post thumbnail we could show it here */}
                                    </div>
                                )}

                                {!notif.isRead && (
                                    <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Notifications;
