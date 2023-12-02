import mongoose,{Schema, model} from "mongoose";

//Schema for users

const userSchema = new Schema (
    {
        name: {
            type: String,
            minlength: 3,
            required: true,
        },
        username: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
        },
        password: {
            type: String,
            minlength: 6,
        },
        dp: {
            type: String,
        },
        coverPhoto: {
            type: String,
        },
        bio: {
            type: String,
        },
        gender: {
            type: String,
        },
        city: {
            type: String,
        },
        isBlock: {
            type: Boolean,
            default: false,
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        isGoogleSignIn: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,
            default: null,
        },
        refreshTokenExpiresAt: {
            type: Date,
            default: null,
        },
        posts: [],
        blockedUsers: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        blockingUsers: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        followers: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        following: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        requests: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        requested: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        savedPosts: [{
            type: mongoose.Types.ObjectId,
        }],
        notifications: [{
            type: mongoose.Types.ObjectId,
            ref: "Message"
        }]
    },
    {
        timestamps: true
    }
);

userSchema.index({ username: "text", name: "text", email: "text" });
const User = model("User", userSchema);

export default User;