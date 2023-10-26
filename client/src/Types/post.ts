
export interface PostDataInterface {
    _id: string,
    userId: string,
    description?: string,
    hashtags?: string,
    hashtagsArray?: string[],
    likes?: string[],
    comments?: string[],
    saved?: string[],
    reports?: string[],
    image?: string[] ,
    video?: string,
    newPostCreated?: boolean,
    isBlock: boolean,
    updatedAt: string,
    createdAt: string,
    user: {
        _id: string,
        name: string,
        username: string,
        email: string,
        dp?: string,
    }
}

export interface PostInterface {
    status: string,
    message: string,
    post: PostDataInterface
}

export interface PostEditInterface {
    status: string,
    message: string,
    editedPost: PostDataInterface
}

export interface GetPostsInterface {
    status: string,
    message: string,
    posts: PostDataInterface[]
}

export interface DeletePostResponse {
    status: string,
    message: string,
}

export interface CommentObjectInterface {
    postId: string,
    comment: string,
}

export interface ReplyObjectInterface {
    commentId: string,
    reply: string,
}

export interface CommentInterface {
    _id: string,
    postId: string,
    userId: string,
    comment: string,
    replies: string[],
    reports: string[],
    likes: string[],
    createdAt: Date,
    updatedAt: Date,
    user?: {
        _id: string,
        name: string,
        username: string,
        dp: string,
    }
}

export interface ReplyInterface {
    _id: string,
    userId: string,
    reply: string,
    reports: string[],
    likes: string[],
    createdAt: Date,
    updatedAt: Date,
    user?: {
        _id: string,
        name: string,
        username: string,
        dp: string,
    }
}

export interface CommentPostInterface {
    status: string,
    message: string,
    comment: CommentInterface,
}

export interface ReplyPostInterface {
    status: string,
    message: string,
    reply: ReplyInterface,
}

export interface GetCommentsInterface {
    status: string,
    message: string,
    comments: CommentInterface[],
}

export interface GetRepliesInterface {
    status: string,
    message: string,
    replies: ReplyInterface[],
}

export interface LikePost {
    status: string,
    message: string,
}

export interface SavePost {
    status: string,
    message: string,
}

export interface ReportPost {
    status: string, 
    message: string,
}

export interface EditCommentResponse {
    status: string,
    message: string,
    editedComment: CommentInterface,
}

export interface DeleteCommentResponse {
    status: string,
    message: string,
}

export interface GetSearchPostsInterface {
    status: string,
    message: string,
    posts: PostDataInterface[],
    count: number
}

export interface LikeCommentResponse {
    status: string,
    message: string,
}

export interface GetUserPostsInterface {
    status: string,
    message: string,
    posts: PostDataInterface[],
}