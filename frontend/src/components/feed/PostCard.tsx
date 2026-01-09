import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Avatar from "../common/Avatar";
import {type Post } from "@/types/post";
import CommentModal from "../post/CommentModal";
import { usePostStore } from "@/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [openComments, setOpenComments] = useState(false);
  const { likePost, unlikePost } = usePostStore();
  const { user } = useAuthStore();
  const isLiked = user ? post.likes.includes(user._id) : false;

  useEffect(() => {
    setLikesCount(post.likes.length);
  }, [post.likes.length]);

  const toggleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(post._id);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to toggle like");
    }
  };

  return (
    <>
      <div className="border border-slate-800 rounded-lg bg-slate-950 mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <Avatar name={post.author.username} />
          <span className="text-white font-medium">
            {post.author.username}
          </span>
        </div>

        {/* Media */}
        {post.media[0] && (
          <img
            src={post.media[0].url}
            alt="post"
            className="w-full max-h-[500px] object-cover"
          />
        )}

        {/* Actions */}
        <div className="p-4 space-y-3">
          <div className="flex gap-4 text-slate-300">
            <Heart
              className={`cursor-pointer transition ${
                isLiked ? "text-red-500 fill-red-500" : "hover:text-red-500"
              }`}
              onClick={toggleLike}
            />
            <MessageCircle
              className="cursor-pointer hover:text-white"
              onClick={() => setOpenComments(true)}
            />
          </div>

          {/* Likes */}
          <p className="text-sm text-white font-medium">
            {likesCount} likes
          </p>

          {/* Caption */}
          {post.caption && (
            <p className="text-sm text-white">
              <span className="font-semibold">
                {post.author.username}
              </span>{" "}
              {post.caption}
            </p>
          )}

          {/* View comments */}
          <button
            onClick={() => setOpenComments(true)}
            className="text-sm text-slate-400 hover:text-white"
          >
            View all comments
          </button>
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
