import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import { API_URL } from "@/utils/api";
import type { User } from "@/types";
import { Link } from "react-router-dom";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Discover: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/all`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    setFollowLoading(userId);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.post(`${API_URL}/user/${endpoint}/${userId}`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isFollowing: !isFollowing } : u
          )
        );
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setFollowLoading(null);
    }
  };

  return (
    <MainLayout>
      <div className="px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Discover</h1>
          <p className="text-slate-500 mt-1">Meet and vibing with new people across the globe.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-500 text-sm animate-pulse">Finding vibes nearby...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">No new users to discover right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user: any) => (
              <div
                key={user._id}
                className="group relative bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 hover:bg-slate-900/60 transition-all duration-300 hover:border-slate-700/50"
              >
                {/* Profile Link Area */}
                <Link to={`/profile/${user.username}`} className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-linear-to-tr from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                    <img
                      src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-vector-illustration_561158-3383.jpg"}
                      alt={user.username}
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-800 relative z-10"
                    />
                  </div>
                  
                  <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">
                    {user.name || user.username}
                  </h3>
                  <p className="text-slate-500 text-xs mb-3">@{user.username}</p>
                  
                  {user.bio && (
                    <p className="text-slate-400 text-xs line-clamp-2 min-h-[32px] px-2">
                       {user.bio}
                    </p>
                  )}
                </Link>

                {/* Action Area */}
                <button
                  onClick={() => handleFollow(user._id, user.isFollowing)}
                  disabled={followLoading === user._id}
                  className={`
                    mt-5 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${user.isFollowing 
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                      : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {followLoading === user._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : user.isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Discover;
