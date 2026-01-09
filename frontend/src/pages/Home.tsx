import MainLayout from "@/components/layout/MainLayout";
import StoriesBar from "@/components/feed/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import { mockPosts } from "@/mocks/posts";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <StoriesBar />
      {mockPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </MainLayout>
  );
};

export default Home;
