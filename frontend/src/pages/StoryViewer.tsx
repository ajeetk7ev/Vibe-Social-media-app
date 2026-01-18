import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Heart, Send } from "lucide-react";
import { useStoryStore } from "@/stores/storyStore";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import StoryProgress from "@/components/stories/StoryProgress";
import toast from "react-hot-toast";

const STORY_DURATION = 5000;

const StoryViewer: React.FC = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { stories, viewStory, likeStory, unlikeStory } = useStoryStore();
  const { user } = useAuthStore();
  const { sendMessage } = useChatStore();

  const startIndex = stories.findIndex((s) => s._id === storyId);
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const story = stories[index];

  // AUTO PLAY
  useEffect(() => {
    if (isPaused) return;

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
  }, [index, isPaused]);

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
  }, [story?._id]); // improved dep

  const handleLike = async () => {
    if (!story || !user) return;
    const isLiked = story.likes?.includes(user._id || user.id || "");
    if (isLiked) {
      await unlikeStory(story._id);
    } else {
      await likeStory(story._id);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !story) return;

    // Send DM
    await sendMessage(story.user._id, `Replying to story: ${replyText}`);
    toast.success("Reply sent!");
    setReplyText("");
    setIsPaused(false); // Resume after sending
  };

  if (!story) return <div className="text-white text-center mt-20">Story not found</div>;

  const isLiked = story.likes?.includes(user?._id || user?.id || "");

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* CLOSE */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 text-white z-50 hover:bg-white/10 p-2 rounded-full transition"
      >
        <X size={28} />
      </button>

      {/* STORY CARD */}
      <div
        className="relative w-[360px] sm:w-[420px] h-[85vh] rounded-xl overflow-hidden bg-zinc-900"
      >
        <StoryProgress progress={progress} />

        {/* HEADER */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex items-center gap-3 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <img
            src={story.user.avatar}
            className="w-9 h-9 rounded-full border border-white/20"
          />
          <span className="text-white font-semibold text-sm shadow-sm">
            {story.user.username}
          </span>
        </div>

        {/* MEDIA */}
        <div
          className="w-full h-full"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
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
        </div>

        {/* TAP ZONES (Absolute over media, under controls) */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-[80%]" onClick={prev}></div>
          <div className="w-1/3 h-[80%]" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)}></div>
          <div className="w-1/3 h-[80%]" onClick={next}></div>
        </div>

        {/* ACTIONS & REPLY */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30 flex items-center gap-3">
          <form
            onSubmit={handleReply}
            className="flex-1"
          >
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => !replyText && setIsPaused(false)}
              placeholder="Reply..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/70 outline-none focus:bg-black/40 focus:border-white/50 transition-all backdrop-blur-sm"
            />
          </form>

          <button
            onClick={handleLike}
            className="p-3 hover:bg-white/10 rounded-full transition active:scale-95 backdrop-blur-sm"
          >
            <Heart
              size={28}
              className={isLiked ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>

          <button
            onClick={(e) => handleReply(e as any)}
            className="p-3 hover:bg-white/10 rounded-full transition active:scale-95 backdrop-blur-sm"
          >
            <Send size={26} className="text-white rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
