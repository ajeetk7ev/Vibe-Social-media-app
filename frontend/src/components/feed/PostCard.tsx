import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import Avatar from "../common/Avatar";
import { type Post } from "@/types/post";
import CommentModal from "../post/CommentModal";
import { usePostStore } from "@/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [openComments, setOpenComments] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const { likePost, unlikePost } = usePostStore();
  const { user } = useAuthStore();

  // Directly derive state from props for better reactivity with Zustand
  const currentUserId = (user as any)?._id || (user as any)?.id;
  const likesArr = Array.isArray(post.likes) ? post.likes : [];

  const isLiked = currentUserId && likesArr.some(id => {
    const likeId = (id as any)?._id || (id as any)?.id || id;
    return String(likeId) === String(currentUserId);
  });
  const likesCount = likesArr.length;

  const toggleLike = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      toggleLike();
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 1000);
  };

  return (
    <>
      <div className="border border-slate-800/60 rounded-xl bg-black mb-8 overflow-hidden transition hover:border-slate-700/60 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author.username}`}>
              <Avatar src={post.author.avatar} name={post.author.username} size={36} />
            </Link>
            <Link to={`/profile/${post.author.username}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
              {post.author.username}
            </Link>
          </div>
          <button className="text-slate-400 hover:text-white transition px-2 font-bold">
            ...
          </button>
        </div>

        {/* Media */}
        <div
          className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          {post.media[0] && (
            post.media[0].mimeType.startsWith("video") ? (
              <video
                src={post.media[0].url}
                className="w-full h-full object-cover"
                controls
                muted
                loop
              />
            ) : (
              <img
                src={post.media[0].url}
                alt="post"
                className="w-full h-full object-cover select-none"
              />
            )
          )}

          {showHeartOverlay && (
            <div className="absolute inset-0 flex items-center justify-center animate-ping pointer-events-none">
              <Heart size={80} fill="white" className="text-white opacity-70" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex gap-4 items-center">
            <button
              onClick={(e) => toggleLike(e)}
              className="hover:scale-125 active:scale-90 transition-transform duration-200"
            >
              <Heart
                size={26}
                fill={isLiked ? "#ef4444" : "none"}
                className={`${isLiked ? "text-red-500" : "text-white hover:text-slate-400"
                  } transition-colors`}
              />
            </button>
            <button
              onClick={() => setOpenComments(true)}
              className="hover:scale-110 active:scale-90 transition-transform"
            >
              <MessageCircle
                size={24}
                className="text-white hover:text-slate-400 transition-colors"
              />
            </button>
          </div>

          {/* Likes */}
          <p className="text-sm text-white font-bold cursor-pointer hover:opacity-80 transition">
            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
          </p>

          {/* Caption */}
          {post.caption && (
            <div className="text-sm text-white leading-snug">
              <Link to={`/profile/${post.author.username}`} className="font-bold mr-2 hover:opacity-80 transition">
                {post.author.username}
              </Link>
              <span className="text-slate-200">{post.caption}</span>
            </div>
          )}

          {/* View comments */}
          <button
            onClick={() => setOpenComments(true)}
            className="text-sm text-slate-500 hover:text-slate-400 transition mt-1 block"
          >
            View comments...
          </button>

          <p className="text-[10px] text-slate-600 uppercase tracking-tighter mt-1">
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        open={openComments}
        onClose={() => setOpenComments(false)}
        postAuthor={post.author.username}
        postId={post._id}
      />
    </>
  );
};

export default PostCard;
