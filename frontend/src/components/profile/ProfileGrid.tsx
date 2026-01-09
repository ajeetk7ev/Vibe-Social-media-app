const ProfileGrid = ({ posts, type }: any) => {
  return (
    <div className="grid grid-cols-3 gap-[2px] mt-6 bg-slate-900">
      {posts
        .filter((p: any) => p.type === type)
        .map((post: any) => (
          <div
            key={post.id}
            className="relative aspect-square bg-black overflow-hidden group cursor-pointer"
          >
            {type === "image" ? (
              <img
                src={post.url}
                className="w-full h-full object-cover group-hover:opacity-80 transition"
              />
            ) : (
              <video
                src={post.url}
                muted
                loop
                className="w-full h-full object-cover group-hover:opacity-80 transition"
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default ProfileGrid;
