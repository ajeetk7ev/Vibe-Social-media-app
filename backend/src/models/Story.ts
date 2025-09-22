import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  mediaUrl: string;        
  mediaType: "image" | "video";
  viewers: mongoose.Types.ObjectId[]; // users who viewed
  createdAt: Date;
  expiresAt: Date;         // auto-delete logic handled in app
}

const StorySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, required: true }, // set when creating
  },
  { timestamps: true }
);

// Automatically set expiresAt = createdAt + 24h if not provided
StorySchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

export const Story = mongoose.model<IStory>("Story", StorySchema);
