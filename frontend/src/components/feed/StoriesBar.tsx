import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useStoryStore } from "@/stores/storyStore";
import CreateStoryModal from "../story/CreateStoryModal";
import { useAuthStore } from "@/stores/authStore";

const StoriesBar: React.FC = () => {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { stories, fetchStories } = useStoryStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 border-b border-slate-900/50 mb-4 bg-black/20 backdrop-blur-sm rounded-xl">
      <div className="flex gap-4 px-4 min-w-max">
        {/* Your Story Placeholder */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex flex-col items-center gap-1.5 group shrink-0"
        >
          <div className="relative p-[2px] rounded-full border border-slate-800 group-hover:border-slate-700 transition">
            <div className="bg-black p-[2px] rounded-full">
              <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 overflow-hidden relative">
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    name={user.username || "Me"}
                    size={56}
                    className="opacity-50 grayscale"
                  />
                ) : (
                  <span className="text-xl">+</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-black text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-blue-500/50 transition">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 group-hover:text-white transition">Your Story</span>
        </button>

        <CreateStoryModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />

        {stories.map((story) => (
          <button
            key={story._id}
            onClick={() => {
              if (story.user?.username) {
                navigate(`/story/${story.user.username}/${story._id}`);
              }
            }}
            className="flex flex-col items-center gap-1.5 group shrink-0"
          >
            {/* Gradient Ring */}
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
              <div className="bg-black p-[2px] rounded-full">
                <Avatar
                  name={story.user?.username || "Viber"}
                  src={story.user?.avatar}
                  size={56}
                />
              </div>
            </div>

            {/* Username */}
            <span className="text-[11px] text-slate-300 max-w-[68px] truncate group-hover:text-white transition">
              {story.user?.username || "..."}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
