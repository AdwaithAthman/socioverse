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

    const deleteReply = async(replyId: string, commentId: string) => await repository.deleteReply(replyId, commentId);

    const reportComment = async(commentId: string, userId: string) => await repository.reportComment(commentId, userId);

    const reportReply = async(replyId: string, commentId: string, userId: string) => await repository.reportReply(replyId, commentId, userId);

    const likeComment = async(commentId: string, userId: string) => await repository.likeComment(commentId, userId);

    const unlikeComment = async(commentId: string, userId: string) => await repository.unlikeComment(commentId, userId);

    const likeReply = async(replyId: string, commentId: string, userId: string) => await repository.likeReply(replyId, commentId, userId);
    
    const unlikeReply = async(replyId: string, commentId: string, userId: string) => await repository.unlikeReply(replyId, commentId, userId);

    const getAllReportedComments = async(skip: number, limit: number) => await repository.getAllReportedComments(skip, limit);

    const getAllReportedReplies = async(skip: number, limit: number) => await repository.getAllReportedReplies(skip, limit);

    const getCommentReportedUsers = async(commentId: string) => await repository.getCommentReportedUsers(commentId);

    const getReplyReportedUsers = async(replyId: string, commentId: string) => await repository.getReplyReportedUsers(replyId, commentId);

    const blockComment = async(commentId: string) => await repository.blockComment(commentId);

    const unblockComment = async(commentId: string) => await repository.unblockComment(commentId);

    const blockReply = async(replyId: string, commentId: string) => await repository.blockReply(replyId, commentId);

    const unblockReply = async(replyId: string, commentId: string) => await repository.unblockReply(replyId, commentId);

    const getAllReportedCommentsCount = async() => await repository.getAllReportedCommentsCount();

    const getAllReportedRepliesCount = async() => await repository.getAllReportedRepliesCount();

    const getReportedCommentsCountOnSearch = async(searchText: string) => await repository.getReportedCommentsCountOnSearch(searchText);

    const getReportedCommentsOnSearch = async(searchText: string, skip: number, limit: number) => await repository.getReportedCommentsOnSearch(searchText, skip, limit);

    const getReportedRepliesCountOnSearch = async(searchText: string) => await repository.getReportedRepliesCountOnSearch(searchText);

    const getReportedRepliesOnSearch = async(searchText: string, skip: number, limit: number) => await repository.getReportedRepliesOnSearch(searchText, skip, limit);

    return {
        addComment,
        getComments,
        addReply,
        getReplies,
        editComment,
        getCommentById,
        deleteComment,
        deleteReply,
        reportComment,
        reportReply,
        likeComment,
        unlikeComment,
        likeReply, 
        unlikeReply,
        getAllReportedComments,
        getAllReportedReplies,
        getCommentReportedUsers,
        getReplyReportedUsers,
        blockComment,
        unblockComment,
        blockReply,
        unblockReply,
        getAllReportedCommentsCount,
        getAllReportedRepliesCount,
        getReportedCommentsCountOnSearch,
        getReportedCommentsOnSearch,
        getReportedRepliesCountOnSearch,
        getReportedRepliesOnSearch,
    }
}

export type CommentDbInterface = typeof commentDbRepository;