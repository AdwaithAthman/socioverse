import AppError from "../../../utils/appError";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import configKeys from "../../../config";
import { HttpStatus } from "../../../types/httpStatus";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository";
import { CommentDbInterface } from "../../repositories/commentDbRepository";

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
            console.log("admin login is working properly")
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
        const {userId, role} = authService.verifyRefreshToken(adminRefreshToken);
        const accessToken = authService.generateAccessToken({userId, role});
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

export const handleBlockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try{
        await dbUserRepository.blockUser(userId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while blocking user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    try{
        await dbUserRepository.unblockUser(userId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while blocking user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllPosts = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        const posts = await postDbRepository.getAllPosts();
        return posts;
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while fetching posts", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetReportInfo = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        const reportInfo = await postDbRepository.getReportInfo(postId);
        return reportInfo;
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while fetching report info", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleBlockPost = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        await postDbRepository.blockPost(postId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while blocking post", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockPost = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try{
        await postDbRepository.unblockPost(postId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while unblocking post", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllReportedComments = async (
   commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const comments = await commentDbRepository.getAllReportedComments();
        return comments;
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while fetching reported comments", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetCommentReportedUsers = async (
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        const reportedUsers = await commentDbRepository.getCommentReportedUsers(commentId);
        return reportedUsers;
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while fetching reported users", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleBlockComment = async(
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        await commentDbRepository.blockComment(commentId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while blocking comment", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleUnblockComment = async(
    commentId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try{
        await commentDbRepository.unblockComment(commentId);
    }
    catch(err){
        console.log(err)
        throw new AppError ("Error while unblocking comment", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}