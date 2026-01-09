import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Props {
  profile: any;
}

const MyProfileHeader: React.FC<Props> = ({ profile }) => {
  return (
    <div >
      <div className="flex flex-col md:flex-row gap-8 md:gap-14">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            src={profile.avatar}
            name={profile.username}
            size={120}
          />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded-full">
            Note...
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Username & actions */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              {profile.username}
            </h2>

            <Button
              variant="secondary"
              className="bg-slate-800 text-white hover:bg-slate-700"
            >
              Edit profile
            </Button>

            <Button
              variant="secondary"
              className="bg-slate-800 text-white hover:bg-slate-700"
            >
              View archive
            </Button>

            <button className="p-2 rounded-full hover:bg-slate-800 text-white">
              <Settings size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-white">
            <span>
              <b>{profile.postsCount}</b>{" "}
              <span className="text-slate-400">posts</span>
            </span>
            <span>
              <b>{profile.followers.length}</b>{" "}
              <span className="text-slate-400">followers</span>
            </span>
            <span>
              <b>{profile.following.length}</b>{" "}
              <span className="text-slate-400">following</span>
            </span>
          </div>

          {/* Bio */}
          <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            <b className="text-white">{profile.name}</b>
            {"\n"}
            {profile.bio}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeader;
