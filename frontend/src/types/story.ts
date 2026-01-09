export interface Story {
  _id: string;
  user: {
    username: string;
    avatar?: string;
  };
  mediaUrl: string;
  mediaType: "image" | "video";
}
