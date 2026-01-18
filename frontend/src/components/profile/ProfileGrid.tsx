import { useState } from "react";
import PostDetailModal from "./PostDetailModal";
import { Heart, Film, Image as ImageIcon } from "lucide-react";

const ProfileGrid = ({ posts }: { posts: any[] }) => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square bg-slate-900 overflow-hidden group cursor-pointer rounded-sm md:rounded-lg shadow-md"
          >
            {post.type === "video" ? (
              <video
                src={post.url}
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={post.url}
                className="w-full h-full object-cover"
                alt="post"
              />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-6 text-white font-bold backdrop-blur-[2px]">
              <div className="flex items-center gap-2">
                <Heart size={20} fill="currentColor" />
                <span>{post.likes?.length || 0}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <MessageCircle size={20} fill="currentColor" />
                <span>0</span>
              </div> */}
            </div>

            {/* Type Indicator (Top Right) */}
            <div className="absolute top-2 right-2 text-white/70 drop-shadow-md">
              {post.type === "video" ? <Film size={18} /> : (post.isMultiple ? <ImageIcon size={18} /> : null)}
            </div>
          </div>
        ))}
      </div>

      <PostDetailModal
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
    </>
  );
};

export default ProfileGrid;
