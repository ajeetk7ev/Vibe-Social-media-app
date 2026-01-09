import { mockStories } from "@/mocks/sotries";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";

const StoriesBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-6">
      <div className="flex gap-5 px-1">
        {mockStories.map((story) => (
          <button
            key={story._id}
            onClick={() =>
              navigate(`/story/${story.user.username}/${story._id}`)
            }
            className="flex flex-col items-center gap-2 group"
          >
            {/* Gradient Ring */}
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="bg-slate-950 p-[2px] rounded-full">
                <Avatar
                  name={story.user.username}
                  src={story.user.avatar}
                  size={56}
                />
              </div>
            </div>

            {/* Username */}
            <span className="text-xs text-slate-300 max-w-[64px] truncate group-hover:text-white">
              {story.user.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
