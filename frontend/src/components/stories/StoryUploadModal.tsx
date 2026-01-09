import { Upload } from "lucide-react";

const StoryUploadModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-[360px]">
        <h2 className="text-white font-semibold mb-4">Create Story</h2>

        <label className="border border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-white">
          <Upload />
          <span className="text-sm mt-2">Upload image or video</span>
          <input type="file" hidden />
        </label>

        <button className="mt-4 w-full bg-white text-black py-2 rounded-lg font-medium">
          Share
        </button>
      </div>
    </div>
  );
};

export default StoryUploadModal;
