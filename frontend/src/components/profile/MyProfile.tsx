import { useEffect, useState } from "react";
import MyProfileHeader from "@/components/profile/MyProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileGrid from "@/components/profile/ProfileGrid";
import EmptyProfileState from "@/components/profile/EmptyProfileState";
import FollowModal from "@/components/profile/FollowModal";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";
import { useUserStore } from "@/stores/userStore";
import EditProfileModal from "@/components/profile/EditProfileModal";

const MyProfile = () => {
  const [tab, setTab] = useState<"posts" | "reels">("posts");
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { user: authUser } = useAuthStore();
  const { posts, fetchUserPosts, loading: postsLoading } = usePostStore();
  const { targetUser: user, fetchProfileByUsername, loading: userLoading } = useUserStore();

  useEffect(() => {
    if (authUser?.username) {
      fetchProfileByUsername(authUser.username);
    }
  }, [authUser?.username, fetchProfileByUsername]);

  useEffect(() => {
    if (authUser?._id) {
      fetchUserPosts(authUser._id);
    }
  }, [authUser?._id, fetchUserPosts]);

  if (!user) return null;

  // Transform backend posts for ProfileGrid
  const transformedPosts = posts.map(post => ({
    id: post._id,
    url: post.media[0]?.url,
    type: post.media[0]?.mimeType.startsWith("video") ? "video" : "image",
    likes: post.likes,
    caption: post.caption,
    authorId: (user as any)?._id,
    authorUsername: user.username,
    authorAvatar: user.avatar,
    isMultiple: post.media.length > 1
  }));

  const filteredPosts = transformedPosts.filter(
    (p) => p.type === (tab === "posts" ? "image" : "video")
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MyProfileHeader
          profile={{
            ...user,
            postsCount: posts.length,
            followers: user.followers || [],
            following: user.following || []
          }}
          onFollowersClick={() => setFollowersOpen(true)}
          onFollowingClick={() => setFollowingOpen(true)}
          onEditClick={() => setEditModalOpen(true)}
        />

        <ProfileTabs tab={tab} setTab={setTab} />

        <div className="mt-8">
          {postsLoading || userLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyProfileState />
          ) : (
            <ProfileGrid posts={filteredPosts} />
          )}
        </div>

        <EditProfileModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          profile={user}
        />

        <FollowModal
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          title="Followers"
          users={user.followers}
        />

        <FollowModal
          open={followingOpen}
          onClose={() => setFollowingOpen(false)}
          title="Following"
          users={user.following}
        />
      </div>
    </div>
  );
};

export default MyProfile;
