import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyProfileState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full border-2 border-slate-600 flex items-center justify-center mb-4">
        <Camera size={32} className="text-white" />
      </div>

      <h3 className="text-2xl font-semibold text-white">
        Share Photos
      </h3>

      <p className="text-slate-400 mt-2">
        When you share photos, they will appear on your profile.
      </p>

      <Link
        to="/create/post"
        className="text-blue-500 font-medium mt-4 hover:underline"
      >
        Share your first photo
      </Link>
    </div>
  );
};

export default EmptyProfileState;
