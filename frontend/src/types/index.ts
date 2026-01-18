export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  followers?: string[];
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  author: {
    username: string;
    avatar?: string;
  };
  caption?: string;
  media: { url: string; mimeType: string }[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  mediaUrl: string;
  mediaType: "image" | "video";
  viewers?: string[];
  likes?: string[];
  createdAt: string;
  expiresAt: string;
}

export interface Comment {
  _id: string;
  user: {
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  fromUser: string;
  type: "like" | "comment" | "follow";
  post?: string;
  isRead: boolean;
  createdAt: string;
}

export * from './auth';