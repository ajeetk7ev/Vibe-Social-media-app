import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ProfileHeaderProps {
  profile: any;
  onFollowClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onFollowClick,
  onFollowersClick,
  onFollowingClick,
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
          {/* Active status indicator if verified */}
          {profile.verified && (
            <div className="absolute bottom-4 right-4 bg-black rounded-full p-1 shadow-xl">
              <CheckCircle size={24} className="text-blue-500" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6 pt-4 w-full">
          {/* Username & actions */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile.username}
              {profile.verified && <CheckCircle size={18} className="text-blue-500" fill="currentColor" />}
            </h2>

            <div className="flex gap-2">
              <Button
                onClick={onFollowClick}
                className={`
                    ${profile.isFollowing
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"}
                    px-8 font-bold rounded-xl h-9 transition-all active:scale-95 shadow-lg shadow-blue-900/10
                    `}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </Button>

              <Button
                variant="secondary"
                className="bg-slate-900/50 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-9 border border-slate-800 transition-all active:scale-95"
              >
                Message
              </Button>
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

export default ProfileHeader;
