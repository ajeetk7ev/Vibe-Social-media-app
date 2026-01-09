import {type Comment } from "@/types/comment";

export const mockComments: Comment[] = [
  {
    _id: "1",
    user: { username: "john" },
    text: "🔥🔥 Awesome post!",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    user: { username: "rahul" },
    text: "Great work bro 💯",
    createdAt: new Date().toISOString(),
  },
];
