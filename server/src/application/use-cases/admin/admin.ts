import AppError from "../../../utils/appError";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import configKeys from "../../../config";
import { HttpStatus } from "../../../types/httpStatus";
import { UserDbInterface, userDbRepository } from "../../repositories/userDbRepository";
import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository";
import { CommentDbInterface, commentDbRepository } from "../../repositories/commentDbRepository";

export const handleAdminLogin = async (
    email: string,
    password: string,
    authService: ReturnType<AuthServiceInterface>
) => {
    try {
        const adminCredentials = {
            email: configKeys.ADMIN_EMAIL,
            password: configKeys.ADMIN_PASSWORD
        }
        if (email === adminCredentials.email && password === adminCredentials.password) {
            const payload = {
                userId: "admin",
                role: "admin"
            }
            const refreshToken = authService.generateRefreshToken(payload);
            const accessToken = authService.generateAccessToken(payload);
            return { accessToken, refreshToken };
        } else {
            throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
        }
    }
    catch (err) {
        console.log(err)
        throw new AppError("Invalid email or password!", HttpStatus.UNAUTHORIZED);
    }
}

export const handleRefreshAdminAccessToken = async (
    cookies: { adminRefreshToken: string },
    authService: ReturnType<AuthServiceInterface>
) => {
    try {
        const { adminRefreshToken } = cookies;
        if (!adminRefreshToken) {
            throw new AppError("No refresh token found!", HttpStatus.UNAUTHORIZED);
        }
        const { userId, role } = authService.verifyRefreshToken(adminRefreshToken);
        const accessToken = authService.generateAccessToken({ userId, role });
        return accessToken;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Invalid refresh token!", HttpStatus.UNAUTHORIZED);
    }
}

export const handleGetUsers = async (
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try {
        const users = await dbUserRepository.getAllUsers();
        return users;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching users!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const handleGetAllUsersCount = async (
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try {
        const count = await dbUserRepository.getAllUsersCount();
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching users count!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


export const handleBlockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try {
        await dbUserRepository.blockUser(userId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while blocking user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try {
        await dbUserRepository.unblockUser(userId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while blocking user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllPosts = async (
    postDbRepository: ReturnType<PostDbInterface>,
    skip: number,
    limit: number,
) => {
    try {
        const posts = await postDbRepository.getAllPosts(Number(skip), Number(limit));
        return posts;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching posts", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllPostsCount = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        const count = await postDbRepository.getAllPostsCount();
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching posts count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetBlockedUsersCount = async (
    userDbRepository: ReturnType<UserDbInterface>
) => {
    try{
        const count = await userDbRepository.getBlockedUsersCount();
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching blocked users count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllReportedCommentsCount = async (
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        const count = await commentDbRepository.getAllReportedCommentsCount();
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported comments count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllReportedRepliesCount = async (
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        const count = await commentDbRepository.getAllReportedRepliesCount();
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported replies count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportInfo = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        const reportInfo = await postDbRepository.getReportInfo(postId);
        return reportInfo;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching report info", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleBlockPost = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        await postDbRepository.blockPost(postId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while blocking post", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockPost = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        await postDbRepository.unblockPost(postId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while unblocking post", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllReportedComments = async (
    commentDbRepository: ReturnType<CommentDbInterface>,
    skip: number,
    limit: number,
) => {
    try {
        const comments = await commentDbRepository.getAllReportedComments(Number(skip), Number(limit));
        return comments;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported comments", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetCommentReportedUsers = async (
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        const reportedUsers = await commentDbRepository.getCommentReportedUsers(commentId);
        return reportedUsers;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported users", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReplyReportedUsers = async (
    replyId: string,
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        const reportedUsers = await commentDbRepository.getReplyReportedUsers(replyId, commentId);
        return reportedUsers;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported users", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleBlockComment = async (
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        await commentDbRepository.blockComment(commentId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while blocking comment", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockComment = async (
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        await commentDbRepository.unblockComment(commentId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while unblocking comment", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllReportedReplies = async (
    commentDbRepository: ReturnType<CommentDbInterface>,
    skip: number,
    limit: number,
) => {
    try {
        const replies = await commentDbRepository.getAllReportedReplies(Number(skip), Number(limit));
        return replies;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching reported replies", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleBlockReply = async (
    replyId: string,
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        await commentDbRepository.blockReply(replyId, commentId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while blocking reply", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockReply = async (
    replyId: string,
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        await commentDbRepository.unblockReply(replyId, commentId);
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while unblocking reply", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetMonthlyUserSignups = async (
    userDbRepository: ReturnType<UserDbInterface>
) => {
    try {
        const monthlyUserSignups = await userDbRepository.getMonthlyUserSignups();
        return monthlyUserSignups;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching monthly user signups", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetMonthlyPosts = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        const monthlyPosts = await postDbRepository.getMonthlyPosts();
        return monthlyPosts;
    }
    catch (err) {
        console.log("Error getting monthly posts: ", err)
        throw new AppError("Error getting monthly posts!", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetUsersCountOnSearch = async (
    searchQuery: string,
    userDbRepository: ReturnType<UserDbInterface>
) => {
    try {
        const count = await userDbRepository.getUsersCountOnSearch(searchQuery);
        return count;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching users count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetUsersOnSearch = async (
    searchQuery: string,
    skip: number,
    limit: number,
    userDbRepository: ReturnType<UserDbInterface>
) => {
    try {
        const users = await userDbRepository.getUsersOnSearch(searchQuery, Number(skip), Number(limit));
        return users;
    }
    catch (err) {
        console.log(err)
        throw new AppError("Error while fetching users", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetPostsCountOnSearch = async (
    searchQuery: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        const count = await postDbRepository.getPostsCountOnSearch(searchQuery);
        return count;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching posts count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetPostsOnSearch = async (
    searchQuery: string,
    skip: number,
    limit: number,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        const posts = await postDbRepository.getPostsOnSearch(searchQuery, Number(skip), Number(limit));
        return posts;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching posts", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportedCommentsCountOnSearch = async (
    searchQuery: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const count = await commentDbRepository.getReportedCommentsCountOnSearch(searchQuery);
        return count;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching reported comments count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportedCommentsOnSearch = async (
    searchQuery: string,
    skip: number,
    limit: number,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const comments = await commentDbRepository.getReportedCommentsOnSearch(searchQuery, Number(skip), Number(limit));
        return comments;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching reported comments", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportedRepliesCountOnSearch = async (
    searchQuery: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const count = await commentDbRepository.getReportedRepliesCountOnSearch(searchQuery);
        return count;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching reported replies count", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportedRepliesOnSearch = async (
    searchQuery: string,
    skip: number,
    limit: number,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const replies = await commentDbRepository.getReportedRepliesOnSearch(searchQuery, Number(skip), Number(limit));
        return replies;
    }
    catch(err){
        console.log(err)
        throw new AppError("Error while fetching reported replies", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

