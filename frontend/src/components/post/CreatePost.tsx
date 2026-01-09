import { useEffect, useState } from "react";
import CreatePostModal from "@/components/post/CreatePostModal";

const CreatePost: React.FC = () => {
  const [open, setOpen] = useState(true);

  // Close modal → redirect back
  useEffect(() => {
    if (!open) window.history.back();
  }, [open]);

  return <CreatePostModal open={open} onClose={() => setOpen(false)} />;
};

export default CreatePost;
