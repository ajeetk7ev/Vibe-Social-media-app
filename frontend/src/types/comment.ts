export interface Comment {
  _id: string;
  user: {
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}
