import { X } from "lucide-react";

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onRemove }) => {
  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith("video");

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-800">
      {isVideo ? (
        <video
          src={url}
          controls
          className="w-full h-40 object-cover"
        />
      ) : (
        <img
          src={url}
          alt="preview"
          className="w-full h-40 object-cover"
        />
      )}

      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default MediaPreview;
