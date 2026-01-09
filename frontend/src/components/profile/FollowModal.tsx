import { Dialog, DialogContent } from "@/components/ui/dialog";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";

const FollowModal = ({ open, onClose, title }: any) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border border-slate-800 rounded-xl max-w-md p-0">
        <div className="p-4 border-b border-slate-800 text-center text-white font-medium">
          {title}
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name="user" />
                <div>
                  <p className="text-white text-sm font-medium">username</p>
                  <p className="text-slate-400 text-xs">Full Name</p>
                </div>
              </div>
              <Button size="sm">Follow</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
