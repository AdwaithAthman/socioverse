import { Document, Schema, model  } from "mongoose";

interface PostInterface extends Document {
    userId: string;
    description?: string;
    hashtags?: string;
    hashtagsArray?: string[];
    likes?: string[];
    comments?: string[];
    saved?: string[];
    reports: string[];
    image?: string[];
    video?: string;
    isBlock: boolean;
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
        likes: [],
        comments: [],
        saved: [],
        reports: [],
        image: [{
            type: String,
        }],
        video: {
            type: String,
        },
        isBlock: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

postSchema.index({ "hashtags": "text" , "description": "text"}, { "weights": { "hashtags": 10, "description": 1 } });
const Post = model<PostInterface>("Post", postSchema);

export default Post;