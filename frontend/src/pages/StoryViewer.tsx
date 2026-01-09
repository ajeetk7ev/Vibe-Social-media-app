import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useStoryStore } from "@/stores/storyStore";
import StoryProgress from "@/components/stories/StoryProgress";
import StoryActions from "@/components/stories/StoryActions";

const STORY_DURATION = 5000;

const StoryViewer: React.FC = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { stories, viewStory } = useStoryStore();

  const startIndex = stories.findIndex((s) => s._id === storyId);
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);

  const story = stories[index];

  // AUTO PLAY
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 2;
      });
    }, STORY_DURATION / 50);

    return () => clearInterval(interval);
  }, [index]);

  const next = () => {
    if (index < stories.length - 1) {
      setIndex(index + 1);
    } else {
      navigate(-1);
    }
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  useEffect(() => {
    if (story) {
      viewStory(story._id);
    }
  }, [story, viewStory]);

  if (!story) return <div>Loading...</div>;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={next}
    >
      {/* CLOSE */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 text-white z-50"
      >
        <X size={28} />
      </button>

      {/* STORY CARD */}
      <div
        className="relative w-[360px] sm:w-[420px] h-[85vh] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <StoryProgress progress={progress} />

        {/* HEADER */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3 z-20 bg-gradient-to-b from-black/70 to-transparent">
          <img
            src={story.user.avatar}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white text-sm font-medium">
            {story.user.username}
          </span>
        </div>

        {/* MEDIA */}
        {story.mediaType === "image" ? (
          <img
            src={story.mediaUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={story.mediaUrl}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* ACTIONS */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-3">
          <input
            placeholder="Reply..."
            className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/60 outline-none"
          />
          <StoryActions />
        </div>

        {/* TAP ZONES */}
        <div
          className="absolute left-0 top-0 w-1/3 h-full"
          onClick={prev}
        />
        <div
          className="absolute right-0 top-0 w-1/3 h-full"
          onClick={next}
        />
      </div>
    </div>
  );
};

export default StoryViewer;
