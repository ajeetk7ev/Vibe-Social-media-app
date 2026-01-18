import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGrid from "@/components/profile/ProfileGrid";
import FollowModal from "@/components/profile/FollowModal";
import { useUserStore } from "@/stores/userStore";
import { usePostStore } from "@/stores/postStore";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const { targetUser, isFollowing, loading: userLoading, fetchProfileByUsername, followUser, unfollowUser } = useUserStore();
  const { posts, fetchUserPosts, loading: postsLoading } = usePostStore();

  useEffect(() => {
    if (username) {
      fetchProfileByUsername(username);
    }
  }, [username, fetchProfileByUsername]);

  useEffect(() => {
    if (targetUser?._id) {
      fetchUserPosts(targetUser._id);
    }
  }, [targetUser?._id, fetchUserPosts]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        User not found
      </div>
    );
  }

  // Transform backend posts for ProfileGrid
  const transformedPosts = posts.map(post => ({
    id: post._id,
    url: post.media[0]?.url,
    type: post.media[0]?.mimeType.startsWith("video") ? "video" : "image",
    likes: post.likes,
    caption: post.caption,
    authorId: (targetUser as any)?._id,
    authorUsername: targetUser.username,
    authorAvatar: targetUser.avatar,
    isMultiple: post.media.length > 1
  }));

  const filteredPosts = transformedPosts.filter(
    (p) => p.type === (activeTab === "posts" ? "image" : "video")
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <ProfileHeader
          profile={{
            ...targetUser,
            postsCount: posts.length,
            isFollowing
          }}
          onFollowClick={() => isFollowing ? unfollowUser(targetUser._id) : followUser(targetUser._id)}
          onFollowersClick={() => setFollowersOpen(true)}
          onFollowingClick={() => setFollowingOpen(true)}
        />

        {/* Tabs */}
        <ProfileTabs tab={activeTab} setTab={setActiveTab} />

        {/* Grid */}
        {postsLoading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-8">
            <ProfileGrid
              posts={filteredPosts}
            />
          </div>
        )}

        {/* Followers Modal */}
        <FollowModal
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          title="Followers"
          users={targetUser.followers}
        />

        {/* Following Modal */}
        <FollowModal
          open={followingOpen}
          onClose={() => setFollowingOpen(false)}
          title="Following"
          users={targetUser.following}
        />
      </div>
    </div>
  );
};

export default Profile;
