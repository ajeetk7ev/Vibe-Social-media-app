import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ProfileHeaderProps {
  profile: any;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onFollowersClick,
  onFollowingClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-14">
      {/* Avatar */}
      <Avatar
        src={profile.avatar}
        name={profile.username}
        size={120}
      />

      {/* Info */}
      <div className="flex-1 space-y-4">
        {/* Username + actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold text-white">
              {profile.username}
            </h2>

            {profile.verified && (
              <CheckCircle
                size={18}
                className="text-blue-500 ml-1"
              />
            )}
          </div>

          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Following
          </Button>

          <Button
            variant="secondary"
            className="bg-slate-800 text-white hover:bg-slate-700"
          >
            Message
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-white">
          <span>
            <b>{profile.postsCount}</b>{" "}
            <span className="text-slate-400">posts</span>
          </span>

          <button
            onClick={onFollowersClick}
            className="hover:opacity-80 transition"
          >
            <b>{profile.followers.length.toLocaleString()}</b>{" "}
            <span className="text-slate-400">followers</span>
          </button>

          <button
            onClick={onFollowingClick}
            className="hover:opacity-80 transition"
          >
            <b>{profile.following.length}</b>{" "}
            <span className="text-slate-400">following</span>
          </button>
        </div>

        {/* Bio */}
        <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
          <b className="text-white">{profile.name}</b>
          {"\n"}
          {profile.bio}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
