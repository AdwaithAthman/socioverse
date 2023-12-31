import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  Tooltip,
  Switch,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  blockPost,
  getAllPosts,
  unblockPost,
  getReportInfo,
  getAllPostsCount,
  getPostsCountOnSearch,
  getPostsOnSearch,
} from "../../../API/Admin";
import moment from "moment";
import { toast } from "react-toastify";
import PostInfo from "./PostInfo";
import ReportInfo from "./ReportInfo";

//importing types
import common, { TOAST_ACTION } from "../../../Constants/common";
import { PostDataInterface } from "../../../Types/post";
import { ReportInfoInterface } from "../../../Types/admin";

const TABLE_HEAD = [
  "Created By",
  "Post View",
  "Created At",
  "Updated At",
  "Report status",
  "Total Reports",
  "Status",
  "Block / Unblock",
];

interface PostListInterface {
  page: number;
  posts: PostDataInterface[];
}

const PostList = () => {
  const [postsList, setPostsList] = useState<PostDataInterface[]>([]);
  const [postsPage, setPostsPage] = useState<PostListInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [reportInfo, setReportInfo] = useState<ReportInfoInterface[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchModeOn, setSearchModeOn] = useState<boolean>(false);

  useEffect(() => {
    fetchPostsCount();
  }, []);

  useEffect(() => {
    const isPageExist = postsPage.find((page) => page.page === currentPage);
    if (isPageExist) {
      setPostsList(isPageExist.posts);
    } else {
      searchModeOn ? fetchPostsOnSearch(searchText) : fetchPosts();
    }
  }, [currentPage, searchModeOn, postsPage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSearch = async () => {
      const postsCount = await getPostsCountOnSearch(searchText);
      if (postsCount.status === "success" && postsCount.count > 0) {
        setPostsPage([]);
        setTotalPages(Math.ceil(postsCount.count / 10));
        setCurrentPage(1);
        setSearchModeOn(true);
      } else {
        toast.error("No user found...!", TOAST_ACTION);
      }
    };

    if (searchText.length > 0) {
      timer = setTimeout(performSearch, 800);
    } else if (searchText.length === 0 && searchModeOn) {
      setSearchModeOn(false);
      setCurrentPage(1);
      fetchPostsCount();
      setPostsPage([]);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const fetchPostsCount = async () => {
    const response = await getAllPostsCount();
    if (response.status === "success") {
      setTotalPages(Math.ceil(response.count / 10));
    }
  };

  const fetchPosts = async () => {
    const response = await getAllPosts(currentPage);
    setPostsPage((prev) => [
      ...prev,
      {
        page: currentPage,
        posts: response.posts,
      },
    ]);
    setPostsList(response.posts);
  };

  const fetchPostsOnSearch = async (searchQuery: string) => {
    const response = await getPostsOnSearch(searchQuery, currentPage);
    setPostsPage((prev) => [
      ...prev,
      { page: currentPage, posts: response.posts },
    ]);
    setPostsList(response.posts);
  };

  const handleToggleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: string
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const response = await blockPost(postId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Post blocked successfully...!", TOAST_ACTION);
        setPostsList((prev) => {
          if (prev) {
            return prev.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  isBlock: true,
                };
              }
              return post;
            });
          }
          return [];
        });
      }
    } else {
      const response = await unblockPost(postId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Post unblocked successfully...!", TOAST_ACTION);
        setPostsList((prev) => {
          if (prev) {
            return prev.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  isBlock: false,
                };
              }
              return post;
            });
          }
          return [];
        });
      }
    }
  };

  const handleGetReportInfo = async (postId: string) => {
    const response = await getReportInfo(postId);
    if (response.status === "success") {
      setReportInfo(response.reportInfo);
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <Card className=" w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className=" flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Posts list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all posts
              </Typography>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className=" px-0 overflow-y-scroll h-[35rem]">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {postsList.map((post, index) => {
                const isLast = index === postsList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={post._id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {post.user.dp ? (
                          <Avatar
                            src={post.user.dp}
                            alt={post.user.name}
                            size="sm"
                          />
                        ) : (
                          <Avatar
                            src={common.DEFAULT_IMG}
                            alt={post.user.name}
                            size="sm"
                          />
                        )}
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {post.user.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            @{post.user.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Popover
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 50 },
                        }}
                      >
                        <PopoverHandler>
                          <Button
                            size="sm"
                            variant="outlined"
                            className="rounded-full text-black border-black"
                          >
                            View Post
                          </Button>
                        </PopoverHandler>
                        <PopoverContent className="z-[999] w-[32rem] overflow-hidden p-0">
                          <div className="p-10 bg-black bg-opacity-20">
                            <PostInfo post={post} />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {moment(post.createdAt).format("L")}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {post.createdAt !== post.updatedAt
                          ? moment(post.updatedAt).format("L")
                          : "N/A"}
                      </Typography>
                    </td>
                    <td
                      className={classes}
                      onClick={() => {
                        handleGetReportInfo(post._id);
                      }}
                    >
                      {post.reports && post.reports.length > 0 ? (
                        <Popover
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 50 },
                          }}
                        >
                          <PopoverHandler>
                            <Button
                              size="sm"
                              variant="outlined"
                              className="rounded-full text-black border-black flex items-center gap-2"
                            >
                              View Reports
                            </Button>
                          </PopoverHandler>
                          <PopoverContent className="z-[999] w-[31rem] max-h-[35rem] overflow-hidden p-0">
                            <div className=" h-full p-10 bg-black bg-opacity-20">
                              {reportInfo.length > 0 && (
                                <ReportInfo report={reportInfo} />
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Button
                          size="sm"
                          variant="outlined"
                          className="rounded-full text-black border-black"
                          disabled
                        >
                          View Reports
                        </Button>
                      )}
                    </td>
                    <td className={classes}>
                      {post.reports && post.reports.length > 0 ? (
                        <span
                          className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs 
                        font-bold leading-none text-white bg-red-600 rounded-full"
                        >
                          {post.reports.length}
                        </span>
                      ) : (
                        <h1 className="text-sm">N/A</h1>
                      )}
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={!post.isBlock ? "Active" : "Inactive"}
                          color={!post.isBlock ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      {!post.isBlock ? (
                        <Tooltip content="Block post">
                          <Switch
                            color="red"
                            onChange={(e) =>
                              post._id && handleToggleChange(e, post._id)
                            }
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Unblock post">
                          <Switch
                            checked
                            color="red"
                            onChange={(e) =>
                              post._id && handleToggleChange(e, post._id)
                            }
                          />
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default PostList;
