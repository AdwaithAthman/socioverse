import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { PostDataInterface } from "../../Types/post";
import PostCard from "../Post/PostCard";
import { ReactComponent as Loader } from "../../assets/Loader.svg";
import {
  getUserPosts,
  getUserLikedPosts,
  getUserSavedPosts,
  getPostDetails,
  getOtherUserPosts,
} from "../../API/Post";
import { useSelector } from "react-redux";

//importing types
import { StoreType } from "../../Redux/Store";

export interface LikePostId {
  postId: string;
  action: boolean;
}

export interface SavePostId {
  postId: string;
  action: boolean;
}

function PostTabs({ userId }: { userId?: string }) {
  const myUserId = useSelector((state: StoreType) => state?.auth?.user?._id);
  const [myPosts, setMyPosts] = useState<PostDataInterface[]>([]);
  const [otherUserPosts, setOtherUserPosts] = useState<PostDataInterface[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostDataInterface[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostDataInterface[]>([]);
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);
  const [postEdited, setPostEdited] = useState<PostDataInterface | null>(null);
  const [likedPostId, setLikedPostId] = useState<LikePostId | null>(null);
  const [savedPostId, setSavedPostId] = useState<SavePostId | null>(null);
  const [isLastPostPage, setIsLastPostPage] = useState<boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [myPostPage, setMyPostPage] = useState<number>(1);
  const [otherUserPostPage, setOtherUserPostPage] = useState<number>(1);
  const [likedPostPage, setLikedPostPage] = useState<number>(1);
  const [savedPostPage, setSavedPostPage] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<string>("myPosts");
  const [likeTabClickedAgain, setLikeTabClickedAgain] =
    useState<boolean>(false);
  const [saveTabClickedAgain, setSaveTabClickedAgain] =
    useState<boolean>(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setIsLastPostPage(false);
  },[userId])

  useEffect(() => {
    if (myPostPage === 1 && (userId === myUserId)) {
      setIsPostLoading(true);
      loadInitialMyPosts();
      setIsPostLoading(false);
    }
  }, [myPostPage, userId, myUserId]);

  useEffect(() => {
    if (otherUserPostPage === 1 && userId && userId !== myUserId) {
      setIsPostLoading(true);
      loadInitialOtherPosts();
      setIsPostLoading(false);
    }
  }, [otherUserPostPage]);

  useEffect(() => {
    if (deletedPostId) {
      setMyPosts(myPosts.filter((post) => post._id !== deletedPostId));
      setLikedPosts(likedPosts.filter((post) => post._id !== deletedPostId));
      setSavedPosts(savedPosts.filter((post) => post._id !== deletedPostId));
      setDeletedPostId(null);
    }
    if (reportedPostId) {
      setReportedPostId(null);
    }
    if (postEdited) {
      setMyPosts(
        myPosts.map((post) => (post._id === postEdited._id ? postEdited : post))
      );
      setLikedPosts(
        likedPosts.map((post) =>
          post._id === postEdited._id ? postEdited : post
        )
      );
      setSavedPosts(
        savedPosts.map((post) =>
          post._id === postEdited._id ? postEdited : post
        )
      );
      setPostEdited(null);
    }
  }, [deletedPostId, reportedPostId, postEdited]);

  useEffect(() => {
    if (likedPostId) {
      const updateLikedPosts = async () => {
        if (likedPostId.action) {
          const newLikedPost = await getPostDetails(likedPostId.postId);
          setLikedPosts([newLikedPost.post, ...likedPosts]);
        } else {
          setLikedPosts(
            likedPosts.filter((post) => post._id !== likedPostId.postId)
          );
        }
        setLikedPostId(null);
      };
      updateLikedPosts();
      setLikedPostId(null);
    }
    if (savedPostId) {
      const updateSavedPosts = async () => {
        if (savedPostId.action) {
          const newSavedPost = await getPostDetails(savedPostId.postId);
          setSavedPosts([newSavedPost.post, ...savedPosts]);
        } else {
          setSavedPosts(
            savedPosts.filter((post) => post._id !== savedPostId.postId)
          );
        }
      };
      updateSavedPosts();
      setSavedPostId(null);
    }
  }, [likedPostId, savedPostId]);

  useEffect(() => {
    setIsLastPostPage(false);
  }, [currentTab]);

  const loadInitialMyPosts = async () => {
      const result = await getUserPosts(myPostPage);
      setMyPosts(result.posts);
      setMyPostPage(myPostPage + 1);
      if(result.posts.length < 3){
        setIsLastPostPage(true);
      }
  };

  const loadInitialOtherPosts = async () => {
    if (userId && userId !== myUserId){
      const result = await getOtherUserPosts(userId, myPostPage);
        setOtherUserPosts(result.posts);
        setOtherUserPostPage(otherUserPostPage+ 1);
        if(result.posts.length < 3){
          setIsLastPostPage(true);
        }
    }
  }

  const handleTabHeaderClick = async (value: string) => {
    setIsPostLoading(true);
    if (value === "saved" && !saveTabClickedAgain) {
      const result = await getUserSavedPosts(savedPostPage);
      setSavedPosts(result.posts);
      setSavedPostPage(savedPostPage + 1);
      setSaveTabClickedAgain(true);
    } else if (value === "liked" && !likeTabClickedAgain) {
      const result = await getUserLikedPosts(likedPostPage);
      setLikedPosts(result.posts);
      setLikedPostPage(likedPostPage + 1);
      setLikeTabClickedAgain(true);
    }
    setIsPostLoading(false);
  };

  const data = [
    {
      label: "My Posts",
      value: "myPosts",
      desc: myPosts.length > 0 ? myPosts : "No posts yet posted by the user",
    },
    {
      label: "Liked",
      value: "liked",
      desc:
        likedPosts.length > 0 ? likedPosts : "No posts yet liked by the user",
    },
    {
      label: "Saved",
      value: "saved",
      desc:
        savedPosts.length > 0 ? savedPosts : "No posts yet saved by the user",
    },
  ];

  const dataOfOtherUser = [
    {
      label: "My Posts",
      value: "myPosts",
      desc:
        otherUserPosts.length > 0
          ? otherUserPosts
          : "No posts yet posted by the user",
    },
  ];

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isPostLoading && !isLastPostPage) {
          setIsPostLoading(true);
          if(userId === myUserId){
          if (currentTab === "myPosts") {
            const newPostResult = await getUserPosts(myPostPage);
            if (newPostResult.posts.length === 0) {
              setIsPostLoading(false);
              setIsLastPostPage(true);
              return;
            }
            setMyPosts([...myPosts, ...newPostResult.posts]);
            setMyPostPage(myPostPage + 1);
          } else if (currentTab === "saved") {
            const newPostResult = await getUserSavedPosts(savedPostPage);
            if (newPostResult.posts.length === 0) {
              setIsPostLoading(false);
              setIsLastPostPage(true);
              return;
            }
            setSavedPosts([...savedPosts, ...newPostResult.posts]);
            setSavedPostPage(savedPostPage + 1);
          } else if (currentTab === "liked") {
            const newPostResult = await getUserLikedPosts(likedPostPage);
            if (newPostResult.posts.length === 0) {
              setIsPostLoading(false);
              setIsLastPostPage(true);
              return;
            }
            setLikedPosts([...likedPosts, ...newPostResult.posts]);
            setLikedPostPage(likedPostPage + 1);
          }
        }
        else{
          const newPostResult = userId && await getOtherUserPosts(userId, otherUserPostPage);
          if (newPostResult && newPostResult.posts.length === 0) {
            setIsPostLoading(false);
            setIsLastPostPage(true);
            return;
          }
          newPostResult && setOtherUserPosts([...otherUserPosts, ...newPostResult.posts]);
          setOtherUserPostPage(otherUserPostPage + 1);
        }
          setIsPostLoading(false);
        }
      },
      {
        threshold: 1,
      }
    );

    if (sentinelRef.current) {
      // Check if the sentinel element exists
      observer1.observe(sentinelRef.current); // Use the ref to get the DOM element
    }

    return () => {
      if (sentinelRef.current) {
        observer1.unobserve(sentinelRef.current);
      }
    };
  }, [isPostLoading, myPostPage, isLastPostPage, currentTab, userId, otherUserPostPage]);

  useEffect(() => {
    console.log("count of myPosts: ", myPosts.length);
    console.log("count of savedPosts: ", savedPosts.length);
    console.log("count of likedPosts: ", likedPosts.length);
    console.log("count of otherUserPosts: ", otherUserPosts.length);
    console.log("isLastPostPage: ", isLastPostPage);
    console.log("isPostLoading: ", isPostLoading);
  });

  return (
    <Tabs id="custom-animation" value="myPosts">
      <TabsHeader className="sticky overflow-y-hidden">
        {(myUserId === userId ? data : dataOfOtherUser).map(
          ({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => {
                handleTabHeaderClick(value);
                setCurrentTab(value);
              }}
            >
              {label}
            </Tab>
          )
        )}
      </TabsHeader>
      <TabsBody
        animate={{
          initial: { y: 250 },
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
        className="overflow-y-auto h-[80vh] no-scrollbar"
      >
        {(myUserId === userId ? data : dataOfOtherUser).map(
          ({ value, desc }) => (
            <TabPanel key={value} value={value} className="mx-auto">
              {typeof desc === "string" ? (
                <h1 className="">{desc}</h1>
              ) : (
                <div className="flex flex-col gap-5 w-[30rem] mx-auto">
                  {desc.map((post) => (
                    <>
                      {console.log("post_id+value: ", post._id + value)}
                      <PostCard
                        postData={post}
                        setDeletedPostId={setDeletedPostId}
                        setReportedPostId={setReportedPostId}
                        setPostEdited={setPostEdited}
                        setSavedPostId={setSavedPostId}
                        setLikedPostId={setLikedPostId}
                        key={post._id + value}
                      />
                    </>
                  ))}
                  {isLastPostPage && (
                    <div className="text-center mt-5"> No posts...</div>
                  )}
                  <div
                    id="sentinel"
                    style={{ height: "1px" }}
                    className="mt-10 mb-20"
                    ref={sentinelRef}
                  >
                    {!isLastPostPage && (
                      <Loader className="w-20 h-20 animate-spin" />
                    )}
                  </div>
                </div>
              )}
            </TabPanel>
          )
        )}
      </TabsBody>
    </Tabs>
  );
}

export default PostTabs;
