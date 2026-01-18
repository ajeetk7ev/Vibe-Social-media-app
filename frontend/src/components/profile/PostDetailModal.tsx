import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, MessageCircle, Trash2, X } from "lucide-react";
import Avatar from "../common/Avatar";
import { usePostStore } from "@/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

interface PostDetailModalProps {
    open: boolean;
    onClose: () => void;
    post: any;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ open, onClose, post }) => {
    const { deletePost, likePost, unlikePost } = usePostStore();
    const { user } = useAuthStore();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!post) return null;

    const currentUserId = (user as any)?._id || (user as any)?.id;
    const isAuthor = post.authorId === currentUserId;

    const isLiked = user && post.likes ? post.likes.some((id: any) => {
        const likeId = id?._id || id?.id || id;
        return String(likeId) === String(currentUserId);
    }) : false;

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            const success = await deletePost(post.id);
            if (success) {
                toast.success("Post deleted");
                onClose();
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleLike = async () => {
        if (!user) return toast.error("Please login to like");
        if (isLiked) {
            await unlikePost(post.id);
        } else {
            await likePost(post.id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-5xl h-[90vh] md:h-[80vh] bg-black border-slate-800 p-0 overflow-hidden flex flex-col md:flex-row rounded-xl shadow-2xl">
                {/* Left Side: Media */}
                <div className="md:flex-1 h-1/2 md:h-full bg-slate-950 flex items-center justify-center relative">
                    {post.type === "video" ? (
                        <video src={post.url} className="w-full h-full object-contain" controls autoPlay loop muted />
                    ) : (
                        <img src={post.url} alt="post" className="w-full h-full object-contain" />
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col bg-black border-l border-slate-800">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar src={post.authorAvatar} name={post.authorUsername} size={32} />
                            <span className="text-sm font-bold text-white">{post.authorUsername}</span>
                        </div>
                        {isAuthor && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-900"
                            >
                                {isDeleting ? <span className="animate-spin">...</span> : <Trash2 size={18} />}
                            </button>
                        )}
                    </div>

                    {/* Caption & Comments (Placeholder for now) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex gap-3">
                            <Avatar src={post.authorAvatar} name={post.authorUsername} size={32} />
                            <div className="text-sm text-slate-200">
                                <span className="font-bold text-white mr-2">{post.authorUsername}</span>
                                {post.caption}
                            </div>
                        </div>

                        <div className="mt-8 text-center py-10">
                            <MessageCircle size={32} className="mx-auto text-slate-700 mb-2" />
                            <p className="text-xs text-slate-500">Comments coming soon...</p>
                        </div>
                    </div>

                    {/* Interaction Area */}
                    <div className="p-4 border-t border-slate-800 space-y-3">
                        <div className="flex gap-4">
                            <button onClick={handleToggleLike} className="hover:opacity-70 transition">
                                <Heart size={24} fill={isLiked ? "#ef4444" : "none"} className={isLiked ? "text-red-500" : "text-white"} />
                            </button>
                            <button className="hover:opacity-70 transition">
                                <MessageCircle size={24} className="text-white" />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-white">
                            {(post.likes?.length || 0).toLocaleString()} likes
                        </p>
                    </div>
                </div>

                {/* Close trigger for mobile */}
                <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-white bg-black/50 p-1 rounded-full cursor-pointer">
                    <X size={20} />
                </button>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailModal;
