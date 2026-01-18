import { useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoriesBar from "@/components/feed/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import { usePostStore } from "@/stores/postStore";

const Home: React.FC = () => {
  const {
    posts,
    loading,
    error,
    fetchFeed,
    hasMore,
    isFetchingMore,
    page
  } = usePostStore();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading) {
          fetchFeed(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isFetchingMore, loading, page, fetchFeed]);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <StoriesBar />

        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
            <p className="text-slate-500 text-sm">Fetching your vibe...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Infinite Scroll Target */}
            <div ref={observerTarget} className="h-10 mt-4 flex justify-center">
              {isFetchingMore && (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              )}
            </div>

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-slate-500 text-sm py-4">
                You've caught up properly!
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
