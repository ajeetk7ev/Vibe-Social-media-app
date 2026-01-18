import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Send, X, MessageSquareOff } from "lucide-react";
import Avatar from "../common/Avatar";
import { useState, useEffect } from "react";
import { usePostStore } from "@/stores/postStore";
import type { Comment } from "@/types";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  postAuthor: string;
  postId: string;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  postAuthor,
  postId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { getComments, addComment } = usePostStore();

  useEffect(() => {
    const fetchComments = async () => {
      if (open && postId) {
        setLoading(true);
        try {
          const data = await getComments(postId);
          setComments(data);
        } catch (error) {
          console.error("Failed to fetch comments", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchComments();
  }, [open, postId, getComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(postId, newComment);
      setNewComment("");
      const updatedComments = await getComments(postId);
      setComments(updatedComments);
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] bg-black border border-slate-800 p-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-900">
          <h3 className="text-white font-semibold text-center flex-1">Comments</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <X size={22} />
          </button>
        </div>

        {/* Comments Area */}
        <div className="h-[400px] overflow-y-auto px-4 py-4 bg-black/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
              <p className="text-xs text-slate-500">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <MessageSquareOff size={40} className="opacity-20" />
              <p className="text-sm">No comments yet. Be the first to reply!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Avatar
                    name={comment.user.username}
                    src={comment.user.avatar}
                    size={32}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-white">
                        {comment.user.username}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-slate-900 bg-black">
          <div className="flex items-center gap-3 bg-slate-900/50 p-2 pl-4 rounded-full border border-slate-800 focus-within:border-slate-700 transition">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Add a comment for ${postAuthor}...`}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="p-2 text-blue-500 hover:text-blue-400 disabled:text-slate-700 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
