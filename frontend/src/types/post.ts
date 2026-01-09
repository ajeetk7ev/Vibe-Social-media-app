import {type Comment } from "./comment";

export interface Post {
  _id: string;
  author: {
    username: string;
    avatar?: string;
  };
  caption?: string;
  media: {
    url: string;
    mimeType: string;
  }[];
  likes: string[];
  comments?: Comment[];
  createdAt: string;
}
