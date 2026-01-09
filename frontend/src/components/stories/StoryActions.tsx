import { Heart, Send } from "lucide-react";

const StoryActions: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <button className="text-white hover:scale-110 transition">
        <Heart />
      </button>
      <button className="text-white hover:scale-110 transition">
        <Send />
      </button>
    </div>
  );
};

export default StoryActions;
