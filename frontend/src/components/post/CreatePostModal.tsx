import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import MediaPreview from "./MediaPreview";
import { usePostStore } from "@/stores/postStore";
import toast from "react-hot-toast";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
}) => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { createPost, loading } = usePostStore();

 const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = e.target.files;
  if (!selectedFiles) return;

  setFiles((prev) => [
    ...prev,
    ...Array.from(selectedFiles),
  ]);
};
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!files.length && !caption.trim()) return;

    const success = await createPost(caption, files);
    if (success) {
      toast.success("Post created successfully!");
      onClose();
      setCaption("");
      setFiles([]);
    } else {
      toast.error("Failed to create post");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-xl
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
          border border-slate-800
          rounded-2xl
          p-0
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold text-lg">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Upload */}
          <label
            className="
              flex flex-col items-center justify-center
              border border-dashed border-slate-700
              rounded-xl
              p-10
              bg-slate-900/40
              cursor-pointer
              hover:border-white
              hover:bg-slate-900/60
              transition
            "
          >
            <ImagePlus size={36} className="text-slate-400" />
            <p className="mt-3 text-sm text-slate-300">
              Drag photos or videos here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG, MP4 supported
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={handleFiles}
            />
          </label>

          {/* Preview */}
          {files.length > 0 && (
            <div>
              <h4 className="text-sm text-slate-300 mb-3">
                Preview
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {files.map((file, index) => (
                  <MediaPreview
                    key={index}
                    file={file}
                    onRemove={() => removeFile(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="
                bg-slate-900
                border-slate-800
                text-white
                resize-none
                min-h-[110px]
                focus:border-white
              "
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Add a caption</span>
              <span>{caption.length}/2200</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="
              bg-white
              text-black
              hover:bg-slate-200
              font-medium
              px-6
            "
          >
            {loading ? "Posting..." : "Share"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
