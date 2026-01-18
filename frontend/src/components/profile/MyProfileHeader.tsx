import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Props {
  profile: any;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onEditClick?: () => void;
}

const MyProfileHeader: React.FC<Props> = ({
  profile,
  onFollowersClick,
  onFollowingClick,
  onEditClick
}) => {
  return (
    <div className="border-b border-slate-900 pb-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center md:items-start text-center md:text-left">
        {/* Avatar */}
        <div className="relative group">
          <div className="p-1 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700">
            <Avatar
              src={profile.avatar}
              name={profile.username}
              size={150}
              className="border-4 border-black"
            />
          </div>
          {/* Active status indicator */}
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-black rounded-full shadow-lg"></div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6 pt-4 w-full">
          {/* Username & actions */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile.username}
            </h2>

            <div className="flex gap-2">
              <Button
                onClick={onEditClick}
                variant="secondary"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl px-6 h-9 transition-all active:scale-95"
              >
                Edit Profile
              </Button>

              <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all bg-slate-900/50 active:scale-90">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-10 md:gap-14 py-2">
            <div className="flex flex-col md:flex-row items-center gap-1">
              <span className="text-lg font-bold text-white">{profile.postsCount}</span>
              <span className="text-sm text-slate-500 font-medium">posts</span>
            </div>

            <button
              onClick={onFollowersClick}
              className="group flex flex-col md:flex-row items-center gap-1 transition-all"
            >
              <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {profile.followers?.length || 0}
              </span>
              <span className="text-sm text-slate-500 group-hover:text-slate-400 font-medium">followers</span>
            </button>

            <button
              onClick={onFollowingClick}
              className="group flex flex-col md:flex-row items-center gap-1 transition-all"
            >
              <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {profile.following?.length || 0}
              </span>
              <span className="text-sm text-slate-500 group-hover:text-slate-400 font-medium">following</span>
            </button>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <p className="text-base font-bold text-white">{profile.name}</p>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed max-w-md mx-auto md:mx-0">
              {profile.bio || "No bio yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeader;
