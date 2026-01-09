import { useState } from "react";
import MyProfileHeader from "@/components/profile/MyProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGrid from "@/components/profile/ProfileGrid";
import EmptyProfileState from "@/components/profile/EmptyProfileState";
import { mockProfile } from "@/mocks/profile";
import { mockPosts } from "@/mocks/profilePosts";

const MyProfile = () => {
  const [tab, setTab] = useState<"posts" | "reels">("posts");

  const filteredPosts = mockPosts.filter(
    (p) => p.type === (tab === "posts" ? "image" : "video")
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <MyProfileHeader profile={mockProfile} />

        <ProfileTabs tab={tab} setTab={setTab} />

        {filteredPosts.length === 0 ? (
          <EmptyProfileState />
        ) : (
          <ProfileGrid posts={mockPosts} type={tab === "posts" ? "image" : "video"} />
        )}
      </div>
    </div>
  );
};

export default MyProfile;
