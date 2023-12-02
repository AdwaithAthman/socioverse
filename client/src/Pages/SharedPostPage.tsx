import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostDetails } from "../API/Post";
import { PostDataInterface } from "../Types/post";
import PostCard from "../Components/Post/PostCard";
import { LikePostId, SavePostId } from "../Components/Profile/PostTabs";
import { useDispatch, useSelector } from "react-redux";
import { setIsSharedPost } from "../Redux/PostSlice";
import store, { StoreType } from "../Redux/Store";
import { getUserInfo } from "../API/Profile";
import { setCredentials } from "../Redux/AuthSlice";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import NotLoggedInAlert from "../Components/SharedPost/NotLoggedInAlert";

const SharedPostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: StoreType) => state.auth.user);
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDataInterface | null>(null);
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);
  const [postEdited, setPostEdited] = useState<PostDataInterface | null>(null);
  const [likedPostId, setLikedPostId] = useState<LikePostId | null>(null);
  const [savedPostId, setSavedPostId] = useState<SavePostId | null>(null);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const handleOpenAlert = () => {
    setOpenAlert((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setIsSharedPost(true));

    return () => {
      dispatch(setIsSharedPost(false));
    };
  }, []);

  useEffect(() => {
    fetchPostData(postId as string);
  }, [postId]);

  useEffect(() => {
    if (!user) {
      const userData = userInfo();
      if (!userData) {
        navigate("/error");
      }
    }
  }, [user]);

  const userInfo = async () => {
    try {
      const { user } = await getUserInfo();
      const { accessToken } = store.getState().auth;
      dispatch(setCredentials({ user, accessToken }));
      return user;
    } catch (error) {
      if (isAxiosError(error)) {
        const err: AxiosErrorData = error as AxiosErrorData;
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          setOpenAlert(true);
        }
      }
    }
  };

  const fetchPostData = async (postId: string) => {
    const response = await getPostDetails(postId);
    if (response.post) {
      console.log("postData for share", response.post);
      setPost(response.post);
    } else {
      navigate("/error");
    }
  };

  return (
    <>
      {post && (
        <div
          className="flex items-center justify-center lg:w-[30rem] 
          md:w-96 w-80 mx-auto mt-8"
        >
          <PostCard
            postData={post}
            setDeletedPostId={setDeletedPostId}
            setReportedPostId={setReportedPostId}
            setPostEdited={setPostEdited}
            setSavedPostId={setSavedPostId}
            setLikedPostId={setLikedPostId}
          />
        </div>
      )}
      <NotLoggedInAlert
        openAlert={openAlert}
        handleOpenAlert={handleOpenAlert}
        postId={postId as string}
      />
    </>
  );
};

export default SharedPostPage;
