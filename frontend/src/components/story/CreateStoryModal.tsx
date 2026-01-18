import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { useStoryStore } from "@/stores/storyStore";
import toast from "react-hot-toast";

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateStoryModal: React.FC<Props> = ({ open, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { createStory } = useStoryStore();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size should be less than 10MB");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const clearSelection = () => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const success = await createStory(file);
            if (success) {
                toast.success("Story posted successfully!");
                onClose();
                clearSelection();
            } else {
                toast.error("Failed to post story");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white p-0 overflow-hidden rounded-2xl">
                <DialogHeader className="p-4 border-b border-slate-800">
                    <DialogTitle className="text-center text-lg font-bold">Create New Story</DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {!preview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[9/16] max-h-[500px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-900/50 transition bg-slate-900/20"
                        >
                            <div className="p-4 rounded-full bg-slate-800/50">
                                <UploadCloud size={40} className="text-blue-400" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="font-semibold">Click to upload media</p>
                                <p className="text-xs text-slate-500">Supports images and videos (max 10MB)</p>
                            </div>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative aspect-[9/16] max-h-[500px] rounded-2xl overflow-hidden bg-black shadow-2xl">
                                {file?.type.startsWith("video") ? (
                                    <video src={preview} className="w-full h-full object-cover" controls muted />
                                ) : (
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={clearSelection}
                                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white h-12 rounded-xl font-semibold"
                                    onClick={clearSelection}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold shadow-lg shadow-blue-900/20"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : "Share Story"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateStoryModal;
