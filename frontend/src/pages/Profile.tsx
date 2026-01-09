import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGrid from "@/components/profile/ProfileGrid";
import FollowModal from "@/components/profile/FollowModal";
import { mockProfile } from "@/mocks/profile";
import { mockPosts } from "@/mocks/profilePosts";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <ProfileHeader
          profile={mockProfile}
          onFollowersClick={() => setFollowersOpen(true)}
          onFollowingClick={() => setFollowingOpen(true)}
        />

        {/* Tabs */}
        <ProfileTabs tab={activeTab} setTab={setActiveTab} />

        {/* Grid */}
        <ProfileGrid
          posts={mockPosts}
          type={activeTab === "posts" ? "image" : "video"}
        />

        {/* Followers Modal */}
        <FollowModal
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          title="Followers"
        />

        {/* Following Modal */}
        <FollowModal
          open={followingOpen}
          onClose={() => setFollowingOpen(false)}
          title="Following"
        />
      </div>
    </div>
  );
};

export default Profile;
