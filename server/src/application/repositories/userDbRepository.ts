import { UserRepositoryMongoDB } from "../../frameworks/database/mongoDB/repositories/userRepositoryMongoDB";

//importing types
import { UserInterface, GoogleUserInterface } from "../../types/userInterface";
import { ProfileInterface } from "../../types/profileInterface";

export const userDbRepository = (repository: ReturnType<UserRepositoryMongoDB>) => {

    const addUser = async(user: UserInterface | GoogleUserInterface) =>  await repository.addUser(user)

    const getUserById = async(userId: string) =>  await repository.getUserById(userId)
    
    const getUserByEmail = async(email: string) => await repository.getUserByEmail(email)

    const getUserByUsername = async(username: string) => await repository.getUserByUsername(username)

    const addUsername = async(userId: string, username: string) => await repository.addUsername(userId, username)

    const logoutUser = async(userId: string) => await repository.logoutUser(userId)

    const getUserByPhoneNumber = async(phoneNumber: number) => await repository.getUserByPhoneNumber(phoneNumber)

    const addRefreshTokenAndExpiry = async(email:string, refreshToken:string) => await repository.addRefreshTokenAndExpiry(email, refreshToken)
    
    const updateCoverPhoto = async(userId: string, secure_url: string) => await repository.updateCoverPhoto(userId, secure_url)

    const updateDp = async(userId: string, secure_url: string) => await repository.updateDp(userId, secure_url)

    const deleteCoverPhoto = async(userId: string) => await repository.deleteCoverPhoto(userId)

    const deleteProfilePhoto = async(userId: string) => await repository.deleteProfilePhoto(userId)

    const updatePassword = async(userId: string, newPassword: string) => await repository.updatePassword(userId, newPassword)

    const resetPassword = async(email: string, newPassword: string) => await repository.resetPassword(email, newPassword)

    const updateProfile = async(profileInfo: ProfileInterface) => await repository.updateProfile(profileInfo)
    
    const getRestOfUsers = async(userId: string, limit: number) => await repository.getRestOfUsers(userId, limit)

    const followUser = async(userId: string, friendId: string) => await repository.followUser(userId, friendId)
    
    const unfollowUser = async(userId: string, friendId: string) => await repository.unfollowUser(userId, friendId)

    const getFollowers = async(userId: string) => await repository.getFollowers(userId)

    const getFollowing = async(userId: string) => await repository.getFollowing(userId)

    const getSuggestions = async(userId: string) => await repository.getSuggestions(userId)

    const updatePosts = async(userId: string, postId: string) => await repository.updatePosts(userId, postId)

    const deletePost = async(userId: string, postId: string) => await repository.deletePost(userId, postId)

    const savePost = async(userId: string, postId: string) => await repository.savePost(userId, postId)

    const unsavePost = async(userId: string, postId: string) => await repository.unsavePost(userId, postId)

    const searchUsers = async(searchQuery: string) => await repository.searchUsers(searchQuery)

    const changeIsAccountVerified = async(email: string) => await repository.changeIsAccountVerified(email)

    const changeIsAccountUnverified = async(userId: string) => await repository.changeIsAccountUnverified(userId)
    
    const getAllUsers = async(skip: number, limit: number) => await repository.getAllUsers(skip, limit)

    const getAllUsersCount = async() => await repository.getAllUsersCount()

    const getBlockedUsersCount = async() => await repository.getBlockedUsersCount()

    const blockUser = async(userId: string) => await repository.blockUser(userId)

    const unblockUser = async(userId: string) => await repository.unblockUser(userId)

    const getMonthlyUserSignups = async() => await repository.getMonthlyUserSignups();

    const getUsersCountOnSearch = async(searchQuery: string) => await repository.getUsersCountOnSearch(searchQuery);

    const getUsersOnSearch = async(searchQuery: string, skip: number, limit: number) => await repository.getUsersOnSearch(searchQuery, skip, limit);

    const addNotification = async(userId: string, messageId: string) => await repository.addNotification(userId, messageId);

    const deleteNotification = async(userId: string, messageId: string) => await repository.deleteNotification(userId, messageId);

    return {
        addUser,
        getUserById,
        getUserByEmail,
        getUserByUsername,
        addUsername,
        logoutUser,
        getUserByPhoneNumber,
        addRefreshTokenAndExpiry,
        updateCoverPhoto,
        updateDp,
        deleteCoverPhoto,
        deleteProfilePhoto,
        updatePassword,
        resetPassword,
        updateProfile,
        getRestOfUsers,
        followUser,
        unfollowUser,
        getFollowers,
        getFollowing,
        getSuggestions,
        updatePosts,
        deletePost,
        savePost,
        unsavePost,
        searchUsers,
        changeIsAccountVerified,
        changeIsAccountUnverified,
        getAllUsers,
        getAllUsersCount,
        getBlockedUsersCount,
        blockUser,
        unblockUser,
        getMonthlyUserSignups,
        getUsersCountOnSearch,
        getUsersOnSearch,
        addNotification,
        deleteNotification,
    }
}

export type UserDbInterface = typeof userDbRepository;