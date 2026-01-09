import {type Post } from "@/types/post";

export const mockPosts: Post[] = [
  {
    _id: "1",
    author: { username: "ajeet" },
    caption: "Building my own Instagram clone 🚀",
    media: [
      {
        url: "https://picsum.photos/600/600",
        mimeType: "image/jpeg",
      },
    ],
    likes: ["1", "2"],
    createdAt: new Date().toISOString(),
  },
];
