import { Heart, MessageCircle } from "lucide-react";
import {type Post } from "@/types/post";
import Avatar from "../common/Avatar";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
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
          alt=""
          className="w-full max-h-[500px] object-cover"
        />
      )}

      {/* Actions */}
      <div className="p-4 space-y-2">
        <div className="flex gap-4 text-slate-300">
          <Heart className="cursor-pointer hover:text-red-500" />
          <MessageCircle className="cursor-pointer hover:text-white" />
        </div>

        <p className="text-sm text-white">
          <span className="font-semibold">{post.author.username}</span>{" "}
          {post.caption}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
