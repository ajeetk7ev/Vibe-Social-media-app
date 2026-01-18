import { Dialog, DialogContent } from "@/components/ui/dialog";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { X, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface FollowModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  users?: any[];
}

const FollowModal = ({ open, onClose, title, users = [] }: FollowModalProps) => {
  const { user: currentUser } = useAuthStore();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-slate-800 rounded-2xl max-w-sm p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-900">
          <div className="w-6" /> {/* Spacer */}
          <h3 className="text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 bg-black">
          {users.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-slate-900/50">
                  {title === "Followers" ? <UserPlus size={40} className="text-slate-700" /> : <UserPlus size={40} className="text-slate-700" />}
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">No {title.toLowerCase()} yet</p>
            </div>
          ) : (
            users.map((user) => {
              const isMe = currentUser?._id === (user._id || user);
              const username = user.username || "User";
              const avatar = user.avatar || "";
              const userId = user._id || user;

              return (
                <div key={userId} className="flex items-center justify-between p-3 hover:bg-slate-900 rounded-xl transition group">
                  <Link to={`/profile/${username}`} onClick={onClose} className="flex items-center gap-3">
                    <Avatar src={avatar} name={username} size={44} />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold group-hover:text-blue-400 transition-colors">
                        {username}
                      </span>
                      <span className="text-slate-500 text-xs line-clamp-1">
                        {user.name || "Vibe member"}
                      </span>
                    </div>
                  </Link>

                  {!isMe && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 h-8 px-4 text-xs font-semibold rounded-lg"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
