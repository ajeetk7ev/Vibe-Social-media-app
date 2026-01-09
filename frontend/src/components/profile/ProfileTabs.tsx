import { Grid, Film } from "lucide-react";

const ProfileTabs = ({ tab, setTab }: any) => {
  return (
    <div className="flex justify-center gap-16 border-t border-slate-800 mt-10">
      <button
        onClick={() => setTab("posts")}
        className={`
          flex items-center gap-2 py-4 text-sm tracking-wide
          ${
            tab === "posts"
              ? "text-white border-t-2 border-white"
              : "text-slate-400 hover:text-white"
          }
        `}
      >
        <Grid size={16} /> POSTS
      </button>

      <button
        onClick={() => setTab("reels")}
        className={`
          flex items-center gap-2 py-4 text-sm tracking-wide
          ${
            tab === "reels"
              ? "text-white border-t-2 border-white"
              : "text-slate-400 hover:text-white"
          }
        `}
      >
        <Film size={16} /> REELS
      </button>
    </div>
  );
};

export default ProfileTabs;
