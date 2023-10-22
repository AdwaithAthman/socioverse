import { CommentRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/commentRepositoryMongoDB";

//importing types
import { CommentDataInterface, ReplyDataInterface } from "../../types/commentInterface";

export const commentDbRepository = (repository: ReturnType<CommentRepositoryMongoDB>) => {

    const addComment = async(commentObj: CommentDataInterface) => await repository.addComment(commentObj);

    const getComments = async(postId: string) => await repository.getComments(postId);

    const addReply = async(replyObj: ReplyDataInterface, commentId: string) => await repository.addReply(replyObj, commentId);

    const getReplies = async(commentId: string) => await repository.getReplies(commentId);

    const editComment = async(commentId: string, comment: string) => await repository.editComment(commentId, comment);

    const getCommentById = async(commentId: string) => await repository.getCommentById(commentId);

    const deleteComment = async(commentId: string) => await repository.deleteComment(commentId);

    const likeComment = async(commentId: string, userId: string) => await repository.likeComment(commentId, userId);

    const unlikeComment = async(commentId: string, userId: string) => await repository.unlikeComment(commentId, userId);

    const likeReply = async(replyId: string, commentId: string, userId: string) => await repository.likeReply(replyId, commentId, userId);
    
    const unlikeReply = async(replyId: string, commentId: string, userId: string) => await repository.unlikeReply(replyId, commentId, userId);

    return {
        addComment,
        getComments,
        addReply,
        getReplies,
        editComment,
        getCommentById,
        deleteComment,
        likeComment,
        unlikeComment,
        likeReply, 
        unlikeReply,
    }
}

export type CommentDbInterface = typeof commentDbRepository;