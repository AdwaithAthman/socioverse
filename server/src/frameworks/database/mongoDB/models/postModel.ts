import { Document, Schema, model  } from "mongoose";

interface PostInterface extends Document {
    userId: string;
    description?: string;
    hashtags?: string;
    hashtagsArray?: string[];
    name: string;
    username?: string;
    dp?: string;
    likes?: string[];
    comments?: string[];
    saved?: string[];
    reports: string[];
    image?: string[];
    video?: string;
}

const postSchema = new Schema<PostInterface>(
    {
        userId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        hashtags: {
            type: String,
        },
        hashtagsArray: [],
        name: {
            type: String,
        },
        username: {
            type: String,
        },
        dp: {
            type: String,
        },
        likes: [],
        comments: [],
        saved: [],
        reports: [],
        image: [{
            type: String,
        }],
        video: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

postSchema.index({ "hashtags": "text" , "description": "text"}, { "weights": { "hashtags": 10, "description": 1 } });
const Post = model<PostInterface>("Post", postSchema);

export default Post;