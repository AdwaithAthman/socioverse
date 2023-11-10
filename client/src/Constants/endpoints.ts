const END_POINTS = {
    LOGIN_USER: 'api/auth/login',
    SIGNUP_USER: 'api/auth/signup',
    LOGIN_GOOGLE: 'api/auth/google_auth',
    LOGOUT_USER: 'api/auth/logout',
    SEND_OTP: 'api/auth/send_otp',
    VERIFY_OTP: 'api/auth/verify_otp',
    RESET_PASSWORD: 'api/auth/resetPassword',
    REFRESH_TOKEN: 'api/auth/refresh',
    USERNAME_AVAILABILITY: 'api/auth/checkUsernameAvailability/',
    UPLOAD_COVER_PHOTO: 'api/profile/uploadCoverPhoto',
    UPLOAD_PROFILE_PHOTO: 'api/profile/uploadProfilePhoto',
    GET_USER_INFO: 'api/profile/getUserInfo',
    GET_OTHER_USER_INFO: 'api/profile/getOtherUserInfo',
    DELETE_COVER_PHOTO: 'api/profile/deleteCoverPhoto',
    DELETE_PROFILE_PHOTO: 'api/profile/deleteProfilePhoto',
    CHANGE_PASSWORD: 'api/profile/changePassword',
    EDIT_PROFILE: 'api/profile/editProfile',
    SEARCH_USERS: 'api/profile/searchUsers',
    ADD_USERNAME: 'api/profile/addUsername',
    CREATE_POST: 'api/post/createPost',
    EDIT_POST: 'api/post/editPost',
    GET_POSTS: 'api/post/getPosts',
    GET_POST_DETAILS: 'api/post/getPostDetails',
    DELETE_POST: 'api/post/deletePost',
    SEARCH_POSTS: 'api/post/searchPosts',  
    GET_USER_POSTS: 'api/post/getUserPosts',
    GET_OTHER_USER_POSTS: 'api/post/getOtherUserPosts',
    GET_USER_LIKED_POSTS: 'api/post/getUserLikedPosts',
    GET_USER_SAVED_POSTS: 'api/post/getUserSavedPosts',
    GET_LIKED_USERS: 'api/post/getLikedUsers',
    LIKE_POST: 'api/post/likePost',
    SAVE_POST: 'api/post/savePost',
    REPORT_POST: 'api/post/reportPost',
    ADD_COMMENT: 'api/post/addComment',
    GET_COMMENTS: 'api/post/getComments',
    EDIT_COMMENT: 'api/post/editComment',
    DELETE_COMMENT: 'api/post/deleteComment',
    DELETE_REPLY: 'api/post/deleteReply',
    REPORT_COMMENT: 'api/post/reportComment',
    REPORT_REPLY: 'api/post/reportReply',
    LIKE_COMMENT: 'api/post/likeComment',
    LIKE_REPLY: 'api/post/likeReply',
    ADD_REPLY: 'api/post/addReply',
    GET_REPLIES: 'api/post/getReplies',
    FOLLOW_USER: 'api/user/followUser',
    UNFOLLOW_USER: 'api/user/unfollowUser',
    GET_REST_OF_USERS: 'api/user/getRestOfUsers',
    GET_REST_OF_ALL_USERS: `api/user/getRestOfAllUsers`,
    GET_FOLLOWERS: `api/user/getFollowers`,
    GET_FOLLOWING: `api/user/getFollowing`,
    ADMIN_LOGIN: 'api/admin/login',
    REFRESH_ADMIN_TOKEN: 'api/admin/refresh',
    GET_USERS: 'api/admin/getUsers',
    GET_ALL_USERS_COUNT: 'api/admin/getAllUsersCount',
    GET_USERS_COUNT_ON_SEARCH: 'api/admin/getUsersCountOnSearch',
    GET_USERS_ON_SEARCH: 'api/admin/getUsersOnSearch',
    BLOCK_USER: 'api/admin/blockUser',
    UNBLOCK_USER: 'api/admin/unblockUser',
    GET_ALL_POSTS: 'api/admin/getAllPosts',
    GET_ALL_POSTS_COUNT: 'api/admin/getAllPostsCount',
    GET_BLOCKED_USERS_COUNT: 'api/admin/getBlockedUsersCount',
    GET_POSTS_COUNT_ON_SEARCH: 'api/admin/getPostsCountOnSearch',
    GET_REPORTED_COMMENTS_COUNT_ON_SEARCH: 'api/admin/getReportedCommentsCountOnSearch',
    GET_REPORTED_COMMENTS_ON_SEARCH: 'api/admin/getReportedCommentsOnSearch',
    GET_REPORTED_REPLIES_COUNT_ON_SEARCH: 'api/admin/getReportedRepliesCountOnSearch',
    GET_REPORTED_REPLIES_ON_SEARCH: 'api/admin/getReportedRepliesOnSearch',
    GET_POSTS_ON_SEARCH: 'api/admin/getPostsOnSearch',
    GET_ALL_REPORTED_COMMENTS_COUNT: 'api/admin/getAllReportedCommentsCount',
    GET_ALL_REPORTED_REPLIES_COUNT: 'api/admin/getAllReportedRepliesCount',
    BLOCK_POST: 'api/admin/blockPost',
    UNBLOCK_POST: 'api/admin/unblockPost',
    GET_REPORT_INFO: 'api/admin/getReportInfo', 
    GET_ALL_COMMENTS: 'api/admin/getAllComments',
    GET_ALL_REPLIES: 'api/admin/getAllReplies',
    GET_ALL_REPORTED_COMMENTS: 'api/admin/getAllReportedComments',
    GET_ALL_REPORTED_REPLIES: 'api/admin/getAllReportedReplies',
    GET_COMMENT_REPORTED_USERS: 'api/admin/getCommentReportedUsers',
    BLOCK_COMMENT: 'api/admin/blockComment',
    UNBLOCK_COMMENT: 'api/admin/unblockComment',
    GET_REPLY_REPORTED_USERS: 'api/admin/getReplyReportedUsers',
    BLOCK_REPLY: 'api/admin/blockReply',
    UNBLOCK_REPLY: 'api/admin/unblockReply',
    GET_MONTHLY_USER_SIGNUPS: 'api/admin/getMonthlyUserSignups',
    GET_MONTHLY_POSTS: 'api/admin/getMonthlyPosts',
    LOGOUT_ADMIN: 'api/admin/logout',
    FETCH_OTHER_USER_CHAT: 'api/chat/createOrAccessChat',
    FETCH_CHATS: 'api/chat/fetchChats',
    CREATE_GROUP_CHAT: 'api/chat/createGroup',
    UPDATE_GROUP: 'api/chat/updateGroup',
    REMOVE_FROM_GROUP: 'api/chat/removeFromGroup',
    GROUP_REMOVE: 'api/chat/groupRemove',
}

export default END_POINTS