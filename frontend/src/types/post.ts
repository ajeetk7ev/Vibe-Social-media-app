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
  createdAt: string;
}
