import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoriesBar from "@/components/feed/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import { usePostStore } from "@/stores/postStore";

const Home: React.FC = () => {
  const { posts, loading, error, fetchFeed } = usePostStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (error) return <MainLayout><div>Error: {error}</div></MainLayout>;

  return (
    <MainLayout>
      <StoriesBar />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </MainLayout>
  );
};

export default Home;
