import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Send, X } from "lucide-react";
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
  const { getComments, addComment } = usePostStore();

  useEffect(() => {
    if (open && postId) {
      getComments(postId).then(setComments);
    }
  }, [open, postId, getComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await addComment(postId, newComment);
    setNewComment("");
    // Refresh comments
    const updatedComments = await getComments(postId);
    setComments(updatedComments);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-slate-950 border border-slate-800 p-0 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h3 className="text-white font-medium">Comments</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Comments */}
        <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar name={comment.user.username} />
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {comment.user.username}
                  </span>{" "}
                  {comment.text}
                </p>
                <div className="flex items-center gap-2 mt-1 text-slate-400">
                  <button>
                    <Heart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-800">
          <Avatar name="You" />
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Reply to ${postAuthor}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="text-blue-500 hover:text-blue-400 disabled:text-slate-500"
          >
            <Send size={18} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
