import { PostRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/postRepositoryMongoDB";

//importing types
import { PostDataInterface } from "../../types/postInterface";

export const postDbRepository = (repository: ReturnType<PostRepositoryMongoDB>) => {

    const createPost = async (postData: PostDataInterface) => await repository.createPost(postData);

    const getPosts = async (userId: string, following: string[], skip: number, limit: number) => await repository.getPosts(userId, following, skip, limit);

    const getPostById = async (postId: string) => await repository.getPostById(postId);

    const getPostsByUserId = async (userId: string, skip: number, limit: number) => await repository.getPostsByUserId(userId, skip, limit);

    const updatePostById = async (postId: string, postData: any) => await repository.updatePostById(postId, postData);

    const deletePostById = async (postId: string) => await repository.deletePostById(postId);

    const addComment = async (postId: string, commentId: string) => await repository.addComment(postId, commentId);

    const likePost = async (postId: string, userId: string) => await repository.likePost(postId, userId);

    const unlikePost = async (postId: string, userId: string) => await repository.unlikePost(postId, userId);

    const savePost = async (postId: string, userId: string) => await repository.savePost(postId, userId);

    const unsavePost = async (postId: string, userId: string) => await repository.unsavePost(postId, userId);

    const reportPost = async (postId: string, { userId, label} : {userId: string, label: string}) => await repository.reportPost(postId, {userId, label});

    const editPost = async (postId: string, postData: PostDataInterface) => await repository.editPost(postId, postData);

    const searchPostsByTextSearch = async(searchQuery: string, following: string[], skip: number, limit: number) => await repository.searchPostsByTextSearch(searchQuery, following, skip, limit);

    const searchPostsByRegexSearch = async(searchQuery: string, following: string[], skip: number, limit: number) => await repository.searchPostsByRegexSearch(searchQuery, following, skip, limit);

    const getUserLikedPosts = async(userId: string, skip: number, limit: number) => await repository.getUserLikedPosts(userId, skip, limit);

    const getSavedPosts = async(savedPostsId: string[], skip: number, limit: number) => await repository.getSavedPosts(savedPostsId, skip, limit);

    const countOfsearchPostsByRegexSearch = async(searchQuery: string, following: string[]) => await repository.countOfsearchPostsByRegexSearch(searchQuery, following);

    const getAllPosts = async(skip: number, limit: number) => await repository.getAllPosts(skip, limit);

    const getAllPostsCount = async() => await repository.getAllPostsCount();

    const getReportInfo = async(postId: string) => await repository.getReportInfo(postId);

    const blockPost = async(postId: string) => await repository.blockPost(postId);

    const unblockPost = async(postId: string) => await repository.unblockPost(postId);

    const getMonthlyPosts = async() => await repository.getMonthlyPosts();

    const getLikedUsers = async(postId: string) => await repository.getLikedUsers(postId);

    return {
        createPost,
        getPosts,
        getPostById,
        getPostsByUserId,
        updatePostById,
        deletePostById,
        addComment,
        likePost,
        unlikePost,
        savePost,
        unsavePost,
        reportPost,
        editPost,
        searchPostsByTextSearch,
        searchPostsByRegexSearch,
        getUserLikedPosts,
        getSavedPosts,
        countOfsearchPostsByRegexSearch,
        getAllPosts,
        getAllPostsCount,
        getReportInfo,
        blockPost,
        unblockPost,
        getMonthlyPosts,
        getLikedUsers
    }
}

export type PostDbInterface = typeof postDbRepository;