import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, Lock } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "../common/Avatar";
import toast from "react-hot-toast";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    profile: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, profile }) => {
    const [name, setName] = useState(profile.name || "");
    const [bio, setBio] = useState(profile.bio || "");
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
    const [isUpdating, setIsUpdating] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateProfile } = useUserStore();
    const { loadUser } = useAuthStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            toast.error("Please enter your current password to confirm changes");
            return;
        }

        setIsUpdating(true);
        try {
            const success = await updateProfile({
                name,
                bio,
                avatar: avatarFile || undefined,
                password
            });

            if (success) {
                toast.success("Profile updated successfully");
                loadUser(); // Refresh auth user in authStore
                onClose();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred during update");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-white rounded-2xl p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar src={avatarPreview} name={profile.username} size={100} className="border-4 border-slate-800 group-hover:border-blue-500/50 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} className="text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <p className="text-xs text-blue-400 font-medium hover:underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            Change profile photo
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your display name"
                                className="bg-slate-900 border-slate-800 focus:border-blue-500 h-11 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Bio</label>
                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="bg-slate-900 border-slate-800 focus:border-blue-500 min-h-[100px] transition resize-none"
                            />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
                                <Lock size={14} /> Confirm Password
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Current password"
                                className="bg-slate-900 border-slate-800 focus:border-red-500 h-11 transition"
                                required
                            />
                            <p className="text-[10px] text-slate-500">Security: Verification required to update profile.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white h-11 rounded-xl font-semibold transition"
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition"
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 className="animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileModal;
