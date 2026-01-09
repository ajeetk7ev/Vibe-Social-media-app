import {type Story } from "@/types/story";

export const mockStories: Story[] = [
  {
    _id: "1",
    user: {
      username: "ajeet",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    mediaUrl: "https://picsum.photos/500/900?random=1",
    mediaType: "image",
  },
  {
    _id: "2",
    user: {
      username: "john",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    mediaUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    mediaType: "video",
  },
];
